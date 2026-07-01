import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest, setToken } from "../api/client";
import { cancelLearningReminders } from "../lib/notifications";
import type { Profile, User } from "../types";

interface AuthState {
  user: User | null;
  profiles: Profile[];
  activeProfile: Profile | null;
  isLoading: boolean;
  isOnboarded: boolean;
  justOnboarded: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<{ mfaRequired: true; challengeId: string; deliveryTarget: string; devCode?: string }>;
  verifyLogin: (challengeId: string, code: string) => Promise<void>;
  register: (input: {
    email: string;
    password: string;
    displayName: string;
    role: "student" | "parent" | "adult_learner";
  }) => Promise<{ mfaRequired: true; challengeId: string; deliveryTarget: string; devCode?: string }>;
  verifyRegistration: (challengeId: string, code: string) => Promise<{ token: string; user: User; profiles: Profile[] }>;
  logout: () => Promise<void>;
  setActiveProfile: (profile: Profile) => void;
  refreshProfiles: () => Promise<void>;
  markOnboarded: () => void;
  clearJustOnboarded: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function profileIsOnboarded(profile?: Profile | null) {
  if (!profile) return false;
  if (profile.profileType === "parent") return true;
  return Boolean(profile.activeGoalId);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfile, setActiveProfileState] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [justOnboarded, setJustOnboarded] = useState(false);

  const bootstrap = useCallback(async () => {
    try {
      const me = await apiRequest<{ user: User; profiles: Profile[] }>("/auth/me");
      setUser(me.user);
      setProfiles(me.profiles);
      if (me.profiles.length > 0) setActiveProfileState(me.profiles[0]);
      setIsOnboarded(profileIsOnboarded(me.profiles[0]));
    } catch {
      // No valid session — that's fine, user lands on Welcome screen.
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const applySession = useCallback(async (result: { token: string; user: User; profiles: Profile[] }) => {
    await setToken(result.token);
    setUser(result.user);
    setProfiles(result.profiles);
    if (result.profiles.length > 0) {
      setActiveProfileState(result.profiles[0]);
      setIsOnboarded(profileIsOnboarded(result.profiles[0]));
    }
    return result;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    return apiRequest<{ mfaRequired: true; challengeId: string; deliveryTarget: string; devCode?: string }>("/auth/login", {
      method: "POST",
      body: { email, password },
      auth: false,
    });
  }, []);

  const verifyLogin = useCallback(async (challengeId: string, code: string) => {
    const result = await apiRequest<{ token: string; user: User; profiles: Profile[] }>("/auth/login/verify", {
      method: "POST",
      body: { challengeId, code },
      auth: false,
    });
    await applySession(result);
  }, [applySession]);

  const register = useCallback(
    async (input: { email: string; password: string; displayName: string; role: "student" | "parent" | "adult_learner" }) => {
      return apiRequest<{ mfaRequired: true; challengeId: string; deliveryTarget: string; devCode?: string }>("/auth/register", {
        method: "POST",
        body: input,
        auth: false,
      });
    },
    []
  );

  const verifyRegistration = useCallback(async (challengeId: string, code: string) => {
    const result = await apiRequest<{ token: string; user: User; profiles: Profile[] }>("/auth/register/verify", {
        method: "POST",
        body: { challengeId, code },
        auth: false,
      });
    return applySession(result);
  }, [applySession]);

  const logout = useCallback(async () => {
    await cancelLearningReminders();
    await setToken(null);
    setUser(null);
    setProfiles([]);
    setActiveProfileState(null);
    setIsOnboarded(false);
  }, []);

  const refreshProfiles = useCallback(async () => {
    const me = await apiRequest<{ user: User; profiles: Profile[] }>("/auth/me");
    setProfiles(me.profiles);
    const match = me.profiles.find((p) => p.id === activeProfile?.id) ?? me.profiles[0] ?? null;
    setActiveProfileState(match);
    setIsOnboarded(profileIsOnboarded(match));
  }, [activeProfile?.id]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profiles,
      activeProfile,
      isLoading,
      isOnboarded,
      login,
      verifyLogin,
      register,
      verifyRegistration,
      logout,
      setActiveProfile: setActiveProfileState,
      refreshProfiles,
      justOnboarded,
      markOnboarded: () => {
        setIsOnboarded(true);
        setJustOnboarded(true);
      },
      clearJustOnboarded: () => setJustOnboarded(false),
    }),
    [user, profiles, activeProfile, isLoading, isOnboarded, justOnboarded, login, verifyLogin, register, verifyRegistration, logout, refreshProfiles]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
