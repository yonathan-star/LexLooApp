import React from "react";
import { Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
;
import { useAuth } from "../context/AuthContext";
import { HomeScreen } from "../screens/home/HomeScreen";
import { ScannerScreen } from "../screens/scanner/ScannerScreen";
import { PracticeHubScreen } from "../screens/practice/PracticeHubScreen";
import { ProgressDashboardScreen } from "../screens/progress/ProgressDashboardScreen";
import { ParentDashboardScreen } from "../screens/parent/ParentDashboardScreen";
import { useColors } from "../context/ThemeContext";

const Tab = createBottomTabNavigator();

const ICONS: Record<string, string> = {
  HomeTab: "⌂",
  ScannerTab: "◇",
  PracticeTab: "●",
  ProgressTab: "◎",
  FamilyTab: "✦",
};

// Design System 3: Navigation — bottom tabs for Home, Scan, Practice,
// Progress/Profile. Scan is the central, most iconic action.
export function MainTabs() {
  const colors = useColors();
  const { user, activeProfile } = useAuth();
  const isParent = user?.role === "parent" || activeProfile?.profileType === "parent";

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.inverseText,
        tabBarStyle: {
          position: "absolute",
          left: 20,
          right: 20,
          bottom: 16,
          height: 68,
          borderRadius: 28,
          backgroundColor: colors.darkNav,
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.12)",
          paddingTop: 8,
          paddingBottom: 10,
        },
        tabBarLabelStyle: { fontSize: 11, fontFamily: "Sora_500Medium" },
        tabBarIcon: ({ color, focused }) => (
          <Text style={{ color, fontSize: focused ? 24 : 21, lineHeight: 25 }}>{ICONS[route.name]}</Text>
        ),
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: "Home" }} />
      <Tab.Screen name="ScannerTab" component={ScannerScreen} options={{ title: "Scan" }} />
      <Tab.Screen name="PracticeTab" component={PracticeHubScreen} options={{ title: "Practice" }} />
      {isParent ? <Tab.Screen name="FamilyTab" component={ParentDashboardScreen} options={{ title: "Family" }} /> : null}
      <Tab.Screen name="ProgressTab" component={ProgressDashboardScreen} options={{ title: isParent ? "Account" : "Progress" }} />
    </Tab.Navigator>
  );
}
