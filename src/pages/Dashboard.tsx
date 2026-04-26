import { Layout } from '../components/Layout'
import {
  AGENT_STATUS_OPTIONS,
  APPOINTMENT_STATUS_OPTIONS,
  type DashboardData,
} from '../data/clinicRepository'

type DashboardPageProps = {
  dashboard: DashboardData
  flashMessage?: string
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

export function DashboardPage({ dashboard, flashMessage }: DashboardPageProps) {
  return (
    <Layout title="Dashboard | AgentClinic">
      <section class="page-intro">
        <h1>Staff Dashboard</h1>
        <p>Monitor clinic operations and keep statuses current.</p>
      </section>

      {flashMessage ? (
        <p class="flash flash--success" role="status">
          {flashMessage}
        </p>
      ) : null}

      <section aria-label="Summary metrics" class="metrics-grid">
        <article class="metric-card">
          <h2>Agents</h2>
          <p>{dashboard.metrics.agentCount}</p>
        </article>
        <article class="metric-card">
          <h2>Open appointments</h2>
          <p>{dashboard.metrics.openAppointmentCount}</p>
        </article>
        <article class="metric-card">
          <h2>Ailments in flight</h2>
          <p>{dashboard.metrics.ailmentsInFlightCount}</p>
        </article>
      </section>

      <section class="dashboard-section" aria-labelledby="appointments-heading">
        <h2 id="appointments-heading">Appointments</h2>

        {dashboard.appointments.length > 0 ? (
          <div class="table-wrapper table-wrapper--always">
            <table class="dashboard-table">
              <thead>
                <tr>
                  <th scope="col">Id</th>
                  <th scope="col">Agent</th>
                  <th scope="col">Therapist</th>
                  <th scope="col">Scheduled</th>
                  <th scope="col">Notes</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>{appointment.id}</td>
                    <td>{appointment.agentName}</td>
                    <td>{appointment.therapistName}</td>
                    <td>{formatUtcDateTime(appointment.scheduledAtUtc)}</td>
                    <td>{appointment.notes || 'No notes'}</td>
                    <td>
                      <form
                        action={`/dashboard/appointments/${appointment.id}/status`}
                        class="status-form"
                        method="post"
                      >
                        <label class="visually-hidden" for={`appointment-status-${appointment.id}`}>
                          Appointment {appointment.id} status
                        </label>
                        <select id={`appointment-status-${appointment.id}`} name="status" value={appointment.status}>
                          {APPOINTMENT_STATUS_OPTIONS.map((statusOption) => (
                            <option key={statusOption} value={statusOption}>
                              {statusOption}
                            </option>
                          ))}
                        </select>
                        <button type="submit">Update</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No appointments recorded yet.</p>
        )}
      </section>

      <section class="dashboard-section" aria-labelledby="agents-heading">
        <h2 id="agents-heading">Agents</h2>

        <div class="table-wrapper table-wrapper--always">
          <table class="dashboard-table">
            <thead>
              <tr>
                <th scope="col">Id</th>
                <th scope="col">Name</th>
                <th scope="col">Ailments</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.agents.map((agent) => (
                <tr key={agent.id}>
                  <td>{agent.id}</td>
                  <td>
                    <a href={`/agents/${agent.id}`}>{agent.name}</a>
                  </td>
                  <td>{agent.ailmentCount}</td>
                  <td>
                    <form action={`/dashboard/agents/${agent.id}/status`} class="status-form" method="post">
                      <label class="visually-hidden" for={`agent-status-${agent.id}`}>
                        Agent {agent.name} status
                      </label>
                      <select id={`agent-status-${agent.id}`} name="status" value={agent.currentStatus}>
                        {AGENT_STATUS_OPTIONS.map((statusOption) => (
                          <option key={statusOption} value={statusOption}>
                            {statusOption}
                          </option>
                        ))}
                      </select>
                      <button type="submit">Update</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </Layout>
  )
}
