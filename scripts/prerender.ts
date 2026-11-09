// Injects the server-rendered app into dist/index.html so that crawlers,
// link previews and visitors without JavaScript get the full page.
import { readFile, rm, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const root = resolve(import.meta.dirname, '..')
const templatePath = resolve(root, 'dist/index.html')
const ssrEntry = pathToFileURL(resolve(root, 'dist-ssr/entry-server.js')).href

const { render } = (await import(ssrEntry)) as { render: () => string }
const template = await readFile(templatePath, 'utf8')
const marker = '<!--app-->'

if (!template.includes(marker)) {
  throw new Error(`Marker ${marker} not found in dist/index.html`)
}

await writeFile(templatePath, template.replace(marker, render()))
await rm(resolve(root, 'dist-ssr'), { recursive: true, force: true })
