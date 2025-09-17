#!/usr/bin/env node
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const REPORT_DIR = path.resolve(process.cwd(), 'config', 'reports')
const ROUTES_PATH = path.join(__dirname, 'routes.json')

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true })
}

function safeRouteName(route) {
  return route.replace(/[^a-z0-9_\-]/gi, '_')
}

async function loadRoutesMap() {
  const raw = await fs.readFile(ROUTES_PATH, 'utf8')
  const routes = JSON.parse(raw)
  if (!Array.isArray(routes)) throw new Error('routes.json must be an array of paths')
  const map = new Map()
  for (const r of routes) {
    map.set(safeRouteName(r), r)
  }
  return map
}

function extractSafeRouteFromFilename(filename) {
  // filename pattern: axe-YYYY-MM-DD_HH-mm-ss-<safeRoute>.json
  const base = path.basename(filename, '.json')
  const idx = base.lastIndexOf('-')
  if (idx === -1) return null
  return base.slice(idx + 1)
}

async function listAxeFiles(dir) {
  const items = await fs.readdir(dir)
  return items
    .filter((f) => f.startsWith('axe-') && f.endsWith('.json') && !f.startsWith('axe-summary-'))
    .map((f) => path.join(dir, f))
}

function initRuleBucket() {
  return {
    totalInstances: 0,
    impact: { critical: 0, serious: 0, moderate: 0, minor: 0, unknown: 0 },
    routes: new Set(),
    help: '',
    helpUrl: ''
  }
}

async function aggregate() {
  await ensureDir(REPORT_DIR)
  const routesMap = await loadRoutesMap()
  const axeFiles = await listAxeFiles(REPORT_DIR)

  const byRoute = new Map() // route -> count
  const byRule = new Map() // ruleId -> bucket

  let routesProcessed = 0
  for (const file of axeFiles) {
    const safeRoute = extractSafeRouteFromFilename(file)
    if (!safeRoute) continue
    const route = routesMap.get(safeRoute) || '/' // fallback if mapping missing

    const raw = await fs.readFile(file, 'utf8')
    const results = JSON.parse(raw)

    const violations = Array.isArray(results.violations) ? results.violations : []

    // count violations per route (by total nodes to reflect instances)
    const routeCount = violations.reduce((sum, v) => sum + (Array.isArray(v.nodes) ? v.nodes.length : 0), 0)
    byRoute.set(route, (byRoute.get(route) || 0) + routeCount)
    routesProcessed += 1

    for (const v of violations) {
      const ruleId = v.id || 'unknown'
      const bucket = byRule.get(ruleId) || initRuleBucket()
      const nodesCount = Array.isArray(v.nodes) ? v.nodes.length : 1
      const impact = (v.impact || 'unknown').toLowerCase()

      bucket.totalInstances += nodesCount
      if (bucket.impact[impact] === undefined) {
        bucket.impact.unknown += nodesCount
      } else {
        bucket.impact[impact] += nodesCount
      }
      bucket.routes.add(route)
      bucket.help = v.help || bucket.help
      bucket.helpUrl = v.helpUrl || bucket.helpUrl

      byRule.set(ruleId, bucket)
    }
  }

  const byRouteArr = Array.from(byRoute.entries())
    .map(([route, count]) => ({ route, violations: count }))
    .sort((a, b) => b.violations - a.violations)

  const byRuleObj = {}
  for (const [ruleId, bucket] of byRule.entries()) {
    byRuleObj[ruleId] = {
      totalInstances: bucket.totalInstances,
      impact: bucket.impact,
      routes: Array.from(bucket.routes).sort(),
      help: bucket.help,
      helpUrl: bucket.helpUrl
    }
  }

  const totals = {
    routesProcessed: byRouteArr.length,
    totalViolations: byRouteArr.reduce((s, r) => s + r.violations, 0),
    uniqueRules: Object.keys(byRuleObj).length
  }

  const output = {
    generatedAt: new Date().toISOString(),
    totals,
    byRoute: byRouteArr,
    byRule: byRuleObj
  }

  const outPath = path.join(REPORT_DIR, 'axe-issues-summary.json')
  await fs.writeFile(outPath, JSON.stringify(output, null, 2), 'utf8')
  console.log(`[axe-aggregate] Wrote ${outPath}`)
}

aggregate().catch((err) => {
  console.error('[axe-aggregate] Fatal error:', err)
  process.exitCode = 1
})