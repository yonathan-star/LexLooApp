import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const DAILY_WORD_ID_KEY = "lexloo_notification_daily_word_id";
const STREAK_ID_KEY = "lexloo_notification_streak_id";
const PARENT_WEEKLY_ID_KEY = "lexloo_notification_parent_weekly_id";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function ensurePermission() {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

async function replaceScheduledNotification(storageKey: string, request: Notifications.NotificationRequestInput) {
  const existingId = await AsyncStorage.getItem(storageKey);
  if (existingId) {
    await Notifications.cancelScheduledNotificationAsync(existingId).catch(() => undefined);
  }
  const id = await Notifications.scheduleNotificationAsync(request);
  await AsyncStorage.setItem(storageKey, id);
  return id;
}

function dailyTrigger(hour: number, minute = 0): Notifications.CalendarTriggerInput {
  return { type: Notifications.SchedulableTriggerInputTypes.CALENDAR, hour, minute, repeats: true };
}

function weeklyTrigger(weekday: number, hour: number, minute = 0): Notifications.CalendarTriggerInput {
  return { type: Notifications.SchedulableTriggerInputTypes.CALENDAR, weekday, hour, minute, repeats: true };
}

export async function scheduleLearningReminders() {
  if (Platform.OS === "web") return false;
  const granted = await ensurePermission();
  if (!granted) return false;

  await replaceScheduledNotification(DAILY_WORD_ID_KEY, {
    content: {
      title: "Your LexLoo word is ready",
      body: "Scan a tile or practice your word of the day to keep the loop moving.",
      data: { route: "HomeTab", kind: "daily_word" },
    },
    trigger: dailyTrigger(9),
  });

  await replaceScheduledNotification(STREAK_ID_KEY, {
    content: {
      title: "Keep your LexLoo streak",
      body: "A quick scan or practice session keeps today's learning streak alive.",
      data: { route: "PracticeTab", kind: "streak" },
    },
    trigger: dailyTrigger(18),
  });

  return true;
}

export async function scheduleParentWeeklySummary() {
  if (Platform.OS === "web") return false;
  const granted = await ensurePermission();
  if (!granted) return false;

  await replaceScheduledNotification(PARENT_WEEKLY_ID_KEY, {
    content: {
      title: "LexLoo weekly family report",
      body: "Review words learned, streaks, badges, and suggested focus.",
      data: { route: "ParentDashboard", kind: "parent_weekly" },
    },
    trigger: weeklyTrigger(1, 8),
  });

  return true;
}

export async function cancelLearningReminders() {
  const ids = await AsyncStorage.multiGet([DAILY_WORD_ID_KEY, STREAK_ID_KEY, PARENT_WEEKLY_ID_KEY]);
  await Promise.all(ids.map(([, id]) => (id ? Notifications.cancelScheduledNotificationAsync(id).catch(() => undefined) : undefined)));
  await AsyncStorage.multiRemove([DAILY_WORD_ID_KEY, STREAK_ID_KEY, PARENT_WEEKLY_ID_KEY]);
}
