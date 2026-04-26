import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'

import { AgentDetailPage } from './pages/AgentDetail'
import { AgentNotFoundPage } from './pages/AgentNotFound'
import { AgentsPage } from './pages/Agents'
import { AilmentsPage } from './pages/Ailments'
import {
  AppointmentBookingPage,
  type AppointmentBookingErrors,
  type AppointmentBookingValues,
} from './pages/AppointmentBooking'
import { AppointmentConfirmationPage } from './pages/AppointmentConfirmation'
import { DashboardPage } from './pages/Dashboard'
import { Home } from './pages/Home'
import { NotFoundPage } from './pages/NotFound'
import { ServerErrorPage } from './pages/ServerError'
import { TherapiesPage } from './pages/Therapies'
import {
  AGENT_STATUS_OPTIONS,
  APPOINTMENT_STATUS_OPTIONS,
  createClinicRepository,
  type AgentStatus,
  type AppointmentStatus,
  type ClinicRepository,
} from './data/clinicRepository'

type AppOptions = {
  databasePath?: string
  clinicRepository?: ClinicRepository
  logger?: (message: string) => void
}

const CONTROL_CHARS_PATTERN = /[\u0000-\u001F\u007F]+/g
const MULTI_SPACE_PATTERN = /\s+/g

function sanitizeSingleLine(value: string, maxLength: number): string {
  return value.replace(CONTROL_CHARS_PATTERN, ' ').replace(MULTI_SPACE_PATTERN, ' ').trim().slice(0, maxLength)
}

function parsePositiveInteger(rawValue: string): number | null {
  const parsed = Number(rawValue)
  if (!Number.isInteger(parsed) || parsed < 1) {
    return null
  }
  return parsed
}

function normalizeScheduledAtToUtc(rawValue: string): string | null {
  if (!rawValue) {
    return null
  }

  const parsed = new Date(rawValue)
  if (Number.isNaN(parsed.getTime())) {
    return null
  }

  return parsed.toISOString()
}

