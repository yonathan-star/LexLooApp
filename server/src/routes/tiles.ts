import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, requireRole } from "../lib/auth";
import { ok, fail } from "../lib/respond";
import { writeAudit } from "../services/audit";
import { randomUUID } from "crypto";

export const tilesRouter = Router();

async function generateUniqueTileCodes(count: number): Promise<string[]> {
  const codes = new Set<string>();
  while (codes.size < count) {
    codes.add(randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase());
  }

  const existing = await prisma.tile.findMany({
    where: { tileCode: { in: [...codes] } },
    select: { tileCode: true },
  });

  for (const tile of existing) codes.delete(tile.tileCode);
  if (codes.size === count) return [...codes];

  const replacements: string[] = await generateUniqueTileCodes(count - codes.size);
  return [...codes, ...replacements];
}

// Screen 70: Admin Tile Code List.
tilesRouter.get("/", requireAuth, requireRole("admin"), async (req, res) => {
  const tiles = await prisma.tile.findMany({
    include: { word: true, pack: true, batch: true },
    orderBy: { id: "desc" },
    take: 500,
  });
  return ok(res, tiles);
});

// Resolve a scanned/manually entered tile code into its word+pack (Screen 16/18).
// This is the bridge step described in PRD section 9: scanner resolves the
// code, the backend returns metadata, and the client routes to the word.
tilesRouter.get("/resolve/:code", requireAuth, async (req, res) => {
  const tile = await prisma.tile.findUnique({
    where: { tileCode: req.params.code.toUpperCase() },
    include: { word: { include: { content: true } }, pack: true },
  });
  if (!tile || !tile.word || tile.word.status !== "published" || (tile.pack && tile.pack.status !== "published")) {
    return fail(res, 404, "We could not read that tile. Try again or enter the code manually.");
  }
  return ok(res, { tile, word: tile.word, pack: tile.pack });
});

const createTileSchema = z.object({
  tileCode: z.string().min(1),
  wordId: z.string().optional(),
  packId: z.string().optional(),
  batchId: z.string().optional(),
});

tilesRouter.post("/", requireAuth, requireRole("admin"), async (req, res) => {
  const parsed = createTileSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid input");
  const tileCode = parsed.data.tileCode.toUpperCase();
  const existing = await prisma.tile.findUnique({ where: { tileCode } });
  if (existing) return fail(res, 409, "That tile code is already in use");

  const packId = parsed.data.packId ?? (parsed.data.wordId ? (await prisma.packWord.findFirst({ where: { wordId: parsed.data.wordId }, orderBy: { displayOrder: "asc" } }))?.packId : undefined);
  const tile = await prisma.tile.create({
    data: {
      tileCode,
      wordId: parsed.data.wordId,
      packId,
      batchId: parsed.data.batchId,
      qrPayload: `lexloo://tile/${tileCode}`,
      status: parsed.data.wordId ? "assigned" : "unassigned",
    },
  });
  await writeAudit(req.auth!.userId, "create", "tile", tile.id, null, tile);
  return ok(res, tile);
});

// Screen 71: Admin Tile Assignment — map code to word, prevents duplicates.
const assignSchema = z.object({
  tileCode: z.string().min(1),
  wordId: z.string().min(1),
  packId: z.string().optional(),
});

tilesRouter.patch("/assign", requireAuth, requireRole("admin"), async (req, res) => {
  const parsed = assignSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid input");
  const code = parsed.data.tileCode.toUpperCase();
  const word = await prisma.word.findUnique({ where: { id: parsed.data.wordId } });
  if (!word) return fail(res, 404, "Word not found");

  const packId =
    parsed.data.packId ??
    (
      await prisma.packWord.findFirst({
        where: { wordId: parsed.data.wordId, pack: { status: "published" } },
        orderBy: { displayOrder: "asc" },
      })
    )?.packId;

  if (parsed.data.packId) {
    const relation = await prisma.packWord.findUnique({
      where: { packId_wordId: { packId: parsed.data.packId, wordId: parsed.data.wordId } },
    });
    if (!relation) return fail(res, 400, "That word is not in the selected pack");
  }

  const tile = await prisma.tile.upsert({
    where: { tileCode: code },
    create: {
      tileCode: code,
      qrPayload: `lexloo://tile/${code}`,
      wordId: parsed.data.wordId,
      packId,
      status: "assigned",
    },
    update: { wordId: parsed.data.wordId, packId, status: "assigned" },
  });
  await writeAudit(req.auth!.userId, "assign", "tile", tile.id, null, tile);
  return ok(res, tile);
});

// Screen 72: Admin QR Batch Generator — generate N unique codes for manufacturing export.
const batchSchema = z.object({
  batchName: z.string().min(1),
  count: z.number().int().min(1).max(5000),
  manufacturerRef: z.string().optional(),
});

tilesRouter.post("/batches", requireAuth, requireRole("admin"), async (req, res) => {
  const parsed = batchSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, "Invalid input");

  const batch = await prisma.tileBatch.create({
    data: { batchName: parsed.data.batchName, manufacturerRef: parsed.data.manufacturerRef },
  });

  const codes = await generateUniqueTileCodes(parsed.data.count);
  await prisma.tile.createMany({
    data: codes.map((code) => ({
      tileCode: code,
      qrPayload: `lexloo://tile/${code}`,
      batchId: batch.id,
      status: "unassigned",
    })),
  });

  await writeAudit(req.auth!.userId, "create", "tile_batch", batch.id, null, { count: parsed.data.count });
  return ok(res, { batch, codes });
});

tilesRouter.get("/batches/:id/export", requireAuth, requireRole("admin"), async (req, res) => {
  const tiles = await prisma.tile.findMany({ where: { batchId: req.params.id } });
  await prisma.tileBatch.update({ where: { id: req.params.id }, data: { exportedAt: new Date() } });
  const csv = ["tile_code,qr_payload,status", ...tiles.map((t) => `${t.tileCode},${t.qrPayload},${t.status}`)].join("\n");
  res.setHeader("Content-Type", "text/csv");
  res.send(csv);
});
