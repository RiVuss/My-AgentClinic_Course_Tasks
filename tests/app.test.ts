import { describe, expect, it } from 'vitest'

import app from '../src/app'

describe('AgentClinic app', () => {
  it('returns an HTML home page on GET /', async () => {
    const response = await app.request('http://localhost/')
    const html = await response.text()

    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('text/html')
    expect(html).toContain('name="viewport"')
    expect(html).toContain('<h1>AgentClinic</h1>')
    expect(html).toContain('A dependable clinic where agents report issues and recover quickly.')
    expect(html).toContain('/static/style.css')
    expect(html).toContain('home__highlights')
  })

  it('serves stylesheet content on GET /static/style.css', async () => {
    const response = await app.request('http://localhost/static/style.css')
    const css = await response.text()

    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('text/css')
    expect(css).toContain(':root')
    expect(css).toContain('.site-header')
    expect(css).toContain('@media (min-width: 48rem)')
    expect(css).toContain('@media (min-width: 64rem)')
    expect(css).toContain('.home__highlights')
  })
})
