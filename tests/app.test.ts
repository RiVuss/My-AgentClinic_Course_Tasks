import { beforeEach, describe, expect, it } from 'vitest'

import { createApp } from '../src/app'

describe('AgentClinic app', () => {
  let app: ReturnType<typeof createApp>

  beforeEach(() => {
    app = createApp(':memory:')
  })

  it('returns an HTML home page on GET /', async () => {
    const response = await app.request('http://localhost/')
    const html = await response.text()

    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('text/html')
    expect(html).toContain('data-theme="light"')
    expect(html).toContain('name="viewport"')
    expect(html).toContain('<h1>AgentClinic</h1>')
    expect(html).toContain('/vendor/pico/pico.min.css')
    expect(html).toContain('/static/style.css')
    expect(html).toContain('/static/agentclinic-mark.svg')
    expect(html).toContain('Review Active Agents')
  })

  it('returns the agents list with responsive card and table markup', async () => {
    const response = await app.request('http://localhost/agents')
    const html = await response.text()

    expect(response.status).toBe(200)
    expect(html).toContain('<h1>Agents</h1>')
    expect(html).toContain('agent-cards')
    expect(html).toContain('agents-table')
    expect(html).toContain('Astra Summary-7')
    expect(html).toContain('Nimbus CodeRunner')
    expect(html).toContain('/agents/1')
  })

  it('returns a populated agent detail page on GET /agents/:id', async () => {
    const response = await app.request('http://localhost/agents/1')
    const html = await response.text()

    expect(response.status).toBe(200)
    expect(html).toContain('Astra Summary-7')
    expect(html).toContain('Model Type')
    expect(html).toContain('Ailments in flight')
    expect(html).toContain('prompt fatigue')
  })

  it('returns 404 with helpful text for unknown agents', async () => {
    const response = await app.request('http://localhost/agents/999')
    const html = await response.text()

    expect(response.status).toBe(404)
    expect(html).toContain('Agent Not Found')
    expect(html).toContain('Return to agent list')
  })

  it('returns ailments catalog with linked counts', async () => {
    const response = await app.request('http://localhost/ailments')
    const html = await response.text()

    expect(response.status).toBe(200)
    expect(html).toContain('<h1>Ailments Catalog</h1>')
    expect(html).toContain('context-window claustrophobia')
    expect(html).toContain('prompt fatigue')
    expect(html).toContain('Linked agents:')
  })

  it('serves PicoCSS on GET /vendor/pico/pico.min.css', async () => {
    const response = await app.request('http://localhost/vendor/pico/pico.min.css')
    const css = await response.text()

    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('text/css')
    expect(css).toContain('--pico-font-family')
  })

  it('serves project override stylesheet with responsive rules', async () => {
    const response = await app.request('http://localhost/static/style.css')
    const css = await response.text()

    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('text/css')
    expect(css).toContain(':root')
    expect(css).toContain('--pico-color: #17212b')
    expect(css).toContain('--clinic-heading-color: #0b1220')
    expect(css).toContain('h1,')
    expect(css).toContain('.home__card h2')
    expect(css).toContain('.brand__mark')
    expect(css).toContain('.agent-cards')
    expect(css).toContain('.table-wrapper')
    expect(css).toContain('@media (min-width: 48rem)')
    expect(css).toContain('@media (min-width: 64rem)')
  })

  it('serves local brand mark svg for the header logo', async () => {
    const response = await app.request('http://localhost/static/agentclinic-mark.svg')
    const svg = await response.text()

    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('image/svg+xml')
    expect(svg).toContain('<svg')
    expect(svg).toContain('AgentClinic Mark')
  })
})
