import { Hono } from 'hono'
import modules from './modules'
import { MODULES } from './constants'

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', async (c) => {
  await c.env.KV.put('shopify', JSON.stringify([]))
  return c.text('Tech Feeds')
})

app.route('/modules', modules)

app.get('/refresh-feeds', async (c) => {
  await Promise.all(MODULES.map((module) => fetch(`${c.req.url.replace('/refresh-feeds', '')}/modules/${module}/refresh`)))
  return c.text('ok')
})

export default {
  fetch: app.fetch,
  scheduled: async (c: ScheduledController, env: any, ctx: ExecutionContext) => {
    ctx.waitUntil(fetch('/refresh-feeds'))
  }
}
