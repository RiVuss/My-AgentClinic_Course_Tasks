import { Layout } from '../components/Layout'

type AgentNotFoundPageProps = {
  attemptedId: string
}

export function AgentNotFoundPage({ attemptedId }: AgentNotFoundPageProps) {
  return (
    <Layout title="Agent Not Found | AgentClinic">
      <section class="not-found">
        <h1>Agent Not Found</h1>
        <p>We could not find an agent profile for id "{attemptedId}".</p>
        <p>
          <a href="/agents">Return to agent list</a>
        </p>
      </section>
    </Layout>
  )
}
