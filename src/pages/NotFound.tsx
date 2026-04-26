import { Layout } from '../components/Layout'

type NotFoundPageProps = {
  requestedPath?: string
}

export function NotFoundPage({ requestedPath }: NotFoundPageProps) {
  return (
    <Layout title="Page Not Found | AgentClinic">
      <section class="error-shell" aria-labelledby="not-found-heading">
        <h1 id="not-found-heading">Page Not Found</h1>
        <p>The requested path is not available: {requestedPath ?? 'unknown'}.</p>
        <p>
          <a href="/" role="button">
            Return Home
          </a>
        </p>
      </section>
    </Layout>
  )
}