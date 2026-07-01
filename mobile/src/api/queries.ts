import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "./client";
import type { Badge, Mission, NotificationRecord, Profile, ProgressSummary, Streak, Word, WordPack } from "../types";

export function useSystemStatus() {
  return useQuery({
    queryKey: ["systemStatus"],
    queryFn: () =>
      apiRequest<{ status: "ok" | "maintenance"; minimumMobileVersion: string; updateUrl: string }>("/system/status", {
        auth: false,
      }),
    retry: 1,
  });
}

export function useUpdateProfile() {
  return useMutation({
    mutationFn: ({ profileId, ...body }: { profileId: string } & Partial<Profile>) =>
      apiRequest<Profile>(`/profiles/${profileId}`, { method: "PATCH", body }),
  });
}

export function useNotificationPreferences(profileId?: string) {
  return useQuery({
    queryKey: ["notifications", profileId],
    queryFn: () => apiRequest<NotificationRecord[]>(`/notifications?profileId=${profileId}`),
    enabled: Boolean(profileId),
  });
}

export function useSaveNotificationPreferences() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { profileId: string; dailyWord: boolean; streak: boolean; parentWeekly: boolean }) =>
      apiRequest<NotificationRecord[]>("/notifications/preferences", { method: "PUT", body }),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ["notifications", vars.profileId] });
    },
  });
}

export function useProgress(profileId?: string) {
  return useQuery({
    queryKey: ["progress", profileId],
    queryFn: () => apiRequest<ProgressSummary>(`/progress?profileId=${profileId}`),
    enabled: Boolean(profileId),
  });
}

export function useRecommendations(profileId?: string) {
  return useQuery({
    queryKey: ["recommendations", profileId],
    queryFn: () =>
      apiRequest<{
        wearOfDay: { word: Word; pack: string; reason: string } | null;
        wordOfDay: { word: Word; pack: string } | null;
      }>(`/progress/recommendations?profileId=${profileId}`),
    enabled: Boolean(profileId),
  });
}

export function useMissionsToday(profileId?: string) {
  return useQuery({
    queryKey: ["missions", "today", profileId],
    queryFn: () => apiRequest<Mission[]>(`/missions/today?profileId=${profileId}`),
    enabled: Boolean(profileId),
  });
}

export function usePacks() {
  return useQuery({
    queryKey: ["packs"],
    queryFn: () => apiRequest<WordPack[]>("/packs"),
  });
}

export function usePackDetail(packId?: string) {
  return useQuery({
    queryKey: ["pack", packId],
    queryFn: () => apiRequest<WordPack>(`/packs/${packId}`),
    enabled: Boolean(packId),
  });
}

export function useWord(wordId?: string, profileId?: string) {
  return useQuery({
    queryKey: ["word", wordId, profileId],
    queryFn: () => apiRequest<Word>(`/words/${wordId}${profileId ? `?profileId=${profileId}` : ""}`),
    enabled: Boolean(wordId),
  });
}

export function useWordProgress(wordId?: string, profileId?: string) {
  return useQuery({
    queryKey: ["wordProgress", wordId, profileId],
    queryFn: () => apiRequest<{ progress: { status: string; masteryScore: number } | null; isSaved: boolean }>(
      `/progress/word/${wordId}?profileId=${profileId}`
    ),
    enabled: Boolean(wordId && profileId),
  });
}

export function useSavedWords(profileId?: string) {
  return useQuery({
    queryKey: ["savedWords", profileId],
    queryFn: () => apiRequest<Word[]>(`/progress/saved-words?profileId=${profileId}`),
    enabled: Boolean(profileId),
  });
}

