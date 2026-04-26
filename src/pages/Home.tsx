import { Layout } from '../components/Layout'

export function Home() {
  return (
    <Layout title="AgentClinic">
      <section class="home">
        <div class="home__intro">
          <h1>AgentClinic</h1>
          <p class="home__lede">A dependable clinic where agents report issues and recover quickly.</p>
        </div>
        <ul class="home__highlights" aria-label="Clinic highlights">
          <li class="home__card">
            <h2>Fast triage</h2>
            <p>Capture symptoms, severity, and context in one clear workflow.</p>
          </li>
          <li class="home__card">
            <h2>Clear care plans</h2>
            <p>Match ailments to therapies so every agent leaves with a practical next step.</p>
          </li>
          <li class="home__card">
            <h2>Reliable follow-up</h2>
            <p>Track appointments and status changes with a concise operational dashboard.</p>
          </li>
        </ul>
      </section>
    </Layout>
  )
}
