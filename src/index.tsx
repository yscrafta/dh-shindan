import { Hono } from 'hono'

const app = new Hono()

// APIルート
app.get('/api/hello', (c) => {
  return c.json({ message: 'Hello from Hono!' })
})

// すべてのリクエストをパススルー（静的ファイルはCloudflare Pagesが自動処理）
app.get('*', (c) => {
  // Cloudflare Pagesが自動的に静的ファイルを配信
  return c.notFound()
})

export default app
