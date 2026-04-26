import { Layout } from '../components/Layout'
import type { AilmentWithTherapies, TherapySummary } from '../data/clinicRepository'

type TherapiesPageProps = {
  therapies: TherapySummary[]
  ailmentMappings: AilmentWithTherapies[]
}

export function TherapiesPage({ therapies, ailmentMappings }: TherapiesPageProps) {
  return (
    <Layout title="Therapies | AgentClinic">
      <section class="page-intro">
        <h1>Therapies Catalog</h1>
        <p>Reference structured interventions and how they map to active clinic ailments.</p>
      </section>

      <section aria-labelledby="therapies-list-heading" class="therapies-section">
        <h2 id="therapies-list-heading">Available therapies</h2>
        <div class="therapy-grid">
          {therapies.map((therapy) => (
            <article class="therapy-card" key={therapy.id}>
              <h3>{therapy.name}</h3>
              <p>{therapy.description}</p>
              <small>
                Linked ailments: <strong>{therapy.linkedAilmentCount}</strong>
              </small>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="therapy-mapping-heading" class="mapping-section">
        <h2 id="therapy-mapping-heading">Ailment to therapy mapping</h2>
        <div class="mapping-grid">
          {ailmentMappings.map((ailment) => (
            <article class="mapping-card" key={ailment.id}>
              <h3>{ailment.name}</h3>
              <p>{ailment.description}</p>
              {ailment.therapies.length > 0 ? (
                <ul class="chip-list">
                  {ailment.therapies.map((therapy) => (
                    <li key={therapy.id}>{therapy.name}</li>
                  ))}
                </ul>
              ) : (
                <p>No therapies mapped yet.</p>
              )}
            </article>
          ))}
        </div>
      </section>
    </Layout>
  )
}