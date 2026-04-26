import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'

import { Home } from './pages/Home'

const app = new Hono()

app.use('/static/*', serveStatic({ root: './' }))

app.get('/', (c) => c.html(<Home />))

export default app
