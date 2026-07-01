export interface User {
  id: string;
  email: string;
  displayName: string;
  role: "student" | "parent" | "adult_learner" | "admin";
}

export interface Profile {
  id: string;
  userId: string;
  profileType: string;
  name: string;
  ageRange?: string | null;
  gradeLevel?: string | null;
  avatar?: string | null;
  activeGoalId?: string | null;
}

export interface WordContent {
  shortDefinition: string;
  longDefinition?: string | null;
  phonetic?: string | null;
  origin?: string | null;
  funFact?: string | null;
  audioUrl?: string | null;
}

export interface WordTranslation {
  translation: string;
  transliteration?: string | null;
  exampleTranslation?: string | null;
  targetLanguage?: { code: string; name: string };
}

export interface WordExample {
  exampleText: string;
  level?: string | null;
}

export interface Word {
  id: string;
  text: string;
  partOfSpeech?: string | null;
  difficultyScore: number;
  gradeLevel?: string | null;
  content?: WordContent | null;
  translations?: WordTranslation[];
  examples?: WordExample[];
  relationsA?: { relationType: string; relatedWord: Word }[];
}

export interface WordPack {
  id: string;
  name: string;
  slug: string;
  level?: string | null;
  category?: string | null;
  description?: string | null;
  status: string;
  packWords?: { word: Word; displayOrder: number }[];
}

export interface Streak {
  currentCount: number;
  longestCount: number;
  lastActiveDate: string | null;
}

export interface LevelInfo {
  current: string;
  next: string | null;
  nextXp: number | null;
}

export interface ProgressSummary {
  scannedCount: number;
  learnedCount: number;
  masteredCount: number;
  savedCount: number;
  xp: number;
  level: LevelInfo;
  streak: Streak | null;
}

export interface Mission {
  id: string;
  code: string;
  title: string;
  xpReward: number;
  current: number;
  target: number;
  completed: boolean;
}

export interface Badge {
  id: string;
  code: string;
  name: string;
  description: string;
  iconUrl?: string | null;
  earned?: boolean;
  earnedAt?: string | null;
}

export interface NotificationRecord {
  id: string;
  profileId: string;
  type: "daily_word" | "streak" | "parent_weekly";
  scheduledFor?: string | null;
  sentAt?: string | null;
  status: "scheduled" | "sent" | "cancelled";
  payloadJson: string;
}
