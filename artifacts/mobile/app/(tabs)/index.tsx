import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";

const { width } = Dimensions.get("window");

const CARD_WIDTH = (width - 48) / 2;

interface CarCard {
  id: string;
  name: string;
  brand: string;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  price: number;
  owned: boolean;
}

const RARITY_COLORS: Record<string, string> = {
  Common: "#888888",
  Rare: "#3b82f6",
  Epic: "#a855f7",
  Legendary: "#D4AF37",
};

const DEMO_CARS: CarCard[] = [
  { id: "1", name: "Maruti Swift", brand: "Maruti", rarity: "Common", price: 500, owned: true },
  { id: "2", name: "Hyundai i20", brand: "Hyundai", rarity: "Common", price: 600, owned: true },
  { id: "3", name: "Tata Nexon", brand: "Tata", rarity: "Rare", price: 1200, owned: false },
  { id: "4", name: "Mahindra Thar", brand: "Mahindra", rarity: "Rare", price: 1500, owned: false },
  { id: "5", name: "BMW M3", brand: "BMW", rarity: "Epic", price: 5000, owned: false },
  { id: "6", name: "Ferrari 488", brand: "Ferrari", rarity: "Legendary", price: 15000, owned: false },
];

function CarCardItem({ car, onPress }: { car: CarCard; onPress: () => void }) {
  const rarityColor = RARITY_COLORS[car.rarity];
  return (
    <Pressable
      style={({ pressed }) => [styles.carCard, pressed && styles.pressed]}
      onPress={onPress}
    >
      <LinearGradient
        colors={["#1C1C1C", "#141414"]}
        style={styles.carCardGradient}
      >
        <View style={[styles.carImagePlaceholder, { borderColor: rarityColor + "40" }]}>
          <MaterialCommunityIcons
            name="car-sports"
            size={48}
            color={car.owned ? rarityColor : "#333"}
          />
          {!car.owned && (
            <View style={styles.lockOverlay}>
              <Feather name="lock" size={16} color="#555" />
            </View>
          )}
        </View>

        <View style={styles.carInfo}>
          <Text style={styles.carBrand}>{car.brand}</Text>
          <Text style={styles.carName} numberOfLines={1}>{car.name}</Text>

          <View style={styles.carFooter}>
            <View style={[styles.rarityBadge, { backgroundColor: rarityColor + "20", borderColor: rarityColor + "60" }]}>
              <Text style={[styles.rarityText, { color: rarityColor }]}>{car.rarity}</Text>
            </View>
            {!car.owned && (
              <View style={styles.priceRow}>
                <MaterialCommunityIcons name="gold" size={12} color="#D4AF37" />
                <Text style={styles.priceText}>{car.price.toLocaleString()}</Text>
              </View>
            )}
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

export default function GameHomeScreen() {
  const { user, username, signOut } = useAuth();
  const insets = useSafeAreaInsets();
  const [coins] = useState(1000);
  const [activeTab, setActiveTab] = useState<"collection" | "shop">("collection");

  const ownedCars = DEMO_CARS.filter((c) => c.owned);
  const shopCars = DEMO_CARS.filter((c) => !c.owned);
  const displayCars = activeTab === "collection" ? ownedCars : shopCars;

  const handleCarPress = (car: CarCard) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!car.owned) {
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greetText}>Namaste,</Text>
          <Text style={styles.usernameText}>{username ?? "Driver"} 👑</Text>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.coinsChip}>
            <MaterialCommunityIcons name="gold" size={16} color="#D4AF37" />
            <Text style={styles.coinsText}>{coins.toLocaleString()}</Text>
          </View>
          <Pressable
            style={styles.signOutBtn}
            onPress={() => {
              signOut();
              router.replace("/login");
            }}
          >
            <Feather name="log-out" size={18} color="#888" />
          </Pressable>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{ownedCars.length}</Text>
          <Text style={styles.statLabel}>Cars</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCard}>
          <Text style={styles.statValue}>#1</Text>
          <Text style={styles.statLabel}>Rank</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: "#D4AF37" }]}>
            {coins.toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>Coins</Text>
        </View>
      </View>

      <View style={styles.tabRow}>
        <Pressable
          style={[styles.tab, activeTab === "collection" && styles.tabActive]}
          onPress={() => {
            setActiveTab("collection");
            Haptics.selectionAsync();
          }}
        >
          <Text style={[styles.tabText, activeTab === "collection" && styles.tabTextActive]}>
            Meri Collection
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === "shop" && styles.tabActive]}
          onPress={() => {
            setActiveTab("shop");
            Haptics.selectionAsync();
          }}
        >
          <Text style={[styles.tabText, activeTab === "shop" && styles.tabTextActive]}>
            Car Shop
          </Text>
        </Pressable>
      </View>

      {displayCars.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="car-off" size={48} color="#333" />
          <Text style={styles.emptyTitle}>Koi car nahi mili</Text>
          <Text style={styles.emptySubtitle}>Shop se naye cars kharido!</Text>
        </View>
      ) : (
        <FlatList
          data={displayCars}
          renderItem={({ item }) => (
            <CarCardItem car={item} onPress={() => handleCarPress(item)} />
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
  },
  greetText: {
    fontSize: 13,
    color: "#888",
    fontWeight: "500",
  },
  usernameText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#F5F5F0",
    marginTop: 2,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
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
  coinsText: {
    color: "#D4AF37",
    fontWeight: "800",
    fontSize: 14,
  },
  signOutBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1C1C1C",
    alignItems: "center",
    justifyContent: "center",
  },
  statsRow: {
    flexDirection: "row",
    margin: 16,
    backgroundColor: "#111111",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  statCard: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "900",
    color: "#F5F5F0",
  },
  statLabel: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#2a2a2a",
    marginHorizontal: 8,
  },
  tabRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: "#111111",
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: "#D4AF37",
  },
  tabText: {
    color: "#888",
    fontWeight: "700",
    fontSize: 14,
  },
  tabTextActive: {
    color: "#0a0a0a",
  },
  grid: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  row: {
    gap: 12,
    marginBottom: 12,
  },
  carCard: {
    width: CARD_WIDTH,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  carCardGradient: {
    padding: 12,
  },
  carImagePlaceholder: {
    height: 100,
    borderRadius: 12,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    marginBottom: 10,
    position: "relative",
  },
  lockOverlay: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#0a0a0a",
    alignItems: "center",
    justifyContent: "center",
  },
  carInfo: {
    gap: 4,
  },
  carBrand: {
    fontSize: 11,
    color: "#888",
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  carName: {
    fontSize: 14,
    color: "#F5F5F0",
    fontWeight: "700",
  },
  carFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  rarityBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
  },
  rarityText: {
    fontSize: 10,
    fontWeight: "700",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  priceText: {
    color: "#D4AF37",
    fontSize: 12,
    fontWeight: "700",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  emptyTitle: {
    color: "#F5F5F0",
    fontSize: 18,
    fontWeight: "700",
  },
  emptySubtitle: {
    color: "#888",
    fontSize: 14,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
});
