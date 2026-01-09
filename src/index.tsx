import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-pages'

const app = new Hono()

// 静的ファイルの配信
app.get('/static/*', serveStatic())
app.get('/index.html', serveStatic({ path: './index.html' }))
app.get('/select-type.html', serveStatic({ path: './select-type.html' }))
app.get('/question.html', serveStatic({ path: './question.html' }))
app.get('/result.html', serveStatic({ path: './result.html' }))
app.get('/', serveStatic({ path: './index.html' }))

// APIルート
app.get('/api/hello', (c) => {
  return c.json({ message: 'Hello from Hono!' })
})

export default app
