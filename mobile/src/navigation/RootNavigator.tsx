import React, { useEffect, useRef } from "react";
import Constants from "expo-constants";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { useSystemStatus } from "../api/queries";
;
import { trackScreenEvent } from "../lib/analytics";
import { SplashScreen } from "../screens/onboarding/SplashScreen";
import { AuthStack } from "./AuthStack";
import { OnboardingStack } from "./OnboardingStack";
import { MainTabs } from "./MainTabs";

import { ManualCodeEntryScreen } from "../screens/scanner/ManualCodeEntryScreen";
import { WordDetailScreen } from "../screens/word/WordDetailScreen";
import { PracticeHubScreen } from "../screens/practice/PracticeHubScreen";
import { PracticeSetupScreen } from "../screens/practice/PracticeSetupScreen";
import { PracticeSessionScreen } from "../screens/practice/PracticeSessionScreen";
import { PracticeResultsScreen } from "../screens/practice/PracticeResultsScreen";
import { SentenceBuilderScreen } from "../screens/practice/SentenceBuilderScreen";
import { ProgressByPackScreen } from "../screens/progress/ProgressByPackScreen";
import { LearningHistoryScreen } from "../screens/progress/LearningHistoryScreen";
import { SavedWordsScreen } from "../screens/progress/SavedWordsScreen";
import { AchievementsScreen } from "../screens/progress/AchievementsScreen";
import { LevelsScreen } from "../screens/progress/LevelsScreen";
import { XpLedgerScreen } from "../screens/progress/XpLedgerScreen";
import { StreakScreen } from "../screens/progress/StreakScreen";
import { ProfileScreen } from "../screens/profile/ProfileScreen";
import { AskLexScreen } from "../screens/lex/AskLexScreen";
import { EditProfileScreen } from "../screens/profile/EditProfileScreen";
import { SettingsScreen } from "../screens/profile/SettingsScreen";
import { NotificationsSettingsScreen } from "../screens/profile/NotificationsSettingsScreen";
import { HelpCenterScreen } from "../screens/profile/HelpCenterScreen";
import { PackLibraryScreen } from "../screens/packs/PackLibraryScreen";
import { PackDetailScreen } from "../screens/packs/PackDetailScreen";
import { TileNotOwnedScreen } from "../screens/packs/TileNotOwnedScreen";
import { ParentDashboardScreen } from "../screens/parent/ParentDashboardScreen";
import { ParentChildDetailScreen } from "../screens/parent/ParentChildDetailScreen";
import { ParentWeeklyReportScreen } from "../screens/parent/ParentWeeklyReportScreen";
import { AddChildProfileScreen } from "../screens/parent/AddChildProfileScreen";
import { SwitchChildProfileScreen } from "../screens/parent/SwitchChildProfileScreen";
import { FamilyInvitesScreen } from "../screens/parent/FamilyInvitesScreen";
import { PrivacyConsentScreen } from "../screens/common/PrivacyConsentScreen";
import { TermsAcceptanceScreen } from "../screens/common/TermsAcceptanceScreen";
import { FeatureComingSoonScreen } from "../screens/common/FeatureComingSoonScreen";
import { AppUpdateRequiredScreen } from "../screens/common/AppUpdateRequiredScreen";
import { MaintenanceModeScreen } from "../screens/common/MaintenanceModeScreen";
import { DeleteAccountScreen } from "../screens/common/DeleteAccountScreen";
import { useColors } from "../context/ThemeContext";

const Stack = createNativeStackNavigator();

function MaintenanceRouteScreen() {
  const colors = useColors();
  return <MaintenanceModeScreen onRetry={() => undefined} />;
}

