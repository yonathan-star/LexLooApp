-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'student',
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLoginAt" DATETIME
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "profileType" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ageRange" TEXT,
    "gradeLevel" TEXT,
    "avatar" TEXT,
    "activeGoalId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ParentChildLink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "parentUserId" TEXT NOT NULL,
    "childProfileId" TEXT NOT NULL,
    "relationship" TEXT NOT NULL DEFAULT 'parent',
    "permissions" TEXT NOT NULL DEFAULT '{}',
    CONSTRAINT "ParentChildLink_parentUserId_fkey" FOREIGN KEY ("parentUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ParentChildLink_childProfileId_fkey" FOREIGN KEY ("childProfileId") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Language" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nativeName" TEXT,
    "direction" TEXT NOT NULL DEFAULT 'ltr',
    "active" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "WordPack" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,
    "targetLanguageId" TEXT,
    "level" TEXT,
    "category" TEXT,
    "sku" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WordPack_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "WordPack_targetLanguageId_fkey" FOREIGN KEY ("targetLanguageId") REFERENCES "Language" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Word" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "normalizedText" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,
    "partOfSpeech" TEXT,
    "difficultyScore" INTEGER NOT NULL DEFAULT 1,
    "gradeLevel" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Word_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WordContent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "wordId" TEXT NOT NULL,
    "shortDefinition" TEXT NOT NULL,
    "longDefinition" TEXT,
    "phonetic" TEXT,
    "origin" TEXT,
    "funFact" TEXT,
    "audioUrl" TEXT,
    CONSTRAINT "WordContent_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WordTranslation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "wordId" TEXT NOT NULL,
    "targetLanguageId" TEXT NOT NULL,
    "translation" TEXT NOT NULL,
    "transliteration" TEXT,
    "exampleTranslation" TEXT,
    CONSTRAINT "WordTranslation_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "WordTranslation_targetLanguageId_fkey" FOREIGN KEY ("targetLanguageId") REFERENCES "Language" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WordExample" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "wordId" TEXT NOT NULL,
    "exampleText" TEXT NOT NULL,
    "level" TEXT,
    "contextTag" TEXT,
    "ageBand" TEXT,
    CONSTRAINT "WordExample_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WordRelation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "wordId" TEXT NOT NULL,
    "relatedWordId" TEXT NOT NULL,
    "relationType" TEXT NOT NULL,
    CONSTRAINT "WordRelation_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "WordRelation_relatedWordId_fkey" FOREIGN KEY ("relatedWordId") REFERENCES "Word" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PackWord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "packId" TEXT NOT NULL,
    "wordId" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "tileRequired" BOOLEAN NOT NULL DEFAULT false,
    "levelLabel" TEXT,
    CONSTRAINT "PackWord_packId_fkey" FOREIGN KEY ("packId") REFERENCES "WordPack" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PackWord_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tileCode" TEXT NOT NULL,
    "qrPayload" TEXT NOT NULL,
    "nfcPayload" TEXT,
    "packId" TEXT,
    "wordId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'unassigned',
    "batchId" TEXT,
    CONSTRAINT "Tile_packId_fkey" FOREIGN KEY ("packId") REFERENCES "WordPack" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Tile_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Tile_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "TileBatch" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TileBatch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "batchName" TEXT NOT NULL,
    "manufacturerRef" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "exportedAt" DATETIME,
    "notes" TEXT
);

-- CreateTable
CREATE TABLE "ScanEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "tileId" TEXT,
    "wordId" TEXT,
    "scannedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" TEXT NOT NULL DEFAULT 'camera',
    "deviceInfo" TEXT,
    "result" TEXT NOT NULL DEFAULT 'success',
    CONSTRAINT "ScanEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ScanEvent_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ScanEvent_tileId_fkey" FOREIGN KEY ("tileId") REFERENCES "Tile" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ScanEvent_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserWordProgress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "wordId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "masteryScore" INTEGER NOT NULL DEFAULT 0,
    "correctCount" INTEGER NOT NULL DEFAULT 0,
    "incorrectCount" INTEGER NOT NULL DEFAULT 0,
    "lastSeenAt" DATETIME,
    "nextReviewAt" DATETIME,
    CONSTRAINT "UserWordProgress_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserWordProgress_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "QuizSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "activityType" TEXT NOT NULL,
    "packId" TEXT,
    "wordId" TEXT,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    "score" INTEGER,
    "xpAwarded" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "QuizSession_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "QuizSession_packId_fkey" FOREIGN KEY ("packId") REFERENCES "WordPack" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "QuizAttempt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "wordId" TEXT NOT NULL,
    "promptType" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "responseTimeMs" INTEGER,
    CONSTRAINT "QuizAttempt_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "QuizSession" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "QuizAttempt_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "XpEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "sourceId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "XpEvent_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Streak" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "currentCount" INTEGER NOT NULL DEFAULT 0,
    "longestCount" INTEGER NOT NULL DEFAULT 0,
    "lastActiveDate" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    CONSTRAINT "Streak_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Badge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "iconUrl" TEXT,
    "requirementJson" TEXT NOT NULL DEFAULT '{}',
    "active" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "UserBadge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "earnedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sourceEventId" TEXT,
    CONSTRAINT "UserBadge_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserBadge_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "Badge" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Mission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "missionType" TEXT NOT NULL DEFAULT 'daily',
    "requirementJson" TEXT NOT NULL DEFAULT '{}',
    "xpReward" INTEGER NOT NULL DEFAULT 10,
    "active" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "UserMission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "progressJson" TEXT NOT NULL DEFAULT '{}',
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    CONSTRAINT "UserMission_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserMission_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "scheduledFor" DATETIME,
    "sentAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "payloadJson" TEXT NOT NULL DEFAULT '{}',
    CONSTRAINT "Notification_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AdminAuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "adminUserId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "beforeJson" TEXT,
    "afterJson" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AdminAuditLog_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FeatureFlag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "description" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "rolloutJson" TEXT NOT NULL DEFAULT '{}'
);

