import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'

import { createClinicRepository } from './data/clinicRepository'
import { AgentDetailPage } from './pages/AgentDetail'
import { AgentNotFoundPage } from './pages/AgentNotFound'
import { AgentsPage } from './pages/Agents'
import { AilmentsPage } from './pages/Ailments'
import { Home } from './pages/Home'

export function createApp(databasePath?: string) {
  const app = new Hono()
  const clinicRepository = createClinicRepository(databasePath)

  app.use('/static/*', serveStatic({ root: './' }))
  app.use(
    '/vendor/pico/*',
    serveStatic({
      root: './node_modules/@picocss/pico/css',
      rewriteRequestPath: (requestPath) => requestPath.replace('/vendor/pico/', ''),
    })
  )

  app.get('/', (c) => c.html(<Home />))

  app.get('/agents', (c) => {
    const agents = clinicRepository.listAgents()
    return c.html(<AgentsPage agents={agents} />)
  })

  app.get('/agents/:id', (c) => {
    const rawId = c.req.param('id')
    const agentId = Number(rawId)

    if (!Number.isInteger(agentId) || agentId < 1) {
      return c.html(<AgentNotFoundPage attemptedId={rawId} />, 404)
    }

    const agent = clinicRepository.findAgentById(agentId)
    if (!agent) {
      return c.html(<AgentNotFoundPage attemptedId={rawId} />, 404)
    }

    return c.html(<AgentDetailPage agent={agent} />)
  })

  app.get('/ailments', (c) => {
    const ailments = clinicRepository.listAilments()
    return c.html(<AilmentsPage ailments={ailments} />)
  })

  return app
}

const app = createApp()

export default app
