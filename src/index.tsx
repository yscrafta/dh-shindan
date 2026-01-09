import { Hono } from 'hono'
import type { Context } from 'hono'

const app = new Hono()

// 静的ファイルは _routes.json で Cloudflare Pages が自動配信
// このWorkerはAPIルートのみ処理

// APIルート
app.get('/api/hello', (c: Context) => {
  return c.json({ message: 'Hello from Hono!' })
})

// すべての静的リクエストは404を返し、Cloudflare Pagesにフォールバック
app.get('*', (c: Context) => {
  return c.notFound()
})

export default app
