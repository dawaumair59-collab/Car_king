import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";

const SUGGESTIONS = ["RacingKing", "TurboRaja", "SpeedStar", "CarMaestro", "V8Veer"];

export default function UsernameSetupScreen() {
  const { saveUsername } = useAuth();
  const insets = useSafeAreaInsets();

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [shake] = useState(new Animated.Value(0));

  const isValid = username.trim().length >= 3 && username.trim().length <= 20;

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shake, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -6, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleConfirm = async () => {
    const trimmed = username.trim();
    if (trimmed.length < 3) {
      triggerShake();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Too Short!", "Username must be at least 3 characters.");
      return;
    }
    if (trimmed.length > 20) {
      triggerShake();
      Alert.alert("Too Long!", "Username must be at most 20 characters.");
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
      triggerShake();
      Alert.alert("Invalid Username!", "Only letters, numbers and underscores allowed.");
      return;
    }

    setLoading(true);
    try {
      await saveUsername(trimmed);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(tabs)");
    } catch {
      Alert.alert("Error", "Failed to save username. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1a1400", "#0a0a0a", "#0a0a0a"]}
        style={StyleSheet.absoluteFill}
      />

      <KeyboardAvoidingView
        style={[
          styles.content,
          { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 32 },
        ]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.topSection}>
          <View style={styles.iconCircle}>
            <Feather name="user" size={32} color="#D4AF37" />
          </View>
          <Text style={styles.titleMain}>Choose your username</Text>
          <Text style={styles.subtitle}>
            This is how you'll be known in the CarKing community
          </Text>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Username</Text>
          <Animated.View style={{ transform: [{ translateX: shake }] }}>
            <TextInput
              style={[
                styles.input,
                focused && styles.inputFocused,
                username.length > 0 && !isValid && styles.inputError,
                isValid && styles.inputValid,
              ]}
              placeholder="e.g., SpeedKing99"
              placeholderTextColor="#444"
              value={username}
              onChangeText={(t) => setUsername(t.replace(/[^a-zA-Z0-9_]/g, ""))}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              maxLength={20}
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
            />
          </Animated.View>

          <View style={styles.hintRow}>
            {username.length > 0 && (
              <Text style={[styles.hintText, isValid ? styles.hintGreen : styles.hintRed]}>
                {isValid
                  ? "✓ Looks good!"
                  : username.length < 3
                  ? `${3 - username.length} more characters needed`
                  : "Too long!"}
              </Text>
            )}
            <Text style={styles.charCount}>{username.length}/20</Text>
          </View>

          <Text style={styles.suggestLabel}>Suggestions</Text>
          <View style={styles.suggestionsRow}>
            {SUGGESTIONS.map((s) => (
              <Pressable
                key={s}
                style={({ pressed }) => [styles.suggestion, pressed && styles.pressed]}
                onPress={() => {
                  setUsername(s);
                  Haptics.selectionAsync();
                }}
              >
                <Text style={styles.suggestionText}>{s}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.confirmButton,
            pressed && styles.pressed,
            !isValid && styles.disabledBtn,
          ]}
          onPress={handleConfirm}
          disabled={!isValid || loading}
        >
          {loading ? (
            <ActivityIndicator color="#0a0a0a" />
          ) : (
            <>
              <Text style={styles.confirmText}>Continue</Text>
              <Feather name="arrow-right" size={20} color="#0a0a0a" />
            </>
          )}
        </Pressable>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  topSection: {
    alignItems: "center",
    gap: 12,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1C1C1C",
    borderWidth: 2,
    borderColor: "#D4AF3760",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  titleMain: {
    fontSize: 30,
    fontWeight: "900",
    color: "#D4AF37",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  inputSection: {
    gap: 0,
  },
  inputLabel: {
    color: "#888",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#1C1C1C",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#2a2a2a",
    color: "#F5F5F0",
    fontSize: 20,
    fontWeight: "700",
    paddingHorizontal: 18,
    paddingVertical: 16,
    letterSpacing: 0.5,
  },
  inputFocused: {
    borderColor: "#D4AF37",
  },
  inputError: {
    borderColor: "#ef444480",
  },
  inputValid: {
    borderColor: "#22c55e80",
  },
  hintRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  hintText: {
    fontSize: 13,
    fontWeight: "500",
  },
  hintGreen: { color: "#22c55e" },
  hintRed: { color: "#ef4444" },
  charCount: {
    color: "#555",
    fontSize: 12,
  },
  suggestLabel: {
    color: "#555",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  suggestionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  suggestion: {
    backgroundColor: "#1C1C1C",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  suggestionText: {
    color: "#D4AF37",
    fontSize: 13,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }],
  },
  confirmButton: {
    backgroundColor: "#D4AF37",
    borderRadius: 16,
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#D4AF37",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  confirmText: {
    color: "#0a0a0a",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  disabledBtn: {
    opacity: 0.35,
  },
});
