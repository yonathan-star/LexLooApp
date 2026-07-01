import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, requireRole } from "../lib/auth";
import { ok, fail } from "../lib/respond";
import { writeAudit } from "../services/audit";

export const packsRouter = Router();

// Screen 55: Pack Library — published packs only for regular users.
packsRouter.get("/", requireAuth, async (req, res) => {
  const isAdmin = req.auth!.role === "admin";
  const packs = await prisma.wordPack.findMany({
    where: isAdmin ? {} : { status: "published" },
    include: { language: true, targetLanguage: true, _count: { select: { packWords: true } } },
    orderBy: { createdAt: "desc" },
  });
  return ok(res, packs);
});

// Screen 56/57: Pack Detail + Word List.
packsRouter.get("/:id", requireAuth, async (req, res) => {
  const pack = await prisma.wordPack.findUnique({
    where: { id: req.params.id },
    include: {
      language: true,
      targetLanguage: true,
      packWords: {
        orderBy: { displayOrder: "asc" },
        include: { word: { include: { content: true } } },
      },
    },
  });
  if (!pack) return fail(res, 404, "Pack not found");
  if (pack.status !== "published" && req.auth!.role !== "admin") return fail(res, 404, "Pack not found");
  return ok(res, pack);
});

const createPackSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  languageId: z.string().min(1),
  targetLanguageId: z.string().optional(),
  level: z.string().optional(),
  category: z.string().optional(),
  sku: z.string().optional(),
  description: z.string().optional(),
});

packsRouter.post("/", requireAuth, requireRole("admin"), async (req, res) => {
  const parsed = createPackSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, parsed.error.issues[0]?.message ?? "Invalid input");
  const pack = await prisma.wordPack.create({ data: parsed.data });
  await writeAudit(req.auth!.userId, "create", "word_pack", pack.id, null, pack);
  return ok(res, pack);
});

packsRouter.patch("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const before = await prisma.wordPack.findUnique({ where: { id: req.params.id } });
  if (!before) return fail(res, 404, "Pack not found");
  const updated = await prisma.wordPack.update({ where: { id: req.params.id }, data: req.body });
  await writeAudit(req.auth!.userId, "update", "word_pack", updated.id, before, updated);
  return ok(res, updated);
});

// Assign/order words within a pack (Admin Pack Editor, Screen 69).
const assignWordsSchema = z.object({
  wordIds: z.array(z.string()),
});

packsRouter.post("/:id/words", requireAuth, requireRole("admin"), async (req, res) => {
  const parsed = assignWordsSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid input");
  const pack = await prisma.wordPack.findUnique({ where: { id: req.params.id } });
  if (!pack) return fail(res, 404, "Pack not found");

  await prisma.packWord.deleteMany({ where: { packId: pack.id } });
  await prisma.packWord.createMany({
    data: parsed.data.wordIds.map((wordId, displayOrder) => ({ packId: pack.id, wordId, displayOrder })),
  });
  await writeAudit(req.auth!.userId, "update", "pack_words", pack.id, null, parsed.data);
  return ok(res, { success: true });
});