-- CreateTable
CREATE TABLE "AnalyticsEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "profileId" TEXT,
    "eventName" TEXT NOT NULL,
    "propertiesJson" TEXT NOT NULL DEFAULT '{}',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AnalyticsEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "AnalyticsEvent_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SavedWord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "wordId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SavedWord_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SavedWord_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Profile_userId_idx" ON "Profile"("userId");

-- CreateIndex
CREATE INDEX "ParentChildLink_parentUserId_idx" ON "ParentChildLink"("parentUserId");

-- CreateIndex
CREATE INDEX "ParentChildLink_childProfileId_idx" ON "ParentChildLink"("childProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "Language_code_key" ON "Language"("code");

-- CreateIndex
CREATE UNIQUE INDEX "WordPack_slug_key" ON "WordPack"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "WordPack_sku_key" ON "WordPack"("sku");

-- CreateIndex
CREATE INDEX "Word_normalizedText_idx" ON "Word"("normalizedText");

-- CreateIndex
CREATE UNIQUE INDEX "WordContent_wordId_key" ON "WordContent"("wordId");

-- CreateIndex
CREATE INDEX "WordTranslation_wordId_idx" ON "WordTranslation"("wordId");

-- CreateIndex
CREATE INDEX "WordExample_wordId_idx" ON "WordExample"("wordId");

-- CreateIndex
CREATE INDEX "WordRelation_wordId_idx" ON "WordRelation"("wordId");

-- CreateIndex
CREATE INDEX "PackWord_packId_idx" ON "PackWord"("packId");

-- CreateIndex
CREATE UNIQUE INDEX "PackWord_packId_wordId_key" ON "PackWord"("packId", "wordId");

-- CreateIndex
CREATE UNIQUE INDEX "Tile_tileCode_key" ON "Tile"("tileCode");

-- CreateIndex
CREATE INDEX "Tile_packId_idx" ON "Tile"("packId");

-- CreateIndex
CREATE INDEX "Tile_wordId_idx" ON "Tile"("wordId");

-- CreateIndex
CREATE INDEX "ScanEvent_profileId_idx" ON "ScanEvent"("profileId");

-- CreateIndex
CREATE INDEX "UserWordProgress_profileId_idx" ON "UserWordProgress"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "UserWordProgress_profileId_wordId_key" ON "UserWordProgress"("profileId", "wordId");

-- CreateIndex
CREATE INDEX "QuizSession_profileId_idx" ON "QuizSession"("profileId");

-- CreateIndex
CREATE INDEX "QuizAttempt_sessionId_idx" ON "QuizAttempt"("sessionId");

-- CreateIndex
CREATE INDEX "XpEvent_profileId_idx" ON "XpEvent"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "Streak_profileId_key" ON "Streak"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "Badge_code_key" ON "Badge"("code");

-- CreateIndex
CREATE INDEX "UserBadge_profileId_idx" ON "UserBadge"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "UserBadge_profileId_badgeId_key" ON "UserBadge"("profileId", "badgeId");

-- CreateIndex
CREATE UNIQUE INDEX "Mission_code_key" ON "Mission"("code");

-- CreateIndex
CREATE INDEX "UserMission_profileId_idx" ON "UserMission"("profileId");

-- CreateIndex
CREATE INDEX "Notification_profileId_idx" ON "Notification"("profileId");

-- CreateIndex
CREATE INDEX "AdminAuditLog_adminUserId_idx" ON "AdminAuditLog"("adminUserId");

-- CreateIndex
CREATE UNIQUE INDEX "FeatureFlag_key_key" ON "FeatureFlag"("key");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_eventName_idx" ON "AnalyticsEvent"("eventName");

-- CreateIndex
CREATE INDEX "SavedWord_profileId_idx" ON "SavedWord"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedWord_profileId_wordId_key" ON "SavedWord"("profileId", "wordId");
