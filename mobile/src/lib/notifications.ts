import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { Platform } from "react-native";

const DAILY_WORD_ID_KEY = "lexloo_notification_daily_word_id";
const STREAK_ID_KEY = "lexloo_notification_streak_id";
const PARENT_WEEKLY_ID_KEY = "lexloo_notification_parent_weekly_id";

type ExpoNotifications = typeof import("expo-notifications");
type NotificationRequestInput = Parameters<ExpoNotifications["scheduleNotificationAsync"]>[0];
type CalendarTriggerInput = Extract<NotificationRequestInput["trigger"], { type: unknown }>;

let notificationsModule: Promise<ExpoNotifications | null> | null = null;

async function getNotifications() {
  if (Platform.OS === "web") return null;
  if (Platform.OS === "android" && Constants.appOwnership === "expo") return null;
  notificationsModule ??= import("expo-notifications")
    .then((Notifications) => {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: false,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });
      return Notifications;
    })
    .catch(() => null);
  return notificationsModule;
}

async function ensurePermission() {
  const Notifications = await getNotifications();
  if (!Notifications) return false;
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

async function replaceScheduledNotification(storageKey: string, request: NotificationRequestInput) {
  const Notifications = await getNotifications();
  if (!Notifications) return null;
  const existingId = await AsyncStorage.getItem(storageKey);
  if (existingId) {
    await Notifications.cancelScheduledNotificationAsync(existingId).catch(() => undefined);
  }
  const id = await Notifications.scheduleNotificationAsync(request);
  await AsyncStorage.setItem(storageKey, id);
  return id;
}

async function dailyTrigger(hour: number, minute = 0): Promise<CalendarTriggerInput | null> {
  const Notifications = await getNotifications();
  if (!Notifications) return null;
  return { type: Notifications.SchedulableTriggerInputTypes.CALENDAR, hour, minute, repeats: true } as CalendarTriggerInput;
}

async function weeklyTrigger(weekday: number, hour: number, minute = 0): Promise<CalendarTriggerInput | null> {
  const Notifications = await getNotifications();
  if (!Notifications) return null;
  return { type: Notifications.SchedulableTriggerInputTypes.CALENDAR, weekday, hour, minute, repeats: true } as CalendarTriggerInput;
}

export async function scheduleLearningReminders() {
  if (Platform.OS === "web") return false;
  const granted = await ensurePermission();
  if (!granted) return false;
  const daily = await dailyTrigger(9);
  const evening = await dailyTrigger(18);
  if (!daily || !evening) return false;

  await replaceScheduledNotification(DAILY_WORD_ID_KEY, {
    content: {
      title: "Your LexLoo word is ready",
      body: "Your daily word takes less than a minute.",
      data: { route: "HomeTab", kind: "daily_word" },
    },
    trigger: daily,
  });

  await replaceScheduledNotification(STREAK_ID_KEY, {
    content: {
      title: "Keep your LexLoo streak",
      body: "A quick practice session keeps today's learning streak alive.",
      data: { route: "PracticeHub", kind: "streak" },
    },
    trigger: evening,
  });

  return true;
}

export async function scheduleParentWeeklySummary() {
  if (Platform.OS === "web") return false;
  const granted = await ensurePermission();
  if (!granted) return false;
  const trigger = await weeklyTrigger(1, 8);
  if (!trigger) return false;

  await replaceScheduledNotification(PARENT_WEEKLY_ID_KEY, {
    content: {
      title: "LexLoo weekly family report",
      body: "Review words learned, streaks, badges, and suggested focus.",
      data: { route: "ParentDashboard", kind: "parent_weekly" },
    },
    trigger,
  });

  return true;
}

export async function cancelLearningReminders() {
  const Notifications = await getNotifications();
  const ids = await AsyncStorage.multiGet([DAILY_WORD_ID_KEY, STREAK_ID_KEY, PARENT_WEEKLY_ID_KEY]);
  if (Notifications) {
    await Promise.all(ids.map(([, id]) => (id ? Notifications.cancelScheduledNotificationAsync(id).catch(() => undefined) : undefined)));
  }
  await AsyncStorage.multiRemove([DAILY_WORD_ID_KEY, STREAK_ID_KEY, PARENT_WEEKLY_ID_KEY]);
}
