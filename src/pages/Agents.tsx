import { Layout } from '../components/Layout'
import type { AgentSummary } from '../data/clinicRepository'

type AgentsPageProps = {
  agents: AgentSummary[]
}

export function AgentsPage({ agents }: AgentsPageProps) {
  return (
    <Layout title="Agents | AgentClinic">
      <section class="page-intro">
        <h1>Agents</h1>
        <p>Browse active agents, current status, and presenting complaints.</p>
      </section>

      <ul class="agent-cards" aria-label="Agent list cards">
        {agents.map((agent) => (
          <li class="agent-card" key={agent.id}>
            <h2>{agent.name}</h2>
            <p class="agent-card__meta">
              <strong>Model:</strong> {agent.modelType}
            </p>
            <p class="agent-card__meta">
              <strong>Status:</strong> {agent.currentStatus}
            </p>
            <p class="agent-card__complaints">{agent.presentingComplaints}</p>
            <p class="agent-card__link">
              <a href={`/agents/${agent.id}`}>View profile</a>
            </p>
          </li>
        ))}
      </ul>

      <div class="table-wrapper">
        <table class="agents-table">
          <caption>All active agents</caption>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Model Type</th>
              <th scope="col">Current Status</th>
              <th scope="col">Presenting Complaints</th>
              <th scope="col">Profile</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent.id}>
                <th scope="row">{agent.name}</th>
                <td>{agent.modelType}</td>
                <td>{agent.currentStatus}</td>
                <td>{agent.presentingComplaints}</td>
                <td>
                  <a href={`/agents/${agent.id}`}>Open</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}
