import { Layout } from '../components/Layout'
import type { AgentDetail, TherapistSummary } from '../data/clinicRepository'

export type AppointmentBookingValues = {
  therapistId: string
  scheduledAt: string
  notes: string
}

export type AppointmentBookingErrors = {
  therapistId?: string
  scheduledAt?: string
  notes?: string
  form?: string
}

type AppointmentBookingPageProps = {
  agent: AgentDetail
  therapists: TherapistSummary[]
  values: AppointmentBookingValues
  errors: AppointmentBookingErrors
}

export function AppointmentBookingPage({
  agent,
  therapists,
  values,
  errors,
}: AppointmentBookingPageProps) {
  return (
    <Layout title={`Book Appointment | ${agent.name} | AgentClinic`}>
      <nav aria-label="Breadcrumb" class="breadcrumb">
        <a href="/agents">Agents</a> / <a href={`/agents/${agent.id}`}>{agent.name}</a> / <span>Book Appointment</span>
      </nav>

      <section class="booking-shell" aria-labelledby="booking-heading">
        <h1 id="booking-heading">Book appointment for {agent.name}</h1>
        <p>Select a therapist and preferred date/time to create an appointment.</p>

        {errors.form ? (
          <div class="form-error" role="alert">
            <p>{errors.form}</p>
          </div>
        ) : null}

        <form action={`/agents/${agent.id}/appointments`} class="booking-form" method="post" noValidate>
          <div class="form-field">
            <label for="therapistId">Therapist</label>
            <select
              aria-invalid={errors.therapistId ? 'true' : 'false'}
              id="therapistId"
              name="therapistId"
              required
              value={values.therapistId}
            >
              <option value="">Select therapist</option>
              {therapists.map((therapist) => (
                <option key={therapist.id} value={String(therapist.id)}>
                  {therapist.name} ({therapist.specialty})
                </option>
              ))}
            </select>
            {errors.therapistId ? (
              <small class="field-error" role="alert">
                {errors.therapistId}
              </small>
            ) : null}
          </div>

          <div class="form-field">
            <label for="scheduledAt">Scheduled date and time</label>
            <input
              aria-invalid={errors.scheduledAt ? 'true' : 'false'}
              id="scheduledAt"
              name="scheduledAt"
              required
              type="datetime-local"
              value={values.scheduledAt}
            />
            {errors.scheduledAt ? (
              <small class="field-error" role="alert">
                {errors.scheduledAt}
              </small>
            ) : null}
          </div>

          <div class="form-field">
            <label for="notes">Notes (optional)</label>
            <textarea id="notes" maxLength={500} name="notes" rows={4} value={values.notes} />
            {errors.notes ? (
              <small class="field-error" role="alert">
                {errors.notes}
              </small>
            ) : null}
          </div>

          <div class="form-actions">
            <button type="submit">Confirm Appointment</button>
            <a href={`/agents/${agent.id}`}>Cancel</a>
          </div>
        </form>
      </section>
    </Layout>
  )
}