export function useToggleSaveWord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ profileId, wordId, save }: { profileId: string; wordId: string; save: boolean }) =>
      save
        ? apiRequest(`/progress/saved-words`, { method: "POST", body: { profileId, wordId } })
        : apiRequest(`/progress/saved-words/${wordId}?profileId=${profileId}`, { method: "PATCH" }),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ["savedWords", vars.profileId] });
      queryClient.invalidateQueries({ queryKey: ["wordProgress", vars.wordId, vars.profileId] });
      queryClient.invalidateQueries({ queryKey: ["progress", vars.profileId] });
      queryClient.invalidateQueries({ queryKey: ["badges", vars.profileId] });
      queryClient.invalidateQueries({ queryKey: ["missions", "today", vars.profileId] });
    },
  });
}

export function useMarkLearned() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: { profileId: string; wordId: string }) => apiRequest(`/progress/mark-learned`, { method: "POST", body: vars }),
    onSuccess: (_d, vars) => {
      queryClient.invalidateQueries({ queryKey: ["wordProgress", vars.wordId, vars.profileId] });
      queryClient.invalidateQueries({ queryKey: ["progress", vars.profileId] });
      queryClient.invalidateQueries({ queryKey: ["badges", vars.profileId] });
      queryClient.invalidateQueries({ queryKey: ["streak", vars.profileId] });
      queryClient.invalidateQueries({ queryKey: ["missions", "today", vars.profileId] });
      queryClient.invalidateQueries({ queryKey: ["xpLedger", vars.profileId] });
    },
  });
}

export function useBadges(profileId?: string) {
  return useQuery({
    queryKey: ["badges", profileId],
    queryFn: () => apiRequest<Badge[]>(`/badges${profileId ? `?profileId=${profileId}` : ""}`),
    enabled: true,
  });
}

export function useStreak(profileId?: string) {
  return useQuery({
    queryKey: ["streak", profileId],
    queryFn: () => apiRequest<Streak>(`/streaks?profileId=${profileId}`),
    enabled: Boolean(profileId),
  });
}

export function useXpLedger(profileId?: string) {
  return useQuery({
    queryKey: ["xpLedger", profileId],
    queryFn: () =>
      apiRequest<{ events: { id: string; eventType: string; points: number; createdAt: string }[]; total: number }>(
        `/xp?profileId=${profileId}`
      ),
    enabled: Boolean(profileId),
  });
}

export function useScanTile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: { profileId: string; code: string; source: "camera" | "manual" }) =>
      apiRequest<{
        word: Word | null;
        pack: WordPack | null;
        tile?: { id: string; tileCode: string; status: string } | null;
        reason?: "resolved" | "invalid_code" | "not_assigned";
        newBadges?: { code: string; name: string }[];
        message?: string;
      }>(
        "/scans",
        { method: "POST", body: vars }
      ),
    onSuccess: (_d, vars) => {
      queryClient.invalidateQueries({ queryKey: ["progress", vars.profileId] });
      queryClient.invalidateQueries({ queryKey: ["missions", "today", vars.profileId] });
      queryClient.invalidateQueries({ queryKey: ["streak", vars.profileId] });
      queryClient.invalidateQueries({ queryKey: ["xpLedger", vars.profileId] });
    },
  });
}

export function useStartPracticeSession() {
  return useMutation({
    mutationFn: (body: { profileId: string; activityType: "flashcard" | "multiple_choice" | "spelling" | "match" | "sentence_builder"; packId?: string; wordId?: string }) =>
      apiRequest<{ id: string; profileId: string; activityType: string; packId?: string | null; wordId?: string | null }>("/practice/sessions", {
        method: "POST",
        body,
      }),
  });
}

export function useQuizOptions(wordId?: string) {
  return useQuery({
    queryKey: ["quizOptions", wordId],
    queryFn: () =>
      apiRequest<{ prompt: string; correctWordId: string; options: { wordId: string; text: string }[] }>(
        `/practice/quiz-options/${wordId}`
      ),
    enabled: Boolean(wordId),
  });
}

