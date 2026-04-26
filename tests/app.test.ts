import { beforeEach, describe, expect, it } from 'vitest'

import { createApp } from '../src/app'
import { createClinicRepository, type ClinicRepository } from '../src/data/clinicRepository'

describe('AgentClinic app', () => {
  let app: ReturnType<typeof createApp>

  beforeEach(() => {
    app = createApp(':memory:')
  })

  it('returns an HTML home page on GET /', async () => {
    const response = await app.request('http://localhost/')
    const html = await response.text()

    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('text/html')
    expect(response.headers.get('x-request-id')).toBeTruthy()
    expect(html).toContain('data-theme="light"')
    expect(html).toContain('name="viewport"')
    expect(html).toContain('<h1>AgentClinic</h1>')
    expect(html).toContain('/vendor/pico/pico.min.css')
    expect(html).toContain('/static/style.css')
    expect(html).toContain('/static/agentclinic-mark.svg')
    expect(html).toContain('/therapies')
    expect(html).toContain('/dashboard')
  })

  it('returns the agents list and detail booking link', async () => {
    const listResponse = await app.request('http://localhost/agents')
    const listHtml = await listResponse.text()

    expect(listResponse.status).toBe(200)
    expect(listHtml).toContain('<h1>Agents</h1>')
    expect(listHtml).toContain('Astra Summary-7')

    const detailResponse = await app.request('http://localhost/agents/1')
    const detailHtml = await detailResponse.text()

    expect(detailResponse.status).toBe(200)
    expect(detailHtml).toContain('Book Appointment')
    expect(detailHtml).toContain('/agents/1/appointments/new')
  })

  it('returns 404 with helpful text for unknown agents', async () => {
    const response = await app.request('http://localhost/agents/999')
    const html = await response.text()

    expect(response.status).toBe(404)
    expect(html).toContain('Agent Not Found')
    expect(html).toContain('Return to agent list')
  })

  it('returns ailments and therapies catalog routes', async () => {
    const ailmentsResponse = await app.request('http://localhost/ailments')
    const ailmentsHtml = await ailmentsResponse.text()

    expect(ailmentsResponse.status).toBe(200)
    expect(ailmentsHtml).toContain('<h1>Ailments Catalog</h1>')
    expect(ailmentsHtml).toContain('context-window claustrophobia')

    const therapiesResponse = await app.request('http://localhost/therapies')
    const therapiesHtml = await therapiesResponse.text()

    expect(therapiesResponse.status).toBe(200)
    expect(therapiesHtml).toContain('<h1>Therapies Catalog</h1>')
    expect(therapiesHtml).toContain('context compression breathing')
    expect(therapiesHtml).toContain('Ailment to therapy mapping')
  })

  it('renders the booking form and validates bad submissions', async () => {
    const formResponse = await app.request('http://localhost/agents/1/appointments/new')
    const formHtml = await formResponse.text()

    expect(formResponse.status).toBe(200)
    expect(formHtml).toContain('Book appointment for Astra Summary-7')
    expect(formHtml).toContain('name="therapistId"')
    expect(formHtml).toContain('name="scheduledAt"')

    const invalidForm = new FormData()
    invalidForm.set('therapistId', '')
    invalidForm.set('scheduledAt', 'not-a-date')
    invalidForm.set('notes', 'x')

    const invalidResponse = await app.request('http://localhost/agents/1/appointments', {
      method: 'POST',
      body: invalidForm,
    })
    const invalidHtml = await invalidResponse.text()

    expect(invalidResponse.status).toBe(400)
    expect(invalidHtml).toContain('Select an active therapist.')
    expect(invalidHtml).toContain('Provide a valid appointment date and time.')
  })

  it('creates appointment and renders confirmation page', async () => {
    const validForm = new FormData()
    validForm.set('therapistId', '1')
    validForm.set('scheduledAt', '2099-01-01T10:30')
    validForm.set('notes', '  Pre-session \n intake \u0007 details  ')

    const createResponse = await app.request('http://localhost/agents/1/appointments', {
      method: 'POST',
      body: validForm,
    })

    expect(createResponse.status).toBe(303)

    const location = createResponse.headers.get('location')
    expect(location).toContain('/appointments/')
    expect(location).toContain('/confirmation')

    const confirmationResponse = await app.request(`http://localhost${location}`)
    const confirmationHtml = await confirmationResponse.text()

    expect(confirmationResponse.status).toBe(200)
    expect(confirmationHtml).toContain('Appointment Confirmed')
    expect(confirmationHtml).toContain('Astra Summary-7')
    expect(confirmationHtml).toContain('Pre-session intake details')
  })

  it('renders dashboard with summary metrics and management forms', async () => {
    const response = await app.request('http://localhost/dashboard')
    const html = await response.text()

    expect(response.status).toBe(200)
    expect(html).toContain('<h1>Staff Dashboard</h1>')
    expect(html).toContain('Open appointments')
    expect(html).toContain('/dashboard/appointments/1/status')
    expect(html).toContain('/dashboard/agents/1/status')
  })

  it('updates dashboard statuses through constrained endpoints', async () => {
    const appointmentUpdateForm = new FormData()
    appointmentUpdateForm.set('status', 'completed')

    const appointmentUpdateResponse = await app.request('http://localhost/dashboard/appointments/1/status', {
      method: 'POST',
      body: appointmentUpdateForm,
    })

    expect(appointmentUpdateResponse.status).toBe(303)
    expect(appointmentUpdateResponse.headers.get('location')).toBe('/dashboard?updated=appointment-status')

    const dashboardAfterAppointmentUpdate = await app.request('http://localhost/dashboard?updated=appointment-status')
    const dashboardHtml = await dashboardAfterAppointmentUpdate.text()
    expect(dashboardHtml).toContain('Appointment status updated.')

    const invalidAppointmentForm = new FormData()
    invalidAppointmentForm.set('status', 'invalid-value')

    const invalidAppointmentResponse = await app.request('http://localhost/dashboard/appointments/1/status', {
      method: 'POST',
      body: invalidAppointmentForm,
    })

    expect(invalidAppointmentResponse.status).toBe(400)

    const agentUpdateForm = new FormData()
    agentUpdateForm.set('status', 'Discharged')

    const agentUpdateResponse = await app.request('http://localhost/dashboard/agents/1/status', {
      method: 'POST',
      body: agentUpdateForm,
    })

    expect(agentUpdateResponse.status).toBe(303)
    expect(agentUpdateResponse.headers.get('location')).toBe('/dashboard?updated=agent-status')

    const invalidAgentForm = new FormData()
    invalidAgentForm.set('status', 'Unknown State')

    const invalidAgentResponse = await app.request('http://localhost/dashboard/agents/1/status', {
      method: 'POST',
      body: invalidAgentForm,
    })

    expect(invalidAgentResponse.status).toBe(400)
  })

  it('serves PicoCSS and project stylesheet with focus and responsive rules', async () => {
    const picoResponse = await app.request('http://localhost/vendor/pico/pico.min.css')
    const picoCss = await picoResponse.text()

    expect(picoResponse.status).toBe(200)
    expect(picoResponse.headers.get('content-type')).toContain('text/css')
    expect(picoCss).toContain('--pico-font-family')

    const styleResponse = await app.request('http://localhost/static/style.css')
    const styleCss = await styleResponse.text()

    expect(styleResponse.status).toBe(200)
    expect(styleResponse.headers.get('content-type')).toContain('text/css')
    expect(styleCss).toContain(':focus-visible')
    expect(styleCss).toContain('.table-wrapper--always')
    expect(styleCss).toContain('@media (min-width: 48rem)')
    expect(styleCss).toContain('@media (min-width: 64rem)')
  })

  it('returns custom not found page for unknown routes', async () => {
    const response = await app.request('http://localhost/does-not-exist')
    const html = await response.text()

    expect(response.status).toBe(404)
    expect(html).toContain('Page Not Found')
    expect(html).toContain('/does-not-exist')
  })

  it('returns custom 500 page and logs an error when a route throws', async () => {
    const baseRepository = createClinicRepository(':memory:')
    const failingRepository: ClinicRepository = {
      ...baseRepository,
      listAgents: () => {
        throw new Error('forced test failure')
      },
    }

    const logs: string[] = []
    const failingApp = createApp({
      clinicRepository: failingRepository,
      logger: (message) => logs.push(message),
    })

    const response = await failingApp.request('http://localhost/agents')
    const html = await response.text()

    expect(response.status).toBe(500)
    expect(html).toContain('Something Went Wrong')
    expect(logs.some((line) => line.includes('[error]'))).toBe(true)
  })

  it('emits structured request logs through middleware', async () => {
    const logs: string[] = []
    const loggingApp = createApp({
      databasePath: ':memory:',
      logger: (message) => logs.push(message),
    })

    const response = await loggingApp.request('http://localhost/agents')

    expect(response.status).toBe(200)
    expect(logs.some((line) => line.includes('method=GET') && line.includes('path=/agents'))).toBe(true)
    expect(logs.some((line) => line.includes('status=200') && line.includes('duration_ms='))).toBe(true)
  })
})