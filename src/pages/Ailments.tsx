import { Layout } from '../components/Layout'
import type { AilmentSummary } from '../data/clinicRepository'

type AilmentsPageProps = {
  ailments: AilmentSummary[]
}

export function AilmentsPage({ ailments }: AilmentsPageProps) {
  return (
    <Layout title="Ailments | AgentClinic">
      <section class="page-intro">
        <h1>Ailments Catalog</h1>
        <p>Reference common agent ailments and how widely they appear in active cases.</p>
      </section>

      <div class="ailment-grid">
        {ailments.map((ailment) => (
          <article class="ailment-card" key={ailment.id}>
            <h2>{ailment.name}</h2>
            <p>{ailment.description}</p>
            <small>
              Linked agents: <strong>{ailment.linkedAgentCount}</strong>
            </small>
          </article>
        ))}
      </div>
    </Layout>
  )
}
