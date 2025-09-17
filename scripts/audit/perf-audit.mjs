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

function classifyTransfer(size) {
  if (size < 200_000) return 'low'
  if (size < 1_000_000) return 'medium'
  return 'high'
}

async function main() {
  const baseUrl = process.env.SITE_URL || 'http://localhost:4321'
  await ensureDir(REPORT_DIR)
  const routes = await readRoutes()

  const browser = await puppeteer.launch({ headless: 'new' })
  const page = await browser.newPage()

  const all = []

  for (const route of routes) {
    const url = `${baseUrl}${route}`
    console.log(`[perf] Navigating: ${url}`)

    let totalBytes = 0
    let requests = 0

    const onResponse = async (res) => {
      try {
        const buf = await res.buffer().catch(() => null)
        if (buf) {
          totalBytes += buf.length
          requests += 1
        }
      } catch {}
    }

    page.on('response', onResponse)

    const start = Date.now()
    const resp = await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 })
    const navTime = Date.now() - start
    const status = resp ? resp.status() : 0

    const perf = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0]
      const paint = performance.getEntriesByType('paint')
      const fcp = paint.find(p => p.name === 'first-contentful-paint')?.startTime || null
      return {
        domContentLoaded: nav?.domContentLoadedEventEnd ?? null,
        loadEventEnd: nav?.loadEventEnd ?? null,
        firstContentfulPaint: fcp,
        timeToFirstByte: nav?.responseStart ?? null
      }
    })

    const record = {
      route,
      url,
      status,
      navTime,
      totalBytes,
      requests,
      perf,
      transferClass: classifyTransfer(totalBytes)
    }

    all.push(record)

    const safeRoute = route.replace(/\//g,'_').replace(/[^a-zA-Z0-9_\-]/g,'')
    await fs.writeFile(path.join(REPORT_DIR, `perf-${safeRoute}.json`), JSON.stringify(record, null, 2), 'utf8')
    console.log(`[perf] Wrote report for ${route}`)

    page.off('response', onResponse)
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    routes: all,
    stats: {
      avgNavTime: all.reduce((a, r) => a + r.navTime, 0) / (all.length || 1),
      totalTransfer: all.reduce((a, r) => a + r.totalBytes, 0),
      totalRequests: all.reduce((a, r) => a + r.requests, 0)
    }
  }

  await fs.writeFile(path.join(REPORT_DIR, `perf-summary.json`), JSON.stringify(summary, null, 2), 'utf8')

  await browser.close()
}

main().catch((err) => {
  console.error('[perf] Fatal error:', err)
  process.exitCode = 1
})