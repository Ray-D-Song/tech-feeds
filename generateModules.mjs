import { readdirSync, writeFileSync } from 'node:fs'

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