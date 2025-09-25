import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

import fs from 'node:fs/promises';
import path from 'node:path';

export async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

export function nowStamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(
    d.getHours(),
  )}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`;
}

const ROUTES_PATH = path.join(process.cwd(), 'scripts', 'audit', 'routes.json');

export async function readRoutes() {
  const raw = await fs.readFile(ROUTES_PATH, 'utf8');
  const list = JSON.parse(raw);
  if (!Array.isArray(list)) {
    throw new Error('routes.json must be an array of paths');
  }
  return list;
}

export function safeRouteName(route) {
  return route.replace(/[^a-z0-9_-]/gi, '_');
}