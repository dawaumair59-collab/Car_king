import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";

const { width } = Dimensions.get("window");

const RARITY_COLORS: Record<string, string> = {
  Common: "#888888",
  Rare: "#3b82f6",
  Epic: "#a855f7",
  Legendary: "#D4AF37",
};

const LISTINGS = [
  { id: "1", name: "Tata Nexon EV", brand: "Tata", rarity: "Rare", price: 980, seller: "SpeedKing99" },
  { id: "2", name: "Royal Enfield Bullet", brand: "RE", rarity: "Common", price: 340, seller: "TurboRaja" },
  { id: "3", name: "Audi R8", brand: "Audi", rarity: "Epic", price: 4200, seller: "V8Veer" },
  { id: "4", name: "Lamborghini Urus", brand: "Lambo", rarity: "Legendary", price: 12500, seller: "CarMaestro" },
  { id: "5", name: "Honda City", brand: "Honda", rarity: "Common", price: 480, seller: "SpeedStar" },
  { id: "6", name: "Mercedes GLE", brand: "Mercedes", rarity: "Epic", price: 3800, seller: "RacingKing" },
];

export default function MarketScreen() {
  const insets = useSafeAreaInsets();
  const { coins } = useAuth();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("All");

  const filters = ["All", "Common", "Rare", "Epic", "Legendary"];

  const filtered = LISTINGS.filter((l) => {
    const matchSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.brand.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || l.rarity === filter;
    return matchSearch && matchFilter;
  });

  const handleBuy = (item: (typeof LISTINGS)[0]) => {
    if (coins < item.price) {
      Alert.alert("Not Enough Coins", `You need 🪙 ${item.price.toLocaleString()} to buy this car. Earn more coins by claiming daily rewards!`);
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert("Purchase Successful!", `You bought ${item.name} for 🪙 ${item.price.toLocaleString()}!`);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Marketplace</Text>
        <View style={styles.coinsChip}>
          <Text>🪙</Text>
          <Text style={styles.coinsText}>{coins.toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Feather name="search" size={16} color="#555" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search cars..."
            placeholderTextColor="#555"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <Feather name="x" size={16} color="#555" />
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.filtersRow}>
        {filters.map((f) => (
          <Pressable
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => { setFilter(f); Haptics.selectionAsync(); }}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="search" size={40} color="#333" />
            <Text style={styles.emptyTitle}>No listings found</Text>
            <Text style={styles.emptySub}>Try a different search or filter</Text>
          </View>
        }
        renderItem={({ item }) => {
          const rarityColor = RARITY_COLORS[item.rarity];
          return (
            <LinearGradient colors={["#141414", "#111111"]} style={styles.listingCard}>
              <View style={[styles.carIcon, { borderColor: rarityColor + "40" }]}>
                <MaterialCommunityIcons name="car-sports" size={36} color={rarityColor} />
              </View>
              <View style={styles.listingInfo}>
                <Text style={styles.listingBrand}>{item.brand}</Text>
                <Text style={styles.listingName}>{item.name}</Text>
                <View style={styles.listingMeta}>
                  <View style={[styles.rarityBadge, { backgroundColor: rarityColor + "20", borderColor: rarityColor + "60" }]}>
                    <Text style={[styles.rarityText, { color: rarityColor }]}>{item.rarity}</Text>
                  </View>
                  <Text style={styles.sellerText}>by {item.seller}</Text>
                </View>
              </View>
              <View style={styles.listingRight}>
                <Text style={styles.listingPrice}>🪙 {item.price.toLocaleString()}</Text>
                <Pressable
                  style={({ pressed }) => [styles.buyBtn, pressed && { opacity: 0.8 }]}
                  onPress={() => handleBuy(item)}
                >
                  <Text style={styles.buyBtnText}>Buy</Text>
                </Pressable>
              </View>
            </LinearGradient>
          );
        }}
      />
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
  coinsText: { color: "#D4AF37", fontWeight: "800", fontSize: 14 },
  searchRow: { paddingHorizontal: 16, paddingTop: 12 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1C1C",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    gap: 10,
  },
  searchInput: { flex: 1, color: "#F5F5F0", fontSize: 15 },
  filtersRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: "#1C1C1C",
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  filterChipActive: { backgroundColor: "#D4AF37", borderColor: "#D4AF37" },
  filterText: { color: "#888", fontSize: 13, fontWeight: "600" },
  filterTextActive: { color: "#0a0a0a" },
  list: { paddingHorizontal: 16, paddingBottom: 32, gap: 10 },
  listingCard: {
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  carIcon: {
    width: 68,
    height: 68,
    borderRadius: 14,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  listingInfo: { flex: 1, gap: 3 },
  listingBrand: { fontSize: 11, color: "#888", fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
  listingName: { fontSize: 15, fontWeight: "800", color: "#F5F5F0" },
  listingMeta: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 },
  rarityBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1 },
  rarityText: { fontSize: 10, fontWeight: "700" },
  sellerText: { fontSize: 11, color: "#555" },
  listingRight: { alignItems: "flex-end", gap: 8 },
  listingPrice: { color: "#D4AF37", fontWeight: "800", fontSize: 14 },
  buyBtn: {
    backgroundColor: "#D4AF37",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  buyBtnText: { color: "#0a0a0a", fontWeight: "800", fontSize: 13 },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyTitle: { color: "#F5F5F0", fontSize: 18, fontWeight: "700" },
  emptySub: { color: "#888", fontSize: 14 },
});
