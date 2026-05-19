import { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get("window");

const COLORS = [
  "#D4AF37",
  "#FFD700",
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98FB98",
  "#FFA07A",
];

interface Particle {
  id: number;
  color: string;
  x: number;
  size: number;
  delay: number;
  duration: number;
  rotate: number;
}

const PARTICLES: Particle[] = Array.from({ length: 36 }, (_, i) => ({
  id: i,
  color: COLORS[i % COLORS.length],
  x: (i / 36) * width + Math.random() * (width / 36),
  size: 6 + Math.random() * 8,
  delay: Math.random() * 600,
  duration: 1400 + Math.random() * 600,
  rotate: Math.random() * 360,
}));

function ConfettiParticle({ particle }: { particle: Particle }) {
  const y = useRef(new Animated.Value(-30)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(particle.delay),
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(y, {
          toValue: height * 0.85,
          duration: particle.duration,
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: 1,
          duration: particle.duration,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: [`${particle.rotate}deg`, `${particle.rotate + 360}deg`],
  });

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: particle.x,
          width: particle.size,
          height: particle.size,
          backgroundColor: particle.color,
          opacity,
          transform: [{ translateY: y }, { rotate: spin }],
          borderRadius: particle.size < 8 ? particle.size / 2 : 2,
        },
      ]}
    />
  );
}

export default function Confetti() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {PARTICLES.map((p) => (
        <ConfettiParticle key={p.id} particle={p} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  particle: {
    position: "absolute",
    top: 0,
  },
});
