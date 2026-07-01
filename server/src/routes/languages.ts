import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../lib/auth";
import { ok } from "../lib/respond";

export const languagesRouter = Router();

languagesRouter.get("/", requireAuth, async (_req, res) => {
  const languages = await prisma.language.findMany({ where: { active: true } });
  return ok(res, languages);
});
