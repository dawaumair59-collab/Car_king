import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Confetti from "@/components/Confetti";
import { useAuth } from "@/context/AuthContext";

const { width } = Dimensions.get("window");
const DAILY_REWARD_KEY = "@carking_daily_reward";
const DAILY_REWARD_AMOUNT = 100;

interface GridButton {
  id: string;
  icon: string;
  iconType: "feather" | "material";
  label: string;
  sublabel: string;
  color: string;
  route: string;
}

const GRID_BUTTONS: GridButton[] = [
  {
    id: "collection",
    icon: "car-sports",
    iconType: "material",
    label: "My Collection",
    sublabel: "View your cars",
    color: "#3b82f6",
    route: "/(tabs)/collection",
  },
  {
    id: "business",
    icon: "briefcase",
    iconType: "feather",
    label: "Business",
    sublabel: "Earn & invest",
    color: "#22c55e",
    route: "/(tabs)/business",
  },
  {
    id: "market",
    icon: "shopping-bag",
    iconType: "feather",
    label: "Marketplace",
    sublabel: "Buy & sell cars",
    color: "#f59e0b",
    route: "/(tabs)/market",
  },
  {
    id: "leaderboard",
    icon: "award",
    iconType: "feather",
    label: "Leaderboard",
    sublabel: "Top players",
    color: "#D4AF37",
    route: "",
  },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function HomeScreen() {
  const { username, coins, addCoins } = useAuth();
  const insets = useSafeAreaInsets();

  const [showReward, setShowReward] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const rewardScale = useRef(new Animated.Value(0.7)).current;
  const rewardOpacity = useRef(new Animated.Value(0)).current;
  const coinBounce = useRef(new Animated.Value(1)).current;
  const plusOpacity = useRef(new Animated.Value(0)).current;
  const plusY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    checkDailyReward();
  }, []);

  const checkDailyReward = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const lastClaim = await AsyncStorage.getItem(DAILY_REWARD_KEY);
      if (lastClaim !== today) {
        setTimeout(() => openRewardModal(), 800);
      }
    } catch {
      // ignore
    }
  };

  const openRewardModal = () => {
    setShowReward(true);
    Animated.parallel([
      Animated.spring(rewardScale, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(rewardOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const claimReward = async () => {
    if (rewardClaimed) return;
    setRewardClaimed(true);
    setShowConfetti(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const today = new Date().toISOString().split("T")[0];
    await AsyncStorage.setItem(DAILY_REWARD_KEY, today);
    await addCoins(DAILY_REWARD_AMOUNT);

    Animated.sequence([
      Animated.spring(coinBounce, {
        toValue: 1.3,
        tension: 80,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(coinBounce, {
        toValue: 1,
        tension: 80,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.parallel([
      Animated.timing(plusOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(plusY, { toValue: -40, duration: 800, useNativeDriver: true }),
    ]).start(() => {
      Animated.timing(plusOpacity, { toValue: 0, duration: 300, useNativeDriver: true }).start();
    });

    setTimeout(() => {
      setShowReward(false);
      setShowConfetti(false);
      rewardScale.setValue(0.7);
      rewardOpacity.setValue(0);
      plusY.setValue(0);
    }, 2200);
  };

  const handleGridPress = (btn: GridButton) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!btn.route) {
      return;
    }
    router.navigate(btn.route as any);
  };

  const avatarLetter = username ? username[0].toUpperCase() : "?";

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLetter}>{avatarLetter}</Text>
          </View>
          <View>
            <Text style={styles.greetText}>{getGreeting()}</Text>
            <Text style={styles.usernameText}>{username ?? "Driver"}</Text>
          </View>
        </View>

        <Animated.View style={[styles.coinsChip, { transform: [{ scale: coinBounce }] }]}>
          <Text style={styles.coinEmoji}>🪙</Text>
          <Text style={styles.coinsText}>{coins.toLocaleString()}</Text>
          <Animated.Text
            style={[styles.plusCoins, { opacity: plusOpacity, transform: [{ translateY: plusY }] }]}
          >
            +{DAILY_REWARD_AMOUNT}
          </Animated.Text>
        </Animated.View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <LinearGradient
          colors={["#1a1400", "#111111"]}
          style={styles.bannerCard}
        >
          <View>
            <Text style={styles.bannerTitle}>Welcome to CarKing!</Text>
            <Text style={styles.bannerSub}>Collect, trade and race your dream cars</Text>
          </View>
          <MaterialCommunityIcons name="car-sports" size={48} color="#D4AF3740" />
        </LinearGradient>

        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.grid}>
          {GRID_BUTTONS.map((btn) => (
            <Pressable
              key={btn.id}
              style={({ pressed }) => [styles.gridBtn, pressed && styles.pressed]}
              onPress={() => handleGridPress(btn)}
            >
              <LinearGradient
                colors={["#1C1C1C", "#141414"]}
                style={styles.gridBtnInner}
              >
                <View style={[styles.iconCircle, { backgroundColor: btn.color + "20" }]}>
                  {btn.iconType === "material" ? (
                    <MaterialCommunityIcons
                      name={btn.icon as any}
                      size={28}
                      color={btn.color}
                    />
                  ) : (
                    <Feather name={btn.icon as any} size={26} color={btn.color} />
                  )}
                </View>
                <Text style={styles.gridBtnLabel}>{btn.label}</Text>
                <Text style={styles.gridBtnSub}>{btn.sublabel}</Text>
              </LinearGradient>
            </Pressable>
          ))}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🚗</Text>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Cars Owned</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🏆</Text>
            <Text style={styles.statValue}>#—</Text>
            <Text style={styles.statLabel}>Rank</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🪙</Text>
            <Text style={[styles.statValue, { color: "#D4AF37" }]}>
              {coins.toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>Coins</Text>
          </View>
        </View>
      </ScrollView>

      <Modal transparent visible={showReward} animationType="none" statusBarTranslucent>
        <View style={styles.modalOverlay}>
          {showConfetti && <Confetti />}
          <Animated.View
            style={[
              styles.modalCard,
              { opacity: rewardOpacity, transform: [{ scale: rewardScale }] },
            ]}
          >
            <Text style={styles.rewardEmoji}>🎉</Text>
            <Text style={styles.rewardTitle}>Daily Reward!</Text>
            <View style={styles.rewardAmountRow}>
              <Text style={styles.rewardPlus}>+</Text>
              <Text style={styles.rewardAmount}>{DAILY_REWARD_AMOUNT}</Text>
              <Text style={styles.rewardCoinsLabel}> Coins</Text>
            </View>
            <Text style={styles.rewardSubtext}>
              Come back every day to collect your reward
            </Text>

            <Pressable
              style={({ pressed }) => [
                styles.claimButton,
                rewardClaimed && styles.claimButtonClaimed,
                pressed && styles.pressed,
              ]}
              onPress={claimReward}
              disabled={rewardClaimed}
            >
              <Text style={styles.claimButtonText}>
                {rewardClaimed ? "Reward Claimed! ✓" : "Claim Reward"}
              </Text>
            </Pressable>

            {!rewardClaimed && (
              <Pressable onPress={() => setShowReward(false)} style={styles.skipBtn}>
                <Text style={styles.skipText}>Skip for now</Text>
              </Pressable>
            )}
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#D4AF3720",
    borderWidth: 2,
    borderColor: "#D4AF3760",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLetter: {
    fontSize: 18,
    fontWeight: "900",
    color: "#D4AF37",
  },
  greetText: {
    fontSize: 12,
    color: "#888",
    fontWeight: "500",
  },
  usernameText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#F5F5F0",
  },
  coinsChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#1C1C1C",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#D4AF3740",
  },
  coinEmoji: {
    fontSize: 16,
  },
  coinsText: {
    color: "#D4AF37",
    fontWeight: "800",
    fontSize: 15,
  },
  plusCoins: {
    position: "absolute",
    right: -4,
    top: -8,
    color: "#22c55e",
    fontWeight: "900",
    fontSize: 13,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 20,
  },
  bannerCard: {
    borderRadius: 18,
    padding: 20,
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D4AF3730",
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#D4AF37",
    marginBottom: 4,
  },
  bannerSub: {
    fontSize: 13,
    color: "#888",
    maxWidth: width * 0.55,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  gridBtn: {
    width: (width - 44) / 2,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  gridBtnInner: {
    padding: 18,
    alignItems: "flex-start",
    gap: 10,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  gridBtnLabel: {
    fontSize: 15,
    fontWeight: "800",
    color: "#F5F5F0",
  },
  gridBtnSub: {
    fontSize: 12,
    color: "#888",
    marginTop: -6,
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: "#111111",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    overflow: "hidden",
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    gap: 4,
  },
  statEmoji: {
    fontSize: 20,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "900",
    color: "#F5F5F0",
  },
  statLabel: {
    fontSize: 11,
    color: "#888",
    fontWeight: "500",
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#000000BB",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCard: {
    width: width - 48,
    backgroundColor: "#141414",
    borderRadius: 28,
    padding: 32,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#D4AF3740",
    gap: 12,
  },
  rewardEmoji: {
    fontSize: 48,
  },
  rewardTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#D4AF37",
    letterSpacing: 0.5,
  },
  rewardAmountRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginVertical: 4,
  },
  rewardPlus: {
    fontSize: 28,
    fontWeight: "700",
    color: "#22c55e",
  },
  rewardAmount: {
    fontSize: 52,
    fontWeight: "900",
    color: "#22c55e",
    lineHeight: 60,
  },
  rewardCoinsLabel: {
    fontSize: 22,
    fontWeight: "700",
    color: "#22c55e",
  },
  rewardSubtext: {
    fontSize: 13,
    color: "#888",
    textAlign: "center",
    lineHeight: 18,
  },
  claimButton: {
    backgroundColor: "#D4AF37",
    borderRadius: 16,
    height: 54,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: "#D4AF37",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  claimButtonClaimed: {
    backgroundColor: "#22c55e",
  },
  claimButtonText: {
    color: "#0a0a0a",
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 0.3,
  },
  skipBtn: {
    paddingVertical: 8,
  },
  skipText: {
    color: "#555",
    fontSize: 13,
  },
});
