import type { Response } from "express";

export function ok(res: Response, data: unknown, meta?: unknown) {
  return res.json({ success: true, data, error: null, meta: meta ?? null });
}

export function fail(res: Response, status: number, error: string) {
  return res.status(status).json({ success: false, data: null, error, meta: null });
}
