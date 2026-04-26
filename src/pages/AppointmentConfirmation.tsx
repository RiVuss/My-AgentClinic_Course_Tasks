import { Layout } from '../components/Layout'
import type { AppointmentRecord } from '../data/clinicRepository'

type AppointmentConfirmationPageProps = {
  appointment: AppointmentRecord
}

function formatUtcDateTime(value: string): string {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return value
  }

  return `${parsed.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  })} UTC`
}

export function AppointmentConfirmationPage({ appointment }: AppointmentConfirmationPageProps) {
  return (
    <Layout title="Appointment Confirmed | AgentClinic">
      <section class="confirmation-shell" aria-labelledby="confirmation-heading">
        <h1 id="confirmation-heading">Appointment Confirmed</h1>
        <p>The booking was saved successfully.</p>

        <dl class="confirmation-grid">
          <div>
            <dt>Agent</dt>
            <dd>{appointment.agentName}</dd>
          </div>
          <div>
            <dt>Therapist</dt>
            <dd>{appointment.therapistName}</dd>
          </div>
          <div>
            <dt>Specialty</dt>
            <dd>{appointment.therapistSpecialty}</dd>
          </div>
          <div>
            <dt>Scheduled</dt>
            <dd>{formatUtcDateTime(appointment.scheduledAtUtc)}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{appointment.status}</dd>
          </div>
          <div class="confirmation-grid__full">
            <dt>Notes</dt>
            <dd>{appointment.notes || 'No notes submitted.'}</dd>
          </div>
        </dl>

        <p>
          <a href="/dashboard" role="button">
            Open Dashboard
          </a>
        </p>
      </section>
    </Layout>
  )
}