function compareVersions(left: string, right: string) {
  const leftParts = left.split(".").map((part) => Number(part) || 0);
  const rightParts = right.split(".").map((part) => Number(part) || 0);
  for (let index = 0; index < Math.max(leftParts.length, rightParts.length); index += 1) {
    const diff = (leftParts[index] ?? 0) - (rightParts[index] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

function SharedScreens({ colors }: { colors: ReturnType<typeof useColors> }) {
  const sharedScreenOptions = {
    headerShown: false,
  };
  return (
    <Stack.Group screenOptions={sharedScreenOptions}>
      {SharedScreenList()}
    </Stack.Group>
  );
}

function SharedScreenList() {
  return (
    <>
      <Stack.Screen name="ManualCodeEntry" component={ManualCodeEntryScreen} options={{ title: "Enter Code" }} />
      <Stack.Screen name="WordDetail" component={WordDetailScreen} options={{ title: "" }} />
      <Stack.Screen name="PracticeHub" component={PracticeHubScreen} options={{ title: "Practice" }} />
      <Stack.Screen name="PracticeSetup" component={PracticeSetupScreen} options={{ title: "Practice Setup" }} />
      <Stack.Screen name="PracticeSession" component={PracticeSessionScreen} options={{ title: "Practice" }} />
      <Stack.Screen name="PracticeResults" component={PracticeResultsScreen} options={{ title: "Results", headerBackVisible: false }} />
      <Stack.Screen name="SentenceBuilder" component={SentenceBuilderScreen} options={{ title: "Sentence Builder" }} />
      <Stack.Screen name="ProgressByPack" component={ProgressByPackScreen} options={{ title: "Progress by Pack" }} />
      <Stack.Screen name="LearningHistory" component={LearningHistoryScreen} options={{ title: "History" }} />
      <Stack.Screen name="SavedWords" component={SavedWordsScreen} options={{ title: "Saved Words" }} />
      <Stack.Screen name="Achievements" component={AchievementsScreen} options={{ title: "Achievements" }} />
      <Stack.Screen name="Levels" component={LevelsScreen} options={{ title: "Levels" }} />
      <Stack.Screen name="XpLedger" component={XpLedgerScreen} options={{ title: "XP Ledger" }} />
      <Stack.Screen name="Streak" component={StreakScreen} options={{ title: "Streak" }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: "Profile" }} />
      <Stack.Screen name="AskLex" component={AskLexScreen} options={{ title: "Ask Lex" }} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: "Edit Profile" }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: "Settings" }} />
      <Stack.Screen name="NotificationsSettings" component={NotificationsSettingsScreen} options={{ title: "Notifications" }} />
      <Stack.Screen name="HelpCenter" component={HelpCenterScreen} options={{ title: "Help" }} />
      <Stack.Screen name="PackLibrary" component={PackLibraryScreen} options={{ title: "Packs" }} />
      <Stack.Screen name="PackDetail" component={PackDetailScreen} options={{ title: "" }} />
      <Stack.Screen name="TileNotOwned" component={TileNotOwnedScreen} options={{ title: "" }} />
      <Stack.Screen name="ParentDashboard" component={ParentDashboardScreen} options={{ title: "Family" }} />
      <Stack.Screen name="ParentChildDetail" component={ParentChildDetailScreen} options={{ title: "" }} />
      <Stack.Screen name="ParentWeeklyReport" component={ParentWeeklyReportScreen} options={{ title: "Weekly Report" }} />
      <Stack.Screen name="AddChildProfile" component={AddChildProfileScreen} options={{ title: "Add Child" }} />
      <Stack.Screen name="SwitchChildProfile" component={SwitchChildProfileScreen} options={{ title: "Switch Profile" }} />
      <Stack.Screen name="FamilyInvites" component={FamilyInvitesScreen} options={{ title: "Invites" }} />
      <Stack.Screen name="PrivacyConsent" component={PrivacyConsentScreen} options={{ title: "Privacy" }} />
      <Stack.Screen name="TermsAcceptance" component={TermsAcceptanceScreen} options={{ title: "Terms" }} />
      <Stack.Screen name="DeleteAccount" component={DeleteAccountScreen} options={{ title: "Delete Account" }} />
      <Stack.Screen name="AppUpdateRequired" component={AppUpdateRequiredScreen} options={{ title: "" }} />
      <Stack.Screen name="MaintenanceMode" component={MaintenanceRouteScreen} options={{ title: "" }} />
      <Stack.Screen name="FeatureComingSoon" component={FeatureComingSoonScreen} options={{ title: "" }} />
    </>
  );
}

export function RootNavigator() {
  const colors = useColors();
  const { isLoading, user, activeProfile, isOnboarded } = useAuth();
  const systemStatus = useSystemStatus();
  const navigationRef = useNavigationContainerRef();
  const routeNameRef = useRef<string | undefined>(undefined);
  const appOpenTrackedRef = useRef(false);
  const appVersion = Constants.expoConfig?.version ?? "1.0.0";
  const status = systemStatus.data;
  const requiresUpdate = status?.minimumMobileVersion ? compareVersions(appVersion, status.minimumMobileVersion) < 0 : false;

  useEffect(() => {
    if (isLoading || !user || appOpenTrackedRef.current) return;
    appOpenTrackedRef.current = true;
    trackScreenEvent("app_open", { appVersion }, activeProfile?.id);
  }, [activeProfile?.id, appVersion, isLoading, user]);

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        const routeName = navigationRef.getCurrentRoute()?.name;
        routeNameRef.current = routeName;
        if (routeName) trackScreenEvent("screen_view", { screenName: routeName }, activeProfile?.id);
      }}
      onStateChange={() => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.getCurrentRoute()?.name;
        if (currentRouteName && previousRouteName !== currentRouteName) {
          routeNameRef.current = currentRouteName;
          trackScreenEvent("screen_view", { screenName: currentRouteName }, activeProfile?.id);
        }
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {systemStatus.isLoading || isLoading ? (
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : status?.status === "maintenance" ? (
          <Stack.Screen name="MaintenanceMode" component={MaintenanceRouteScreen} />
        ) : requiresUpdate ? (
          <Stack.Screen name="AppUpdateRequired" component={AppUpdateRequiredScreen} />
        ) : !user ? (
          <Stack.Screen name="Auth" component={AuthStack} />
        ) : !isOnboarded ? (
          <Stack.Screen name="Onboarding" component={OnboardingStack} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            {SharedScreens({ colors })}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
