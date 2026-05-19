import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, setDoc } from "firebase/firestore";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { db } from "@/lib/firebase";

interface AuthUser {
  uid: string;
  displayName: string | null;
  phoneNumber: string | null;
  provider: "google" | "phone" | "demo";
}

interface AuthContextType {
  user: AuthUser | null;
  username: string | null;
  coins: number;
  loading: boolean;
  phoneConfirmation: string | null;
  signInWithGoogle: () => Promise<void>;
  sendPhoneOTP: (phoneNumber: string) => Promise<void>;
  verifyPhoneOTP: (otp: string) => Promise<void>;
  saveUsername: (username: string) => Promise<void>;
  addCoins: (amount: number) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEYS = {
  USER: "@carking_user",
  USERNAME: "@carking_username",
  PHONE_PENDING: "@carking_phone_pending",
  COINS: "@carking_coins",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(true);
  const [phoneConfirmation, setPhoneConfirmation] = useState<string | null>(null);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const [storedUser, storedUsername, storedCoins] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.USER),
        AsyncStorage.getItem(STORAGE_KEYS.USERNAME),
        AsyncStorage.getItem(STORAGE_KEYS.COINS),
      ]);
      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedUsername) setUsername(storedUsername);
      setCoins(storedCoins ? parseInt(storedCoins, 10) : 0);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = useCallback(async () => {
    const demoUser: AuthUser = {
      uid: `google_${Date.now()}`,
      displayName: "Google User",
      phoneNumber: null,
      provider: "google",
    };
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(demoUser));
    setUser(demoUser);
  }, []);

  const sendPhoneOTP = useCallback(async (phoneNumber: string) => {
    await AsyncStorage.setItem(STORAGE_KEYS.PHONE_PENDING, phoneNumber);
    setPhoneConfirmation(phoneNumber);
  }, []);

  const verifyPhoneOTP = useCallback(async (_otp: string) => {
    const phone = await AsyncStorage.getItem(STORAGE_KEYS.PHONE_PENDING);
    const demoUser: AuthUser = {
      uid: `phone_${Date.now()}`,
      displayName: null,
      phoneNumber: phone,
      provider: "phone",
    };
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(demoUser));
    await AsyncStorage.removeItem(STORAGE_KEYS.PHONE_PENDING);
    setUser(demoUser);
    setPhoneConfirmation(null);
  }, []);

  const saveUsername = useCallback(
    async (newUsername: string) => {
      if (!user) return;
      const initialCoins = 1000;
      try {
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          username: newUsername,
          provider: user.provider,
          createdAt: new Date().toISOString(),
          coins: initialCoins,
          carsOwned: [],
        });
      } catch {
        // Firebase not configured — save locally only
      }
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.USERNAME, newUsername),
        AsyncStorage.setItem(STORAGE_KEYS.COINS, String(initialCoins)),
      ]);
      setUsername(newUsername);
      setCoins(initialCoins);
    },
    [user]
  );

  const addCoins = useCallback(
    async (amount: number) => {
      const newCoins = coins + amount;
      setCoins(newCoins);
      await AsyncStorage.setItem(STORAGE_KEYS.COINS, String(newCoins));
      if (user) {
        try {
          await setDoc(
            doc(db, "users", user.uid),
            { coins: newCoins },
            { merge: true }
          );
        } catch {
          // Firebase not configured — saved locally
        }
      }
    },
    [coins, user]
  );

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USER,
      STORAGE_KEYS.USERNAME,
      STORAGE_KEYS.PHONE_PENDING,
      STORAGE_KEYS.COINS,
    ]);
    setUser(null);
    setUsername(null);
    setCoins(0);
    setPhoneConfirmation(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        username,
        coins,
        loading,
        phoneConfirmation,
        signInWithGoogle,
        sendPhoneOTP,
        verifyPhoneOTP,
        saveUsername,
        addCoins,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