export function useRecordPracticeAttempt() {
  return useMutation({
    mutationFn: ({
      sessionId,
      ...body
    }: {
      sessionId: string;
      wordId: string;
      promptType: string;
      answer: string;
      isCorrect: boolean;
      responseTimeMs?: number;
    }) => apiRequest(`/practice/sessions/${sessionId}/attempts`, { method: "POST", body }),
  });
}

export function useCompletePracticeSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sessionId, score, profileId }: { sessionId: string; score: number; profileId: string }) =>
      apiRequest<{ session: { id: string; score: number; xpAwarded: number }; newBadges: { code: string; name: string }[] }>(
        `/practice/sessions/${sessionId}/complete`,
        { method: "PATCH", body: { score } }
      ).then((result) => ({ ...result, profileId })),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["progress", result.profileId] });
      queryClient.invalidateQueries({ queryKey: ["missions", "today", result.profileId] });
      queryClient.invalidateQueries({ queryKey: ["badges", result.profileId] });
      queryClient.invalidateQueries({ queryKey: ["streak", result.profileId] });
      queryClient.invalidateQueries({ queryKey: ["xpLedger", result.profileId] });
    },
  });
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: () => apiRequest<{ deleted: boolean }>("/auth/me", { method: "DELETE" }),
  });
}

export function useLearningHistory(profileId?: string) {
  return useQuery({
    queryKey: ["history", profileId],
    queryFn: () => apiRequest<{ type: string; at: string; label: string }[]>(`/progress/history?profileId=${profileId}`),
    enabled: Boolean(profileId),
  });
}

export function useProgressByPack(profileId?: string) {
  return useQuery({
    queryKey: ["progressByPack", profileId],
    queryFn: () =>
      apiRequest<{ id: string; name: string; total: number; completed: number; percent: number }[]>(
        `/progress/by-pack?profileId=${profileId}`
      ),
    enabled: Boolean(profileId),
  });
}

export function useParentChildren() {
  return useQuery({
    queryKey: ["parentChildren"],
    queryFn: () => apiRequest<any[]>("/parents/children"),
  });
}

export function useFamilyInvites() {
  return useQuery({
    queryKey: ["familyInvites"],
    queryFn: () => apiRequest<any[]>("/family/invites"),
  });
}

export function useAddChildProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { name: string; ageRange?: string; gradeLevel?: string; email?: string; sendInvite?: boolean }) =>
      apiRequest<Profile & { invite?: { id: string; email?: string | null; inviteCode: string; status: string; deliveryStatus?: string } | null }>("/family/children", { method: "POST", body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parentChildren"] });
      queryClient.invalidateQueries({ queryKey: ["familyInvites"] });
    },
  });
}

export function useCreateFamilyInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { childProfileId: string; email?: string }) =>
      apiRequest<{ id: string; email?: string | null; inviteCode: string; status: string; child?: Profile; deliveryStatus?: string }>("/family/invites", { method: "POST", body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parentChildren"] });
      queryClient.invalidateQueries({ queryKey: ["familyInvites"] });
    },
  });
}

export function useDeleteChildProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (profileId: string) => apiRequest<{ deleted: boolean }>(`/family/children/${profileId}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parentChildren"] });
      queryClient.invalidateQueries({ queryKey: ["familyInvites"] });
    },
  });
}

export function useDeleteFamilyInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (inviteId: string) => apiRequest<{ deleted: boolean }>(`/family/invites/${inviteId}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["familyInvites"] });
      queryClient.invalidateQueries({ queryKey: ["parentChildren"] });
    },
  });
}

export function useParentChildDetail(profileId?: string) {
  return useQuery({
    queryKey: ["parentChildDetail", profileId],
    queryFn: () => apiRequest<any>(`/parents/children/${profileId}`),
    enabled: Boolean(profileId),
  });
}

export function useParentWeeklyReport(profileId?: string) {
  return useQuery({
    queryKey: ["parentWeeklyReport", profileId],
    queryFn: () => apiRequest<any>(`/parents/children/${profileId}/weekly-report`),
    enabled: Boolean(profileId),
  });
}
