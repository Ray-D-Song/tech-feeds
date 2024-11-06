import { Hono } from 'hono'
import notion from './notion'
import shopify from './shopify'

const modules = new Hono()

modules.route('/notion', notion)
modules.route('/shopify', shopify)

export default modules
      