function createRequestId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`
}

function getPathname(url: string): string {
  try {
    return new URL(url).pathname
  } catch {
    return url
  }
}

function isAppointmentStatus(value: string): value is AppointmentStatus {
  return (APPOINTMENT_STATUS_OPTIONS as readonly string[]).includes(value)
}

function isAgentStatus(value: string): value is AgentStatus {
  return (AGENT_STATUS_OPTIONS as readonly string[]).includes(value)
}

export function createApp(options?: string | AppOptions) {
  const resolvedOptions: AppOptions =
    typeof options === 'string' ? { databasePath: options } : options ?? {}

  const logger = resolvedOptions.logger ?? ((message: string) => console.log(message))
  const clinicRepository = resolvedOptions.clinicRepository ?? createClinicRepository(resolvedOptions.databasePath)

  const app = new Hono<{ Variables: { requestId: string } }>()

  app.use('/static/*', serveStatic({ root: './' }))
  app.use(
    '/vendor/pico/*',
    serveStatic({
      root: './node_modules/@picocss/pico/css',
      rewriteRequestPath: (requestPath) => requestPath.replace('/vendor/pico/', ''),
    })
  )

  app.use('*', async (c, next) => {
    const requestId = createRequestId()
    const startedAt = Date.now()

    c.set('requestId', requestId)

    try {
      await next()
    } finally {
      const status = c.res?.status ?? 500
      const durationMs = Date.now() - startedAt
      const method = c.req.method
      const path = getPathname(c.req.url)

      c.res.headers.set('x-request-id', requestId)
      logger(`[request] id=${requestId} method=${method} path=${path} status=${status} duration_ms=${durationMs}`)
    }
  })

  app.get('/', (c) => c.html(<Home />))

  app.get('/agents', (c) => {
    const agents = clinicRepository.listAgents()
    return c.html(<AgentsPage agents={agents} />)
  })

  app.get('/agents/:id', (c) => {
    const rawId = c.req.param('id')
    const agentId = parsePositiveInteger(rawId)

    if (agentId === null) {
      return c.html(<AgentNotFoundPage attemptedId={rawId} />, 404)
    }

    const agent = clinicRepository.findAgentById(agentId)
    if (!agent) {
      return c.html(<AgentNotFoundPage attemptedId={rawId} />, 404)
    }

    return c.html(<AgentDetailPage agent={agent} />)
  })

  app.get('/ailments', (c) => {
    const ailments = clinicRepository.listAilments()
    return c.html(<AilmentsPage ailments={ailments} />)
  })

  app.get('/therapies', (c) => {
    const therapies = clinicRepository.listTherapies()
    const ailmentMappings = clinicRepository.listAilmentsWithTherapies()
    return c.html(<TherapiesPage therapies={therapies} ailmentMappings={ailmentMappings} />)
  })

  app.get('/agents/:id/appointments/new', (c) => {
    const rawId = c.req.param('id')
    const agentId = parsePositiveInteger(rawId)

    if (agentId === null) {
      return c.html(<AgentNotFoundPage attemptedId={rawId} />, 404)
    }

    const agent = clinicRepository.findAgentById(agentId)
    if (!agent) {
      return c.html(<AgentNotFoundPage attemptedId={rawId} />, 404)
    }

    const therapists = clinicRepository.listActiveTherapists()
    const values: AppointmentBookingValues = { therapistId: '', scheduledAt: '', notes: '' }

    return c.html(
      <AppointmentBookingPage
        agent={agent}
        therapists={therapists}
        values={values}
        errors={{}}
      />
    )
  })

  app.post('/agents/:id/appointments', async (c) => {
    const rawId = c.req.param('id')
    const agentId = parsePositiveInteger(rawId)

    if (agentId === null) {
      return c.html(<AgentNotFoundPage attemptedId={rawId} />, 404)
    }

    const agent = clinicRepository.findAgentById(agentId)
    if (!agent) {
      return c.html(<AgentNotFoundPage attemptedId={rawId} />, 404)
    }

    const therapists = clinicRepository.listActiveTherapists()
    const therapistIds = new Set(therapists.map((therapist) => therapist.id))

    const formData = await c.req.formData()
    const values: AppointmentBookingValues = {
      therapistId: sanitizeSingleLine(String(formData.get('therapistId') ?? ''), 32),
      scheduledAt: sanitizeSingleLine(String(formData.get('scheduledAt') ?? ''), 48),
      notes: sanitizeSingleLine(String(formData.get('notes') ?? ''), 500),
    }

    const errors: AppointmentBookingErrors = {}

    const therapistId = parsePositiveInteger(values.therapistId)
    if (therapistId === null || !therapistIds.has(therapistId)) {
      errors.therapistId = 'Select an active therapist.'
    }

    const scheduledAtUtc = normalizeScheduledAtToUtc(values.scheduledAt)
    if (!scheduledAtUtc) {
      errors.scheduledAt = 'Provide a valid appointment date and time.'
    } else if (new Date(scheduledAtUtc).getTime() <= Date.now()) {
      errors.scheduledAt = 'Appointment time must be in the future.'
    }

    if (Object.keys(errors).length > 0) {
      return c.html(
        <AppointmentBookingPage
          agent={agent}
          therapists={therapists}
          values={values}
          errors={errors}
        />,
        400
      )
    }

    try {
      const appointmentId = clinicRepository.createAppointment({
        agentId,
        therapistId: therapistId as number,
        scheduledAtUtc: scheduledAtUtc as string,
        status: 'booked',
        notes: values.notes,
      })

      return c.redirect(`/appointments/${appointmentId}/confirmation`, 303)
    } catch {
      const submissionErrors: AppointmentBookingErrors = {
        form: 'Appointment could not be saved. Adjust the time or therapist and try again.',
      }

      return c.html(
        <AppointmentBookingPage
          agent={agent}
          therapists={therapists}
          values={values}
          errors={submissionErrors}
        />,
        400
      )
    }
  })

  app.get('/appointments/:id/confirmation', (c) => {
    const rawId = c.req.param('id')
    const appointmentId = parsePositiveInteger(rawId)

    if (appointmentId === null) {
      return c.html(<NotFoundPage requestedPath={getPathname(c.req.url)} />, 404)
    }

    const appointment = clinicRepository.findAppointmentById(appointmentId)
    if (!appointment) {
      return c.html(<NotFoundPage requestedPath={getPathname(c.req.url)} />, 404)
    }

    return c.html(<AppointmentConfirmationPage appointment={appointment} />)
  })

  app.get('/dashboard', (c) => {
    const dashboard = clinicRepository.getDashboardData()
    const updatedToken = sanitizeSingleLine(c.req.query('updated') ?? '', 64)

    let flashMessage: string | undefined
    if (updatedToken === 'appointment-status') {
      flashMessage = 'Appointment status updated.'
    } else if (updatedToken === 'agent-status') {
      flashMessage = 'Agent status updated.'
    }

    return c.html(<DashboardPage dashboard={dashboard} flashMessage={flashMessage} />)
  })

  app.post('/dashboard/appointments/:id/status', async (c) => {
    const rawId = c.req.param('id')
    const appointmentId = parsePositiveInteger(rawId)

    if (appointmentId === null) {
      return c.text('Invalid appointment id.', 400)
    }

    const formData = await c.req.formData()
    const statusValue = sanitizeSingleLine(String(formData.get('status') ?? ''), 32).toLowerCase()

    if (!isAppointmentStatus(statusValue)) {
      return c.text('Invalid appointment status.', 400)
    }

    const updated = clinicRepository.updateAppointmentStatus(appointmentId, statusValue)
    if (!updated) {
      return c.html(<NotFoundPage requestedPath={getPathname(c.req.url)} />, 404)
    }

    return c.redirect('/dashboard?updated=appointment-status', 303)
  })

  app.post('/dashboard/agents/:id/status', async (c) => {
    const rawId = c.req.param('id')
    const agentId = parsePositiveInteger(rawId)

    if (agentId === null) {
      return c.text('Invalid agent id.', 400)
    }

    const formData = await c.req.formData()
    const statusValue = sanitizeSingleLine(String(formData.get('status') ?? ''), 64)

    if (!isAgentStatus(statusValue)) {
      return c.text('Invalid agent status.', 400)
    }

    const updated = clinicRepository.updateAgentStatus(agentId, statusValue)
    if (!updated) {
      return c.html(<NotFoundPage requestedPath={getPathname(c.req.url)} />, 404)
    }

    return c.redirect('/dashboard?updated=agent-status', 303)
  })

  app.notFound((c) => c.html(<NotFoundPage requestedPath={getPathname(c.req.url)} />, 404))

  app.onError((error, c) => {
    const requestId = c.get('requestId') ?? 'unknown'
    const method = c.req.method
    const path = getPathname(c.req.url)
    const errorMessage = sanitizeSingleLine(error.message ?? 'Unhandled error', 400)

    logger(`[error] id=${requestId} method=${method} path=${path} message=${errorMessage}`)

    return c.html(<ServerErrorPage requestId={requestId} />, 500)
  })

  return app
}

const app = createApp()

export default app
