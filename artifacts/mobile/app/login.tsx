import { AntDesign, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";

const { width, height } = Dimensions.get("window");

type AuthStep = "main" | "phone" | "otp";

export default function LoginScreen() {
  const { signInWithGoogle, sendPhoneOTP, verifyPhoneOTP } = useAuth();
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState<AuthStep>("main");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      router.replace("/username-setup");
    } catch {
      Alert.alert("Error", "Google login mein problem aayi. Dobara try karo.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (phone.length < 10) {
      Alert.alert("Galat Number", "Sahi phone number daalo (10 digits)");
      return;
    }
    setLoading(true);
    try {
      await sendPhoneOTP(`+91${phone}`);
      setStep("otp");
    } catch {
      Alert.alert("Error", "OTP bhejne mein problem. Dobara try karo.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length < 4) {
      Alert.alert("Galat OTP", "Sahi OTP daalo");
      return;
    }
    setLoading(true);
    try {
      await verifyPhoneOTP(otp);
      router.replace("/username-setup");
    } catch {
      Alert.alert("Error", "OTP galat hai. Dobara try karo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/car-bg.png")}
        style={styles.bgImage}
        resizeMode="cover"
      />

      <LinearGradient
        colors={["#0a0a0a99", "#0a0a0aCC", "#0a0a0a"]}
        locations={[0, 0.4, 0.75]}
        style={StyleSheet.absoluteFill}
      />

      <KeyboardAvoidingView
        style={[styles.content, { paddingBottom: insets.bottom + 32, paddingTop: insets.top + 20 }]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <Image
              source={require("../assets/images/icon.png")}
              style={styles.smallLogo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>CarKing</Text>
          <Text style={styles.tagline}>Apni dream car collection banao</Text>
        </View>

        <View style={styles.formContainer}>
          {step === "main" && (
            <>
              <Text style={styles.welcomeText}>Welcome! Shuru karo abhi</Text>

              <Pressable
                style={({ pressed }) => [
                  styles.googleButton,
                  pressed && styles.pressed,
                ]}
                onPress={handleGoogleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <AntDesign name="google" size={20} color="#fff" style={styles.btnIcon} />
                    <Text style={styles.googleButtonText}>Google se Login Karo</Text>
                  </>
                )}
              </Pressable>

              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>ya</Text>
                <View style={styles.dividerLine} />
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.phoneButton,
                  pressed && styles.pressed,
                ]}
                onPress={() => setStep("phone")}
                disabled={loading}
              >
                <Feather name="phone" size={20} color="#D4AF37" style={styles.btnIcon} />
                <Text style={styles.phoneButtonText}>Phone se Login Karo</Text>
              </Pressable>
            </>
          )}

          {step === "phone" && (
            <>
              <Pressable style={styles.backBtn} onPress={() => setStep("main")}>
                <Feather name="arrow-left" size={20} color="#888" />
                <Text style={styles.backText}>Wapas Jao</Text>
              </Pressable>

              <Text style={styles.welcomeText}>Apna number daalo</Text>

              <View style={styles.phoneInputRow}>
                <View style={styles.countryCode}>
                  <Text style={styles.countryCodeText}>🇮🇳 +91</Text>
                </View>
                <TextInput
                  style={styles.phoneInput}
                  placeholder="10 digit number"
                  placeholderTextColor="#555"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={phone}
                  onChangeText={setPhone}
                  autoFocus
                />
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.otpSendButton,
                  pressed && styles.pressed,
                  phone.length < 10 && styles.disabledBtn,
                ]}
                onPress={handleSendOTP}
                disabled={loading || phone.length < 10}
              >
                {loading ? (
                  <ActivityIndicator color="#0a0a0a" />
                ) : (
                  <Text style={styles.otpSendText}>OTP Bhejo</Text>
                )}
              </Pressable>
            </>
          )}

          {step === "otp" && (
            <>
              <Pressable style={styles.backBtn} onPress={() => setStep("phone")}>
                <Feather name="arrow-left" size={20} color="#888" />
                <Text style={styles.backText}>Wapas Jao</Text>
              </Pressable>

              <Text style={styles.welcomeText}>OTP daalo</Text>
              <Text style={styles.otpSubtext}>+91 {phone} pe OTP bheja gaya</Text>

              <TextInput
                style={styles.otpInput}
                placeholder="- - - - - -"
                placeholderTextColor="#555"
                keyboardType="number-pad"
                maxLength={6}
                value={otp}
                onChangeText={setOtp}
                autoFocus
                textAlign="center"
              />

              <Pressable
                style={({ pressed }) => [
                  styles.otpSendButton,
                  pressed && styles.pressed,
                  otp.length < 4 && styles.disabledBtn,
                ]}
                onPress={handleVerifyOTP}
                disabled={loading || otp.length < 4}
              >
                {loading ? (
                  <ActivityIndicator color="#0a0a0a" />
                ) : (
                  <Text style={styles.otpSendText}>Verify Karo</Text>
                )}
              </Pressable>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  bgImage: {
    position: "absolute",
    width,
    height: height * 0.6,
    top: 0,
    opacity: 0.6,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginTop: 40,
  },
  logoRow: {
    marginBottom: 16,
  },
  smallLogo: {
    width: 72,
    height: 72,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#D4AF3760",
  },
  title: {
    fontSize: 44,
    fontWeight: "900",
    color: "#D4AF37",
    letterSpacing: 4,
    textShadowColor: "#D4AF3760",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  tagline: {
    fontSize: 14,
    color: "#888888",
    marginTop: 6,
    letterSpacing: 0.5,
  },
  formContainer: {
    backgroundColor: "#111111",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  welcomeText: {
    color: "#F5F5F0",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  googleButton: {
    backgroundColor: "#DB4437",
    borderRadius: 14,
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  googleButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  btnIcon: {
    marginRight: 4,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#2a2a2a",
  },
  dividerText: {
    color: "#555",
    fontSize: 13,
    fontWeight: "600",
  },
  phoneButton: {
    borderRadius: 14,
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#D4AF37",
    gap: 10,
  },
  phoneButtonText: {
    color: "#D4AF37",
    fontSize: 16,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
  },
  backText: {
    color: "#888",
    fontSize: 14,
  },
  phoneInputRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  countryCode: {
    backgroundColor: "#1C1C1C",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    paddingHorizontal: 14,
    justifyContent: "center",
  },
  countryCodeText: {
    color: "#F5F5F0",
    fontSize: 15,
    fontWeight: "600",
  },
  phoneInput: {
    flex: 1,
    backgroundColor: "#1C1C1C",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    color: "#F5F5F0",
    fontSize: 18,
    fontWeight: "600",
    paddingHorizontal: 16,
    height: 52,
    letterSpacing: 2,
  },
  otpInput: {
    backgroundColor: "#1C1C1C",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#D4AF3780",
    color: "#D4AF37",
    fontSize: 28,
    fontWeight: "700",
    paddingVertical: 16,
    marginBottom: 16,
    letterSpacing: 12,
  },
  otpSubtext: {
    color: "#888",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 20,
    marginTop: -8,
  },
  otpSendButton: {
    backgroundColor: "#D4AF37",
    borderRadius: 14,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
  },
  otpSendText: {
    color: "#0a0a0a",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  disabledBtn: {
    opacity: 0.4,
  },
});
