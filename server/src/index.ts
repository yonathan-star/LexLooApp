import path from "path";
import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth";
import { profilesRouter } from "./routes/profiles";
import { parentsRouter } from "./routes/parents";
import { packsRouter } from "./routes/packs";
import { wordsRouter } from "./routes/words";
import { languagesRouter } from "./routes/languages";
import { tilesRouter } from "./routes/tiles";
import { scansRouter } from "./routes/scans";
import { progressRouter } from "./routes/progress";
import { practiceRouter } from "./routes/practice";
import { xpRouter } from "./routes/xp";
import { streaksRouter } from "./routes/streaks";
import { badgesRouter } from "./routes/badges";
import { missionsRouter } from "./routes/missions";
import { adminRouter } from "./routes/admin";
import { analyticsRouter } from "./routes/analytics";
import { systemRouter } from "./routes/system";
import { notificationsRouter } from "./routes/notifications";
import { uploadsRouter } from "./routes/uploads";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/health", (_req, res) => res.json({ success: true, data: { status: "ok" } }));
app.use("/system", systemRouter);

app.use("/auth", authRouter);
app.use("/profiles", profilesRouter);
app.use("/parents", parentsRouter);
app.use("/family", parentsRouter);
app.use("/packs", packsRouter);
app.use("/words", wordsRouter);
app.use("/languages", languagesRouter);
app.use("/tiles", tilesRouter);
app.use("/scans", scansRouter);
app.use("/progress", progressRouter);
app.use("/practice", practiceRouter);
app.use("/xp", xpRouter);
app.use("/streaks", streaksRouter);
app.use("/badges", badgesRouter);
app.use("/missions", missionsRouter);
app.use("/admin", adminRouter);
app.use("/analytics", analyticsRouter);
app.use("/notifications", notificationsRouter);
app.use("/uploads", uploadsRouter);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ success: false, data: null, error: "Something went wrong on our end." });
});

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => {
  console.log(`LexLoo API listening on http://localhost:${port}`);
});
