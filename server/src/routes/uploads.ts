import path from "path";
import fs from "fs";
import { Router } from "express";
import multer from "multer";
import { requireAuth } from "../lib/auth";
import { ok, fail } from "../lib/respond";

export const uploadsRouter = Router();

const UPLOADS_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
});

uploadsRouter.post("/avatar", requireAuth, upload.single("avatar"), (req, res) => {
  if (!req.file) return fail(res, 400, "No file uploaded");
  const url = `/uploads/${req.file.filename}`;
  return ok(res, { url });
});
