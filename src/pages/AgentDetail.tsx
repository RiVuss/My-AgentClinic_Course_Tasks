import { Layout } from '../components/Layout'
import type { AgentDetail } from '../data/clinicRepository'

type AgentDetailPageProps = {
  agent: AgentDetail
}

export function AgentDetailPage({ agent }: AgentDetailPageProps) {
  return (
    <Layout title={`${agent.name} | AgentClinic`}>
      <nav aria-label="Breadcrumb" class="breadcrumb">
        <a href="/agents">Agents</a> / <span>{agent.name}</span>
      </nav>

      <article class="agent-profile">
        <header class="agent-profile__header">
          <h1>{agent.name}</h1>
          <p>{agent.currentStatus}</p>
        </header>

        <dl class="detail-grid">
          <div>
            <dt>Model Type</dt>
            <dd>{agent.modelType}</dd>
          </div>
          <div>
            <dt>Current Status</dt>
            <dd>{agent.currentStatus}</dd>
          </div>
          <div class="detail-grid__full">
            <dt>Presenting Complaints</dt>
            <dd>{agent.presentingComplaints}</dd>
          </div>
        </dl>

        <section class="agent-profile__ailments" aria-labelledby="ailments-heading">
          <h2 id="ailments-heading">Ailments in flight</h2>
          {agent.ailments.length > 0 ? (
            <ul class="chip-list">
              {agent.ailments.map((ailment) => (
                <li key={ailment.id}>{ailment.name}</li>
              ))}
            </ul>
          ) : (
            <p>No linked ailments yet.</p>
          )}
        </section>

        <p class="agent-profile__actions">
          <a href={`/agents/${agent.id}/appointments/new`} role="button">
            Book Appointment
          </a>
        </p>
      </article>
    </Layout>
  )
}