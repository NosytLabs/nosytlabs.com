#!/usr/bin/env node
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROUTES_PATH = path.join(__dirname, 'routes.json')
const REPORT_DIR = path.resolve(process.cwd(), 'config', 'reports')

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true })
}

async function readRoutes() {
  const raw = await fs.readFile(ROUTES_PATH, 'utf8')
  const list = JSON.parse(raw)
  if (!Array.isArray(list)) throw new Error('routes.json must be an array of paths')
  return list
}

async function runFunctionalChecks(page) {
  const issues = []
  // 1) Verify presence of a <main> landmark
  const hasMain = await page.$('main')
  if (!hasMain) issues.push({ type: 'structure', message: 'Missing <main> element' })

  // 2) Check that document has a non-empty title
  const title = await page.title()
  if (!title || !title.trim()) issues.push({ type: 'metadata', message: 'Missing or empty <title>' })

  // 3) Verify at least one interactive element exists
  const interactiveCount = await page.$$eval('a, button, input[type="submit"], [role="button"]', els => els.length)
  if (interactiveCount === 0) issues.push({ type: 'interaction', message: 'No interactive elements found' })

  return issues
}

async function main() {
  const baseUrl = process.env.SITE_URL || 'http://localhost:4321'
  await ensureDir(REPORT_DIR)
  const routes = await readRoutes()

  const browser = await (await import('puppeteer')).default.launch({ headless: 'new' })
  const page = await browser.newPage()

  const results = []

  for (const route of routes) {
    const url = `${baseUrl}${route}`
    console.log(`[func] Navigating: ${url}`)
    const start = Date.now()
    const resp = await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 }).catch(err => ({ error: String(err) }))
    const duration = Date.now() - start

    let status = 0
    if (resp && typeof resp.status === 'function') {
      try { status = resp.status() } catch {}
    }

    const issues = await runFunctionalChecks(page)

    const record = {
      route,
      url,
      status,
      duration,
      issueCount: issues.length,
      issues
    }

    results.push(record)

    const safeRoute = route.replace(/\//g, '_').replace(/[^a-zA-Z0-9_\-]/g, '')
    await fs.writeFile(path.join(REPORT_DIR, `func-${safeRoute}.json`), JSON.stringify(record, null, 2), 'utf8')
    console.log(`[func] Wrote report for ${route}`)
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    totals: {
      routes: results.length,
      routesWithIssues: results.filter(r => r.issueCount > 0).length,
      totalIssues: results.reduce((a, r) => a + r.issueCount, 0)
    },
    byRoute: results.map(r => ({ route: r.route, issueCount: r.issueCount })),
    byType: results.flatMap(r => r.issues).reduce((acc, issue) => {
      acc[issue.type] = (acc[issue.type] || 0) + 1
      return acc
    }, {})
  }

  await fs.writeFile(path.join(REPORT_DIR, 'func-summary.json'), JSON.stringify(summary, null, 2), 'utf8')
  await browser.close()
}

main().catch(err => {
  console.error('[func] Fatal error:', err)
  process.exitCode = 1
})
