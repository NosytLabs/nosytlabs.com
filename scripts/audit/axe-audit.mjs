#!/usr/bin/env node
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import puppeteer from 'puppeteer'

const require = createRequire(import.meta.url)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ROUTES_PATH = path.join(__dirname, 'routes.json')
const REPORT_DIR = path.resolve(process.cwd(), 'config', 'reports')

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true })
}

function nowStamp() {
  const d = new Date()
  const pad = (n)=> String(n).padStart(2,'0')
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`
}
async function readRoutes() {
  const raw = await fs.readFile(ROUTES_PATH, 'utf8')
  const list = JSON.parse(raw)
  if (!Array.isArray(list)) throw new Error('routes.json must be an array of paths')
  return list
}

async function main() {
  const baseUrl = process.env.SITE_URL || 'http://localhost:4321'
  await ensureDir(REPORT_DIR)
  const routes = await readRoutes()

  const browser = await puppeteer.launch({ headless: 'new' })
  const page = await browser.newPage()

  // Prepare axe-core source once and reuse for all routes
  const axePath = require.resolve('axe-core/axe.min.js')
  const axeSource = await fs.readFile(axePath, 'utf8')

  const allResults = []

  for (const route of routes) {
    const url = `${baseUrl}${route}`
    console.log(`[axe] Navigating: ${url}`)
    const resp = await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 })
    if (!resp || !resp.ok()) {
      console.warn(`[axe] Warning: Non-OK response for ${url}: ${resp ? resp.status() : 'no response'}`)
    }

    // Allow the page to settle to avoid race conditions
    await new Promise((resolve) => setTimeout(resolve, 300))

    await page.addStyleTag({ content: '*{scroll-behavior:auto!important}' })

    // Inject axe-core and run with WCAG tags
    await page.evaluate(axeSource)
    const results = await page.evaluate(async () => {
      // eslint-disable-next-line no-undef
      return await axe.run(document, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] }
      })
    })

    allResults.push({ route, url, results })

    const stamp = nowStamp()
    const safeRoute = route.replace(/[^a-z0-9_\-]/gi, '_')
    await fs.writeFile(path.join(REPORT_DIR, `axe-${stamp}-${safeRoute}.json`), JSON.stringify(results, null, 2), 'utf8')
    console.log(`[axe] Wrote report for ${route}`)
  }

  await browser.close()

  // Aggregate summary
  const summary = {
    generatedAt: new Date().toISOString(),
    routes: allResults.map(r => r.route),
    totals: allResults.reduce((acc, { results }) => {
      acc.violations += results.violations?.length || 0
      acc.incomplete += results.incomplete?.length || 0
      acc.passes += results.passes?.length || 0
      acc.inapplicable += results.inapplicable?.length || 0
      return acc
    }, { violations: 0, incomplete: 0, passes: 0, inapplicable: 0 })
  }
  await fs.writeFile(path.join(REPORT_DIR, `axe-summary-${nowStamp()}.json`), JSON.stringify(summary, null, 2), 'utf8')
  console.log(`[axe] Summary written: ${path.join(REPORT_DIR, 'axe-summary-*.json')}`)
}

main().catch((err) => {
  console.error('[axe] Fatal error:', err)
  process.exitCode = 1
})
