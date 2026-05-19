import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";

interface BusinessCard {
  id: string;
  icon: string;
  name: string;
  desc: string;
  income: number;
  cost: number;
  unlocked: boolean;
}

const BUSINESSES: BusinessCard[] = [
  { id: "1", icon: "🔧", name: "Car Workshop", desc: "Repair and maintain cars for other players", income: 50, cost: 500, unlocked: true },
  { id: "2", icon: "⛽", name: "Fuel Station", desc: "Sell fuel to earn passive income every hour", income: 120, cost: 1200, unlocked: false },
  { id: "3", icon: "🏎️", name: "Racing Academy", desc: "Train new drivers and earn from their wins", income: 300, cost: 3000, unlocked: false },
  { id: "4", icon: "🏭", name: "Car Factory", desc: "Manufacture and sell custom-built cars", income: 800, cost: 8000, unlocked: false },
];

export default function BusinessScreen() {
  const insets = useSafeAreaInsets();
  const { coins } = useAuth();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Business</Text>
        <View style={styles.coinsChip}>
          <Text style={styles.coinEmoji}>🪙</Text>
          <Text style={styles.coinsText}>{coins.toLocaleString()}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <LinearGradient colors={["#0a1a0a", "#111111"]} style={styles.banner}>
          <Feather name="trending-up" size={28} color="#22c55e" />
          <View>
            <Text style={styles.bannerTitle}>Build your empire</Text>
            <Text style={styles.bannerSub}>Invest in businesses to earn passive income</Text>
          </View>
        </LinearGradient>

        <Text style={styles.sectionLabel}>Available Businesses</Text>

        {BUSINESSES.map((biz) => (
          <View key={biz.id} style={[styles.bizCard, !biz.unlocked && styles.bizLocked]}>
            <View style={styles.bizLeft}>
              <Text style={styles.bizIcon}>{biz.icon}</Text>
              <View style={styles.bizInfo}>
                <Text style={styles.bizName}>{biz.name}</Text>
                <Text style={styles.bizDesc}>{biz.desc}</Text>
                <View style={styles.bizStats}>
                  <View style={styles.bizStat}>
                    <Feather name="trending-up" size={12} color="#22c55e" />
                    <Text style={styles.bizStatText}>🪙 {biz.income}/hr</Text>
                  </View>
                </View>
              </View>
            </View>
            <Pressable
              style={[
                styles.buyBtn,
                biz.unlocked ? styles.buyBtnOwned : styles.buyBtnAvail,
                coins < biz.cost && !biz.unlocked && styles.buyBtnDisabled,
              ]}
            >
              <Text style={[styles.buyBtnText, biz.unlocked && styles.buyBtnTextOwned]}>
                {biz.unlocked ? "Owned" : `🪙 ${biz.cost.toLocaleString()}`}
              </Text>
            </Pressable>
          </View>
        ))}

        <View style={styles.comingSoon}>
          <Feather name="clock" size={20} color="#555" />
          <Text style={styles.comingSoonText}>More businesses coming soon!</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a0a" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
  },
  headerTitle: { fontSize: 22, fontWeight: "900", color: "#F5F5F0" },
  coinsChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#1C1C1C",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#D4AF3740",
  },
  coinEmoji: { fontSize: 14 },
  coinsText: { color: "#D4AF37", fontWeight: "800", fontSize: 14 },
  scroll: { padding: 16, gap: 12, paddingBottom: 32 },
  banner: {
    borderRadius: 18,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderWidth: 1,
    borderColor: "#22c55e30",
    marginBottom: 8,
  },
  bannerTitle: { fontSize: 17, fontWeight: "800", color: "#F5F5F0" },
  bannerSub: { fontSize: 13, color: "#888", marginTop: 2 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  bizCard: {
    backgroundColor: "#111111",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    gap: 12,
  },
  bizLocked: { opacity: 0.65 },
  bizLeft: { flexDirection: "row", alignItems: "flex-start", gap: 12, flex: 1 },
  bizIcon: { fontSize: 32 },
  bizInfo: { flex: 1, gap: 4 },
  bizName: { fontSize: 15, fontWeight: "800", color: "#F5F5F0" },
  bizDesc: { fontSize: 12, color: "#888", lineHeight: 16 },
  bizStats: { flexDirection: "row", gap: 12, marginTop: 4 },
  bizStat: { flexDirection: "row", alignItems: "center", gap: 4 },
  bizStatText: { fontSize: 12, color: "#22c55e", fontWeight: "600" },
  buyBtn: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minWidth: 90,
    alignItems: "center",
  },
  buyBtnOwned: { backgroundColor: "#22c55e20", borderWidth: 1, borderColor: "#22c55e60" },
  buyBtnAvail: { backgroundColor: "#D4AF37" },
  buyBtnDisabled: { backgroundColor: "#1C1C1C", borderWidth: 1, borderColor: "#2a2a2a" },
  buyBtnText: { fontSize: 13, fontWeight: "800", color: "#0a0a0a" },
  buyBtnTextOwned: { color: "#22c55e" },
  comingSoon: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 20,
  },
  comingSoonText: { color: "#555", fontSize: 14 },
});
