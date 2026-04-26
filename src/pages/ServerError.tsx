import { Layout } from '../components/Layout'

type ServerErrorPageProps = {
  requestId: string
}

export function ServerErrorPage({ requestId }: ServerErrorPageProps) {
  return (
    <Layout title="Server Error | AgentClinic">
      <section class="error-shell" aria-labelledby="server-error-heading">
        <h1 id="server-error-heading">Something Went Wrong</h1>
        <p>The clinic dashboard hit an unexpected issue. Please retry your request.</p>
        <p>
          Request ID: <code>{requestId}</code>
        </p>
        <p>
          <a href="/dashboard" role="button">
            Back to Dashboard
          </a>
        </p>
      </section>
    </Layout>
  )
}