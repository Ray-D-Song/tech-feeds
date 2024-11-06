import build from '@hono/vite-build/cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'
import { defineConfig, Plugin } from 'vite'
import { readdirSync, writeFileSync } from 'fs'

export default defineConfig({
  plugins: [
    generateModules(),
    build(),
    devServer({
      adapter,
      entry: 'src/index.tsx'
    })
  ]
})

function generateModules(): Plugin {
  return {
    name: 'generate-modules',
    buildStart() {
      const modules = readdirSync('./src/modules')
        .filter((module) => module !== 'index.ts')
        .map((module) => module.replace('.ts', ''))
      writeFileSync('./src/constants.ts', `export const MODULES = ${JSON.stringify(modules)}`)

      // generate modules/index.ts
      const indexContent = `import { Hono } from 'hono'
${modules.map((module) => `import ${module} from './${module}'`).join('\n')}

const modules = new Hono()

${modules.map((module) => `modules.route('/${module}', ${module})`).join('\n')}

export default modules
      `
      writeFileSync('./src/modules/index.ts', indexContent)
    }
  }
}
