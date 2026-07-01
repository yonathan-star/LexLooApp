import React, { useState, useMemo } from "react";
import { Alert, Linking, Pressable, ScrollView, Share, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../../components/Button";
import { LexLooMark } from "../../components/LexLooMark";
import { TextField } from "../../components/TextField";
import { ErrorState, LoadingState } from "../../components/StateViews";
import { useAuth } from "../../context/AuthContext";
import { useCreateFamilyInvite, useDeleteFamilyInvite, useFamilyInvites } from "../../api/queries";
import { fontFamily, fontSize, radius, shadow, spacing } from "../../theme";
import { useColors } from "../../context/ThemeContext";

function inviteMessage(code: string) {
  return `Join my LexLoo family with invite code ${code}.`;
}

export function FamilyInvitesScreen() {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation<any>();
  const { activeProfile } = useAuth();
  const invites = useFamilyInvites();
  const createInvite = useCreateFamilyInvite();
  const deleteInvite = useDeleteFamilyInvite();
  const [email, setEmail] = useState("");
  const [latest, setLatest] = useState<{ id?: string; inviteCode: string; email?: string | null; deliveryStatus?: string } | null>(null);

  function confirmDelete(inviteId: string) {
    Alert.alert("Delete invite", "This invite code will stop working. This can't be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          if (latest?.id === inviteId) setLatest(null);
          deleteInvite.mutate(inviteId, {
            onError: (error: any) => Alert.alert("Couldn't delete invite", error?.message ?? "Please try again."),
          });
        },
      },
    ]);
  }

  async function create() {
    if (!activeProfile?.id) return;
    try {
      const invite = await createInvite.mutateAsync({
        childProfileId: activeProfile.id,
        email: email.trim().toLowerCase() || undefined,
      });
      setLatest(invite);
      if (invite.email && invite.deliveryStatus !== "sent") {
        Alert.alert("Invite created", `Code: ${invite.inviteCode}\nEmail delivery is not configured here, so use Share or Email below.`);
      } else {
        Alert.alert("Invite created", `Code: ${invite.inviteCode}`);
      }
    } catch (error: any) {
      Alert.alert("Couldn't create invite", error?.message ?? "Please try again.");
    }
  }

  async function share(code: string) {
    await Share.share({ message: inviteMessage(code) });
  }

  async function emailInvite(code: string, to?: string | null) {
    const subject = encodeURIComponent("Join my LexLoo family");
    const body = encodeURIComponent(inviteMessage(code));
    const target = to ? encodeURIComponent(to) : "";
    await Linking.openURL(`mailto:${target}?subject=${subject}&body=${body}`);
  }

  if (invites.isLoading) return <LoadingState label="Loading invites..." />;
  if (invites.isError) return <ErrorState message="We couldn't load invites." onRetry={() => invites.refetch()} />;

  const pending = (invites.data ?? []).filter((invite) => invite.status === "pending");

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </Pressable>
          <LexLooMark size={22} />
          <View style={styles.backButton} />
        </View>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>Family</Text>
          <Text style={styles.title}>Share LexLoo invites.</Text>
          <Text style={styles.subtitle}>Create an invite code for your account or family. Email is optional; the code can always be shared manually.</Text>
        </View>

        <View style={styles.card}>
          <TextField label="Email (optional)" value={email} onChangeText={setEmail} placeholder="person@example.com" autoCapitalize="none" keyboardType="email-address" />
          <Button label="Create Invite" onPress={create} loading={createInvite.isPending} />
          {latest ? (
            <View style={styles.latestCard}>
              <Text style={styles.latestLabel}>Latest invite</Text>
              <Text style={styles.latestCode}>{latest.inviteCode}</Text>
              <Text style={styles.latestMeta}>{latest.email || "Manual share"} · {latest.deliveryStatus ?? "created"}</Text>
              <View style={styles.actionRow}>
                <Pressable style={styles.actionButton} onPress={() => share(latest.inviteCode)}>
                  <Ionicons name="share-outline" size={16} color={colors.primary} />
                  <Text style={styles.actionText}>Share</Text>
                </Pressable>
                <Pressable style={styles.actionButton} onPress={() => emailInvite(latest.inviteCode, latest.email)}>
                  <Ionicons name="mail-outline" size={16} color={colors.primary} />
                  <Text style={styles.actionText}>Email</Text>
                </Pressable>
                {latest.id ? (
                  <Pressable style={styles.deleteActionButton} onPress={() => confirmDelete(latest.id!)}>
                    <Ionicons name="trash-outline" size={16} color={colors.accentOrangePressed} />
                  </Pressable>
                ) : null}
              </View>
            </View>
          ) : null}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pending Invites</Text>
          <Text style={styles.count}>{pending.length}</Text>
        </View>

        <View style={styles.list}>
          {pending.map((invite) => (
            <View key={invite.id} style={styles.inviteCard}>
              <View style={styles.inviteMain}>
                <Text style={styles.inviteTitle}>{invite.child?.name ?? "LexLoo invite"}</Text>
                <Text style={styles.inviteMeta}>{invite.email || "Manual invite"} · {invite.inviteCode}</Text>
              </View>
              <Pressable style={styles.iconButton} onPress={() => share(invite.inviteCode)}>
                <Ionicons name="share-outline" size={18} color={colors.primary} />
              </Pressable>
              <Pressable style={styles.iconButton} onPress={() => emailInvite(invite.inviteCode, invite.email)}>
                <Ionicons name="mail-outline" size={18} color={colors.primary} />
              </Pressable>
              <Pressable style={styles.deleteIconButton} onPress={() => confirmDelete(invite.id)} disabled={deleteInvite.isPending}>
                <Ionicons name="trash-outline" size={18} color={colors.accentOrangePressed} />
              </Pressable>
            </View>
          ))}
          {!pending.length ? <Text style={styles.emptyText}>No pending invites yet.</Text> : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({

  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.safeMargin, paddingTop: spacing.md, paddingBottom: 132, gap: spacing.md },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  hero: { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 28, padding: spacing.lg, ...shadow.card },
  eyebrow: { color: colors.accentOrange, fontFamily: fontFamily.bodyBold, fontSize: 12, letterSpacing: 1.4, textTransform: "uppercase" },
  title: { color: colors.textPrimary, fontFamily: fontFamily.display, fontSize: fontSize.xxl, lineHeight: 40, marginTop: spacing.sm },
  subtitle: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 15, lineHeight: 24, marginTop: spacing.sm },
  card: { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 24, padding: spacing.lg, ...shadow.card },
  latestCard: { marginTop: spacing.md, borderRadius: 18, borderWidth: 1, borderColor: colors.borderStrong, backgroundColor: colors.cardHighest, padding: spacing.md },
  latestLabel: { color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  latestCode: { color: colors.textPrimary, fontFamily: fontFamily.display, fontSize: fontSize.xl, marginTop: 4 },
  latestMeta: { color: colors.textSecondary, fontFamily: fontFamily.mono, fontSize: 11, marginTop: 4 },
  actionRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md },
  actionButton: { flex: 1, height: 42, borderRadius: 21, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.borderStrong, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.xs },
  actionText: { color: colors.primary, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  deleteActionButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.orangeWash, alignItems: "center", justifyContent: "center" },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  sectionTitle: { color: colors.textPrimary, fontFamily: fontFamily.headline, fontSize: fontSize.lg },
  count: { color: colors.accentOrangePressed, fontFamily: fontFamily.bodyBold, fontSize: 12 },
  list: { gap: spacing.sm },
  inviteCard: { borderRadius: 18, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, padding: spacing.md, flexDirection: "row", alignItems: "center", gap: spacing.sm, ...shadow.card },
  inviteMain: { flex: 1 },
  inviteTitle: { color: colors.textPrimary, fontFamily: fontFamily.bodyBold, fontSize: 13 },
  inviteMeta: { color: colors.textSecondary, fontFamily: fontFamily.mono, fontSize: 11, marginTop: 4 },
  iconButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.cardHighest, alignItems: "center", justifyContent: "center" },
  deleteIconButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.orangeWash, alignItems: "center", justifyContent: "center" },
  emptyText: { color: colors.textSecondary, fontFamily: fontFamily.body, fontSize: 13, textAlign: "center", paddingVertical: spacing.lg },
  });
}
