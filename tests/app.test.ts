import { describe, expect, it } from 'vitest'

import app from '../src/app'

describe('AgentClinic app', () => {
  it('returns an HTML home page on GET /', async () => {
    const response = await app.request('http://localhost/')
    const html = await response.text()

    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('text/html')
    expect(html).toContain('<h1>AgentClinic</h1>')
    expect(html).toContain('A dependable clinic where agents report issues and recover quickly.')
    expect(html).toContain('/static/style.css')
  })

  it('serves stylesheet content on GET /static/style.css', async () => {
    const response = await app.request('http://localhost/static/style.css')
    const css = await response.text()

    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('text/css')
    expect(css).toContain(':root')
    expect(css).toContain('.site-header')
  })
})
