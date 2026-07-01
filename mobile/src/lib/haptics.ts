import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

// Thin wrapper so screens reach for one of these instead of raw expo-haptics
// calls everywhere — keeps the "feel" of correct/incorrect/tap consistent
// app-wide, and gives one place to silence haptics on web (unsupported).
const enabled = Platform.OS !== "web";

export const haptics = {
  tap() {
    if (enabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },
  select() {
    if (enabled) Haptics.selectionAsync();
  },
  success() {
    if (enabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  },
  warning() {
    if (enabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  },
  error() {
    if (enabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  },
  celebrate() {
    if (!enabled) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 150);
  },
};
