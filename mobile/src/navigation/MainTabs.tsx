import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { HomeScreen } from "../screens/home/HomeScreen";
import { ScannerScreen } from "../screens/scanner/ScannerScreen";
import { ProgressDashboardScreen } from "../screens/progress/ProgressDashboardScreen";
import { ProfileScreen } from "../screens/profile/ProfileScreen";
import { LexCoachScreen } from "../screens/lex/LexCoachScreen";
import { haptics } from "../lib/haptics";
import { fontFamily, radius, shadow, spacing } from "../theme";
import { useColors } from "../context/ThemeContext";

const Tab = createBottomTabNavigator();

const TAB_META: Record<string, { label: string; icon: keyof typeof Ionicons.glyphMap; activeIcon: keyof typeof Ionicons.glyphMap }> = {
  HomeTab: { label: "Home", icon: "home-outline", activeIcon: "home" },
  ScannerTab: { label: "Scan", icon: "scan-outline", activeIcon: "scan" },
  LexTab: { label: "Lex", icon: "sparkles-outline", activeIcon: "sparkles" },
  LexWorldTab: { label: "LexWorld", icon: "planet-outline", activeIcon: "planet" },
  MeTab: { label: "Me", icon: "person-circle-outline", activeIcon: "person-circle" },
};

export function MainTabs() {
  return (
    <Tab.Navigator tabBar={(props) => <SlidingTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="HomeTab" component={HomeScreen} />
      <Tab.Screen name="ScannerTab" component={ScannerScreen} />
      <Tab.Screen name="LexTab" component={LexCoachScreen} />
      <Tab.Screen name="LexWorldTab" component={ProgressDashboardScreen} />
      <Tab.Screen name="MeTab" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function SlidingTabBar({ state, navigation }: any) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.shell}>
      {state.routes.map((route: any, index: number) => {
        const focused = state.index === index;
        const meta = TAB_META[route.name];
        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={focused ? { selected: true } : {}}
            style={[styles.item, focused && styles.itemActive]}
            onPress={() => {
              haptics.tap();
              const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
              if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
            }}
          >
            <View style={[styles.iconBubble, focused && styles.iconBubbleActive]}>
              <Ionicons name={focused ? meta.activeIcon : meta.icon} size={focused ? 25 : 22} color={focused ? colors.white : colors.textMuted} />
            </View>
            <Text style={[styles.label, focused && styles.labelActive]} numberOfLines={1} adjustsFontSizeToFit>
              {meta.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    shell: {
      position: "absolute",
      left: 14,
      right: 14,
      bottom: 14,
      minHeight: 76,
      borderRadius: 28,
      backgroundColor: colors.darkNav,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.12)",
      paddingHorizontal: 8,
      paddingVertical: 8,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      ...shadow.card,
    },
    item: {
      flex: 1,
      minWidth: 0,
      height: 60,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
      gap: 3,
      paddingHorizontal: 2,
    },
    itemActive: {
      backgroundColor: colors.primary,
    },
    iconBubble: {
      width: 30,
      height: 30,
      borderRadius: radius.pill,
      alignItems: "center",
      justifyContent: "center",
    },
    iconBubbleActive: {
      backgroundColor: "rgba(255,255,255,0.16)",
    },
    label: {
      color: colors.textMuted,
      fontFamily: fontFamily.bodyBold,
      fontSize: 10,
    },
    labelActive: {
      color: colors.white,
      fontSize: 11,
    },
  });
}
