import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";

interface SettingsRow {
  id: string;
  icon: string;
  label: string;
  action: () => void;
  destructive?: boolean;
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, username, coins, signOut } = useAuth();

  const avatarLetter = username ? username[0].toUpperCase() : "?";

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            await signOut();
            router.replace("/login");
          },
        },
      ]
    );
  };

  const settingsRows: SettingsRow[] = [
    { id: "notifications", icon: "bell", label: "Notifications", action: () => Alert.alert("Coming Soon", "Notification settings coming soon!") },
    { id: "privacy", icon: "shield", label: "Privacy Policy", action: () => Alert.alert("Privacy", "Privacy policy will be available soon.") },
    { id: "terms", icon: "file-text", label: "Terms of Service", action: () => Alert.alert("Terms", "Terms of service will be available soon.") },
    { id: "support", icon: "help-circle", label: "Support", action: () => Alert.alert("Support", "Contact us at support@carking.com") },
    { id: "signout", icon: "log-out", label: "Sign Out", action: handleSignOut, destructive: true },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <LinearGradient colors={["#1a1400", "#111111"]} style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLetter}>{avatarLetter}</Text>
          </View>
          <Text style={styles.usernameText}>{username ?? "Driver"}</Text>
          <Text style={styles.providerText}>
            {user?.provider === "google"
              ? "Signed in with Google"
              : user?.provider === "phone"
              ? `Signed in with ${user.phoneNumber}`
              : "Demo Account"}
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>2</Text>
              <Text style={styles.statLabel}>Cars</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: "#D4AF37" }]}>{coins.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Coins</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>#—</Text>
              <Text style={styles.statLabel}>Rank</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.badgesSection}>
          <Text style={styles.sectionLabel}>Badges</Text>
          <View style={styles.badgesRow}>
            {["🚗", "🏁", "⭐"].map((badge, i) => (
              <View key={i} style={styles.badge}>
                <Text style={styles.badgeEmoji}>{badge}</Text>
              </View>
            ))}
            <View style={[styles.badge, styles.badgeLocked]}>
              <Feather name="lock" size={18} color="#555" />
            </View>
            <View style={[styles.badge, styles.badgeLocked]}>
              <Feather name="lock" size={18} color="#555" />
            </View>
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionLabel}>Settings</Text>
          <View style={styles.settingsList}>
            {settingsRows.map((row, i) => (
              <Pressable
                key={row.id}
                style={({ pressed }) => [
                  styles.settingRow,
                  i === 0 && styles.settingRowFirst,
                  i === settingsRows.length - 1 && styles.settingRowLast,
                  pressed && styles.pressed,
                ]}
                onPress={row.action}
              >
                <View style={styles.settingLeft}>
                  <View style={[styles.settingIconCircle, row.destructive && styles.settingIconDestructive]}>
                    <Feather
                      name={row.icon as any}
                      size={17}
                      color={row.destructive ? "#ef4444" : "#888"}
                    />
                  </View>
                  <Text style={[styles.settingLabel, row.destructive && styles.settingLabelDestructive]}>
                    {row.label}
                  </Text>
                </View>
                {!row.destructive && (
                  <Feather name="chevron-right" size={18} color="#555" />
                )}
              </Pressable>
            ))}
          </View>
        </View>

        <Text style={styles.versionText}>CarKing v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a0a" },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
  },
  headerTitle: { fontSize: 22, fontWeight: "900", color: "#F5F5F0" },
  scroll: { padding: 16, gap: 20, paddingBottom: 40 },
  profileCard: {
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#D4AF3730",
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#D4AF3720",
    borderWidth: 3,
    borderColor: "#D4AF3760",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  avatarLetter: { fontSize: 28, fontWeight: "900", color: "#D4AF37" },
  usernameText: { fontSize: 22, fontWeight: "900", color: "#F5F5F0" },
  providerText: { fontSize: 13, color: "#888" },
  statsRow: {
    flexDirection: "row",
    marginTop: 16,
    width: "100%",
    backgroundColor: "#0a0a0a40",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  statItem: { flex: 1, alignItems: "center", gap: 4 },
  statValue: { fontSize: 20, fontWeight: "900", color: "#F5F5F0" },
  statLabel: { fontSize: 12, color: "#888", fontWeight: "500" },
  statDivider: { width: 1, backgroundColor: "#2a2a2a", marginHorizontal: 8 },
  badgesSection: { gap: 12 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  badgesRow: { flexDirection: "row", gap: 10 },
  badge: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#1C1C1C",
    borderWidth: 1,
    borderColor: "#D4AF3740",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeLocked: { borderColor: "#2a2a2a", opacity: 0.5 },
  badgeEmoji: { fontSize: 24 },
  settingsSection: { gap: 12 },
  settingsList: {
    backgroundColor: "#111111",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#1a1a1a",
  },
  settingRowFirst: { borderTopWidth: 0 },
  settingRowLast: {},
  settingLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  settingIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
  },
  settingIconDestructive: { backgroundColor: "#ef444420" },
  settingLabel: { fontSize: 15, fontWeight: "600", color: "#F5F5F0" },
  settingLabelDestructive: { color: "#ef4444" },
  pressed: { opacity: 0.7 },
  versionText: { color: "#333", fontSize: 12, textAlign: "center", paddingBottom: 8 },
});
