import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { Request, Response, NextFunction } from "express";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET || "lexloo-dev-secret";

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: string;
}

export function signToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
}

export function verifyToken(token: string): AuthTokenPayload {
  return jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth?: AuthTokenPayload;
    }
  }
}

// Every protected route runs through requireAuth first; role checks layer on top.
// This is the app-level equivalent of Supabase row-level security since we are
// not running against a managed Postgres/Supabase project in this environment.
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "Missing or invalid authorization header", data: null });
  }
  try {
    const token = header.slice("Bearer ".length);
    req.auth = verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id: req.auth.userId }, select: { status: true } });
    if (!user || user.status !== "active") {
      return res.status(403).json({ success: false, error: "This account is not active", data: null });
    }
    next();
  } catch {
    return res.status(401).json({ success: false, error: "Invalid or expired session", data: null });
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      return res.status(403).json({ success: false, error: "You do not have permission to do that", data: null });
    }
    next();
  };
}
