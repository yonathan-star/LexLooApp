import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, requireRole } from "../lib/auth";
import { ok, fail } from "../lib/respond";
import { writeAudit } from "../services/audit";
import { trackEvent } from "../services/analytics";
import { awardXpOncePerDay } from "../services/gamification";
import { canAccessProfile } from "./profiles";

export const wordsRouter = Router();

function qaProblemsForWord(word: {
  status: string;
  content: { shortDefinition: string | null; audioUrl: string | null } | null;
  translations: { translation: string | null; targetLanguageId: string | null }[];
  packWords: unknown[];
  tiles: unknown[];
}) {
  const problems: string[] = [];
  if (!word.content) problems.push("Missing definition");
  else if (!word.content.shortDefinition?.trim()) problems.push("Missing short definition");
  if (!word.content?.audioUrl?.trim()) problems.push("Missing audio");
  if (word.translations.some((translation) => !translation.translation?.trim() || !translation.targetLanguageId)) {
    problems.push("Invalid translation");
  }
  if (word.status === "published") {
    if (word.packWords.length === 0) problems.push("Published word missing pack association");
    if (word.tiles.length === 0) problems.push("Published word missing tile mapping");
  }
  return problems;
}

// Screen 66: Admin Word List — search/filter; also used by Pack Word List search.
wordsRouter.get("/", requireAuth, async (req, res) => {
  const isAdmin = req.auth!.role === "admin";
  const search = (req.query.search as string) || undefined;
  const words = await prisma.word.findMany({
    where: {
      status: isAdmin ? undefined : "published",
      ...(search ? { normalizedText: { contains: search.toLowerCase() } } : {}),
    },
    include: { content: true, language: true },
    orderBy: { text: "asc" },
    take: 200,
  });
  return ok(res, words);
});

wordsRouter.get("/:id", requireAuth, async (req, res) => {
  const word = await prisma.word.findUnique({
    where: { id: req.params.id },
    include: {
      content: true,
      language: true,
      translations: { include: { targetLanguage: true } },
      examples: true,
      relationsA: {
        include: {
          relatedWord: {
            include: {
              content: true,
              translations: { include: { targetLanguage: true } },
              examples: true,
            },
          },
        },
      },
    },
  });
  if (!word) return fail(res, 404, "Word not found");
  if (word.status !== "published" && req.auth!.role !== "admin") return fail(res, 404, "Word not found");
  const profileId = typeof req.query.profileId === "string" ? req.query.profileId : undefined;
  if (profileId) {
    const hasAccess = await canAccessProfile(req.auth!.userId, req.auth!.role, profileId);
    if (!hasAccess) return fail(res, 403, "You don't have access to this profile");
    await awardXpOncePerDay(profileId, "word_view", word.id);
  }
  await trackEvent("word_view", { userId: req.auth!.userId, profileId, properties: { wordId: word.id } });
  return ok(res, word);
});

// Screen 67: Admin Word Editor — create/edit full word object model.
const wordContentSchema = z.object({
  shortDefinition: z.string().min(1),
  longDefinition: z.string().optional(),
  phonetic: z.string().optional(),
  origin: z.string().optional(),
  funFact: z.string().optional(),
  audioUrl: z.string().optional(),
});

const createWordSchema = z.object({
  text: z.string().min(1),
  languageId: z.string().min(1),
  partOfSpeech: z.string().optional(),
  difficultyScore: z.number().int().min(1).max(10).default(1),
  gradeLevel: z.string().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
  content: wordContentSchema,
  examples: z.array(z.object({ exampleText: z.string(), level: z.string().optional(), ageBand: z.string().optional() })).optional(),
  translations: z
    .array(z.object({ targetLanguageId: z.string(), translation: z.string(), transliteration: z.string().optional() }))
    .optional(),
});

wordsRouter.post("/", requireAuth, requireRole("admin"), async (req, res) => {
  const parsed = createWordSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, 400, parsed.error.issues[0]?.message ?? "Invalid input");
  if (parsed.data.status === "published") {
    return fail(res, 400, "Create the word as a draft first, then add it to a pack and tile before publishing.");
  }
  const { content, examples, translations, ...wordData } = parsed.data;

  const word = await prisma.word.create({
    data: {
      ...wordData,
      normalizedText: wordData.text.toLowerCase().trim(),
      content: { create: content },
      examples: examples ? { create: examples } : undefined,
      translations: translations ? { create: translations } : undefined,
    },
    include: { content: true, examples: true, translations: true },
  });

  await writeAudit(req.auth!.userId, "create", "word", word.id, null, word);
  return ok(res, word);
});

wordsRouter.patch("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const before = await prisma.word.findUnique({ where: { id: req.params.id }, include: { content: true } });
  if (!before) return fail(res, 404, "Word not found");

  const { content, text, ...rest } = req.body as Record<string, unknown>;

  const shouldPublish = req.body?.status === "published";
  if (shouldPublish) {
    const candidate = await prisma.word.findUnique({
      where: { id: req.params.id },
      include: { content: true, translations: true, packWords: true, tiles: true },
    });
    if (!candidate) return fail(res, 404, "Word not found");
    const candidateContent = content ? { ...candidate.content, ...(content as any) } : candidate.content;
    const problems = qaProblemsForWord({ ...candidate, status: "published", content: candidateContent });
    if (problems.length) return fail(res, 400, `Fix QA before publishing: ${problems.join(", ")}`);
  }

  const updated = await prisma.word.update({
    where: { id: req.params.id },
    data: {
      ...rest,
      ...(text ? { text, normalizedText: (text as string).toLowerCase().trim() } : {}),
      ...(content
        ? {
            content: {
              upsert: { create: content as any, update: content as any },
            },
          }
        : {}),
    },
    include: { content: true },
  });

  await writeAudit(req.auth!.userId, "update", "word", updated.id, before, updated);
  return ok(res, updated);
});

// Screen 75: Admin Content QA — find words missing required fields before publish.
wordsRouter.get("/qa/issues", requireAuth, requireRole("admin"), async (_req, res) => {
  const words = await prisma.word.findMany({
    where: { status: { in: ["draft", "published"] } },
    include: { content: true, translations: true, tiles: true, packWords: true },
    orderBy: [{ status: "desc" }, { updatedAt: "desc" }],
  });
  const issues = words
    .map((w) => {
      const problems = qaProblemsForWord(w);
      if (problems.length === 0) return null;
      return { wordId: w.id, text: w.text, status: w.status, problems };
    })
    .filter(Boolean);
  return ok(res, issues);
});
