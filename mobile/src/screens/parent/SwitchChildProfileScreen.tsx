import { LexLooMark } from "../../components/LexLooMark";
import React, { useMemo } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useDeleteChildProfile, useParentChildren } from "../../api/queries";
import { EmptyState, ErrorState, LoadingState } from "../../components/StateViews";
import { fontFamily, fontSize, radius, shadow, spacing } from "../../theme";
import { useColors } from "../../context/ThemeContext";

export function SwitchChildProfileScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<any>();
  const children = useParentChildren();
  const deleteChild = useDeleteChildProfile();

  function confirmDelete(profileId: string, name: string) {
    Alert.alert(
      "Remove child profile",
      `This permanently deletes ${name}'s profile, progress, and badges. This can't be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () =>
            deleteChild.mutate(profileId, {
              onError: (error: any) => Alert.alert("Couldn't delete profile", error?.message ?? "Please try again."),
            }),
        },
      ]
    );
  }

  if (children.isLoading) return <LoadingState label="Loading child profiles..." />;
  if (children.isError) return <ErrorState message="We couldn't load child profiles." onRetry={() => children.refetch()} />;
  if (!children.data?.length) {
    return <EmptyState title="No child profiles" message="Add a child profile to review family progress." actionLabel="Add Child" onAction={() => navigation.navigate("AddChildProfile")} />;
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </Pressable>
          <LexLooMark />
          <View style={styles.pill}>
            <Text style={styles.pillText}>{children.data.length} Children</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Family</Text>
          <Text style={styles.title}>Switch Child</Text>
          <Text style={styles.subtitle}>Choose a child profile to review detailed learning progress and weekly reports.</Text>
        </View>

        <View style={styles.list}>
          {children.data.map((item, index) => {
            const profile = item.profile ?? item;
            const profileId = profile.id ?? item.profileId;
            const invite = item.invite;
            return (
              <Pressable key={profileId ?? index} style={styles.childCard} onPress={() => navigation.navigate("ParentChildDetail", { profileId })}>
                <View style={[styles.avatar, { backgroundColor: index % 2 === 0 ? colors.primaryWash : colors.orangeWash }]}>
                  <Text style={[styles.avatarText, { color: index % 2 === 0 ? colors.primary : colors.accentOrange }]}>{String(profile.name ?? "L").slice(0, 1).toUpperCase()}</Text>
                </View>
                <View style={styles.childMain}>
                  <Text style={styles.childName}>{profile.name ?? "Learner"}</Text>
                  <Text style={styles.childMeta}>{item.streak?.currentCount ?? 0} day streak · {(item.xp ?? 0).toLocaleString()} XP</Text>
                  {invite ? <Text style={styles.inviteMeta}>Invite pending · {invite.inviteCode}</Text> : null}
                </View>
                <Pressable
                  style={styles.deleteButton}
                  onPress={() => confirmDelete(profileId, profile.name ?? "this child")}
                  disabled={deleteChild.isPending}
                >
                  <Ionicons name="trash-outline" size={18} color={colors.accentOrangePressed} />
                </Pressable>
                <Ionicons name="chevron-forward" size={24} color={colors.textMuted} />
              </Pressable>
            );
          })}
        </View>

        <Pressable style={styles.addButton} onPress={() => navigation.navigate("AddChildProfile")}>
          <Ionicons name="add-circle-outline" size={18} color={colors.onPrimary} />
          <Text style={styles.addText}>Add Child Profile</Text>
        </Pressable>
        <Pressable style={styles.inviteButton} onPress={() => navigation.navigate("FamilyInvites")}>
          <Ionicons name="share-social-outline" size={18} color={colors.primary} />
          <Text style={styles.inviteButtonText}>Manage Invites</Text>
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
  logo: { color: colors.primary, fontFamily: fontFamily.display, fontSize: fontSize.display, lineHeight: 38 },
  pill: { backgroundColor: colors.orangeWash, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 8 },
  pillText: { color: colors.accentOrangePressed, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  hero: { borderRadius: 32, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, ...shadow.card },
  eyebrow: { color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 12, letterSpacing: 1.6, textTransform: "uppercase", marginBottom: spacing.sm },
  title: { color: colors.textPrimary, fontFamily: fontFamily.display, fontSize: fontSize.display, lineHeight: 38 },
  subtitle: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 15, lineHeight: 24, marginTop: spacing.sm },
  list: { gap: spacing.md },
  childCard: { minHeight: 82, borderRadius: 22, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, padding: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.md, ...shadow.card },
  avatar: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  avatarText: { fontFamily: fontFamily.display, fontSize: 20 },
  childMain: { flex: 1 },
  childName: { color: colors.textPrimary, fontFamily: fontFamily.headline, fontSize: fontSize.md },
  childMeta: { color: colors.textSecondary, fontFamily: fontFamily.mono, fontSize: 11, marginTop: 4 },
  inviteMeta: { color: colors.accentOrangePressed, fontFamily: fontFamily.bodyBold, fontSize: 11, marginTop: 4 },
  deleteButton: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: colors.orangeWash },
  addButton: { height: 58, borderRadius: radius.xl, backgroundColor: colors.primary, flexDirection: "row", gap: spacing.sm, alignItems: "center", justifyContent: "center" },
  addText: { color: colors.onPrimary, fontFamily: fontFamily.headline, fontSize: 15 },
  inviteButton: { height: 54, borderRadius: radius.xl, backgroundColor: colors.primaryWash, borderWidth: 1, borderColor: colors.borderStrong, flexDirection: "row", gap: spacing.sm, alignItems: "center", justifyContent: "center" },
  inviteButtonText: { color: colors.primary, fontFamily: fontFamily.headline, fontSize: 14 },
  });
}
