import { LexLooMark } from "../../components/LexLooMark";
import React, { useState, useMemo } from "react";
import { ActionSheetIOS, Alert, Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../context/AuthContext";
import { useProgress, useUpdateProfile } from "../../api/queries";
import { API_URL, uploadFile } from "../../api/client";
import { TextField } from "../../components/TextField";
import { fontFamily, fontSize, glow, radius, shadow, spacing } from "../../theme";
import { useColors } from "../../context/ThemeContext";

export function EditProfileScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<any>();
  const { activeProfile, user, refreshProfiles } = useAuth();
  const progress = useProgress(activeProfile?.id);
  const updateProfile = useUpdateProfile();
  const [name, setName] = useState(activeProfile?.name ?? "");
  const rawAvatar = activeProfile?.avatar ?? null;
  const [avatarUri, setAvatarUri] = useState<string | null>(
    rawAvatar ? (rawAvatar.startsWith("http") ? rawAvatar : `${API_URL}${rawAvatar}`) : null
  );
  const [uploading, setUploading] = useState(false);

  async function pickFromLibrary() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Allow LexLoo to access your photo library in Settings.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      await uploadAvatar(result.assets[0].uri);
    }
  }

  async function pickFromCamera() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Allow LexLoo to access your camera in Settings.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      await uploadAvatar(result.assets[0].uri);
    }
  }

  async function uploadAvatar(uri: string) {
    if (!activeProfile?.id) return;
    setUploading(true);
    try {
      const filename = uri.split("/").pop() ?? "avatar.jpg";
      const ext = filename.split(".").pop()?.toLowerCase() ?? "jpg";
      const type = ext === "png" ? "image/png" : "image/jpeg";
      const { url } = await uploadFile<{ url: string }>("/uploads/avatar", { uri, name: filename, type });
      await updateProfile.mutateAsync({ profileId: activeProfile.id, avatar: url });
      await refreshProfiles();
      setAvatarUri(url.startsWith("http") ? url : `${API_URL}${url}`);
    } catch (e: any) {
      Alert.alert("Upload failed", e?.message ?? "Something went wrong. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function promptPhotoSource() {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        { options: ["Cancel", "Take Photo", "Choose from Library"], cancelButtonIndex: 0 },
        (index) => {
          if (index === 1) pickFromCamera();
          if (index === 2) pickFromLibrary();
        }
      );
    } else {
      Alert.alert("Profile Photo", "Choose a source", [
        { text: "Camera", onPress: pickFromCamera },
        { text: "Photo Library", onPress: pickFromLibrary },
        { text: "Cancel", style: "cancel" },
      ]);
    }
  }

  async function save() {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert("Name required", "Please enter a name.");
      return;
    }
    if (!activeProfile?.id) return;
    await updateProfile.mutateAsync({ profileId: activeProfile.id, name: trimmed });
    await refreshProfiles();
    navigation.goBack();
  }

  const initials = (activeProfile?.name ?? "L").slice(0, 1).toUpperCase();

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </Pressable>
          <LexLooMark />
          <View style={styles.pill}>
            <Text style={styles.pillText}>
              {progress.data?.streak?.currentCount ?? 0} Streak · {(progress.data?.xp ?? 0).toLocaleString()} XP
            </Text>
          </View>
        </View>

        <View style={styles.heroCard}>
          {/* Tappable avatar */}
          <Pressable style={styles.avatarWrap} onPress={promptPhotoSource} disabled={uploading}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitials}>{initials}</Text>
              </View>
            )}
            <View style={styles.cameraChip}>
              {uploading
                ? <Ionicons name="hourglass-outline" size={14} color={colors.onPrimary} />
                : <Ionicons name="camera" size={14} color={colors.onPrimary} />
              }
            </View>
          </Pressable>
          <Text style={styles.heroName}>{activeProfile?.name ?? "LexLoo Learner"}</Text>
          <Text style={styles.heroLevel}>{progress.data?.level.current ?? "Explorer"}</Text>
          <Text style={styles.photoHint}>{uploading ? "Uploading…" : "Tap photo to change"}</Text>
        </View>

        <View style={styles.fieldCard}>
          <TextField label="Name" value={name} onChangeText={setName} placeholder="Enter your name" autoCapitalize="words" />
        </View>

        <View style={styles.fieldCard}>
          <Text style={styles.fieldLabel}>EMAIL ADDRESS</Text>
          <Text style={styles.readonlyValue}>{user?.email ?? "—"}</Text>
          <Text style={styles.readonlyHint}>Contact support to change your account email.</Text>
        </View>

        <View style={styles.actionsRow}>
          <Pressable style={styles.resetButton} onPress={() => setName(activeProfile?.name ?? "")}>
            <Text style={styles.resetText}>Reset</Text>
          </Pressable>
          <Pressable style={styles.saveButton} onPress={save} disabled={updateProfile.isPending || uploading}>
            <Text style={styles.saveText}>{updateProfile.isPending ? "Saving…" : "Save Changes"}</Text>
          </Pressable>
        </View>

        <Pressable style={styles.deactivateButton} onPress={() => navigation.navigate("DeleteAccount")}>
          <Text style={styles.deactivateText}>Deactivate My Account</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({

  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.safeMargin, paddingTop: spacing.md, paddingBottom: 132, gap: spacing.lg },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  pill: { backgroundColor: colors.orangeWash, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 8 },
  pillText: { color: colors.accentOrangePressed, fontFamily: fontFamily.bodyBold, fontSize: 11 },

  heroCard: { alignItems: "center", borderRadius: 28, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, ...shadow.card, gap: 4 },
  avatarWrap: { position: "relative", marginBottom: spacing.sm },
  avatarImage: { width: 96, height: 96, borderRadius: 48, borderWidth: 3, borderColor: colors.white },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primaryWash,
    borderWidth: 3,
    borderColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    ...glow.primary,
  },
  avatarInitials: { color: colors.primary, fontFamily: fontFamily.display, fontSize: 36 },
  cameraChip: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.white,
  },
  heroName: { color: colors.textPrimary, fontFamily: fontFamily.headline, fontSize: fontSize.lg },
  heroLevel: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 14 },
  photoHint: { color: colors.textMuted, fontFamily: fontFamily.body, fontSize: 12, marginTop: 2 },

  fieldCard: { borderRadius: 24, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, ...shadow.card },
  fieldLabel: { color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 12, letterSpacing: 1.4, marginBottom: spacing.sm },
  readonlyValue: { color: colors.textPrimary, fontFamily: fontFamily.body, fontSize: 16 },
  readonlyHint: { color: colors.textMuted, fontFamily: fontFamily.body, fontSize: 12, marginTop: spacing.xs },

  actionsRow: { flexDirection: "row", gap: spacing.md },
  resetButton: { flex: 1, height: 56, borderRadius: radius.xl, backgroundColor: colors.cardHighest, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
  resetText: { color: colors.textPrimary, fontFamily: fontFamily.bodyBold, fontSize: 14 },
  saveButton: { flex: 2, height: 56, borderRadius: radius.xl, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", ...glow.primary },
  saveText: { color: colors.onPrimary, fontFamily: fontFamily.headline, fontSize: 15 },

  deactivateButton: { alignItems: "center", paddingVertical: spacing.sm },
  deactivateText: { color: colors.error, fontFamily: fontFamily.bodyBold, fontSize: 13 },
  });
}
