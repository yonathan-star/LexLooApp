import { Router } from "express";
import { ok } from "../lib/respond";

export const systemRouter = Router();

systemRouter.get("/status", (_req, res) => {
  return ok(res, {
    status: process.env.MAINTENANCE_MODE === "true" ? "maintenance" : "ok",
    minimumMobileVersion: process.env.MINIMUM_MOBILE_VERSION ?? "1.0.0",
    updateUrl: process.env.MOBILE_UPDATE_URL ?? "https://lexloo.com/update",
  });
});
