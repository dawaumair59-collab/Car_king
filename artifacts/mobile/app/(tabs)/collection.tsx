import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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

function CarCardItem({ car }: { car: CarCard }) {
  const rarityColor = RARITY_COLORS[car.rarity];
  return (
    <Pressable
      style={({ pressed }) => [styles.carCard, pressed && styles.pressed]}
      onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
    >
      <LinearGradient colors={["#1C1C1C", "#141414"]} style={styles.cardGrad}>
        <View style={[styles.carImagePlaceholder, { borderColor: rarityColor + "40" }]}>
          <MaterialCommunityIcons
            name="car-sports"
            size={48}
            color={car.owned ? rarityColor : "#333"}
          />
          {!car.owned && (
            <View style={styles.lockOverlay}>
              <Feather name="lock" size={14} color="#555" />
            </View>
          )}
        </View>
        <Text style={styles.carBrand}>{car.brand}</Text>
        <Text style={styles.carName} numberOfLines={1}>{car.name}</Text>
        <View style={styles.carFooter}>
          <View style={[styles.rarityBadge, { backgroundColor: rarityColor + "20", borderColor: rarityColor + "60" }]}>
            <Text style={[styles.rarityText, { color: rarityColor }]}>{car.rarity}</Text>
          </View>
          {!car.owned && (
            <View style={styles.priceRow}>
              <Text style={styles.coinSmall}>🪙</Text>
              <Text style={styles.priceText}>{car.price.toLocaleString()}</Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </Pressable>
  );
}

export default function CollectionScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<"owned" | "shop">("owned");

  const ownedCars = DEMO_CARS.filter((c) => c.owned);
  const shopCars = DEMO_CARS.filter((c) => !c.owned);
  const displayCars = activeTab === "owned" ? ownedCars : shopCars;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Car Collection</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{ownedCars.length} owned</Text>
        </View>
      </View>

      <View style={styles.tabRow}>
        <Pressable
          style={[styles.tab, activeTab === "owned" && styles.tabActive]}
          onPress={() => { setActiveTab("owned"); Haptics.selectionAsync(); }}
        >
          <Text style={[styles.tabText, activeTab === "owned" && styles.tabTextActive]}>
            My Cars
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === "shop" && styles.tabActive]}
          onPress={() => { setActiveTab("shop"); Haptics.selectionAsync(); }}
        >
          <Text style={[styles.tabText, activeTab === "shop" && styles.tabTextActive]}>
            Car Shop
          </Text>
        </Pressable>
      </View>

      {displayCars.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="car-off" size={52} color="#333" />
          <Text style={styles.emptyTitle}>No cars yet</Text>
          <Text style={styles.emptySub}>Visit the Car Shop to buy your first car!</Text>
        </View>
      ) : (
        <FlatList
          data={displayCars}
          renderItem={({ item }) => <CarCardItem car={item} />}
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
  countBadge: {
    backgroundColor: "#1C1C1C",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  countText: { color: "#888", fontSize: 13, fontWeight: "600" },
  tabRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: "#111111",
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: "center" },
  tabActive: { backgroundColor: "#D4AF37" },
  tabText: { color: "#888", fontWeight: "700", fontSize: 14 },
  tabTextActive: { color: "#0a0a0a" },
  grid: { paddingHorizontal: 16, paddingBottom: 32 },
  row: { gap: 12, marginBottom: 12 },
  carCard: {
    width: CARD_WIDTH,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  cardGrad: { padding: 12 },
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
  carBrand: {
    fontSize: 11,
    color: "#888",
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  carName: { fontSize: 14, color: "#F5F5F0", fontWeight: "700", marginTop: 2 },
  carFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  rarityBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
  },
  rarityText: { fontSize: 10, fontWeight: "700" },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  coinSmall: { fontSize: 12 },
  priceText: { color: "#D4AF37", fontSize: 12, fontWeight: "700" },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  emptyTitle: { color: "#F5F5F0", fontSize: 20, fontWeight: "800" },
  emptySub: { color: "#888", fontSize: 14, textAlign: "center", paddingHorizontal: 32 },
  pressed: { opacity: 0.8, transform: [{ scale: 0.97 }] },
});
