import React, { useEffect, useRef } from "react";
import { View, Text, Animated, Easing } from "react-native";
import { styles } from "../assets/styles/components/Thermometer.style";
/**
 * Thermometer Component
 *
 * Props:
 *  - temperature (number, required): current temperature value
 *  - minTemp     (number, default 0):   minimum of the scale
 *  - maxTemp     (number, default 100): maximum of the scale
 *  - unit        (string, default '°C'): label shown below reading
 *  - tubeHeight  (number, default 220): height of the glass tube in px
 *  - tubeWidth   (number, default 34):  width  of the glass tube in px
 *
 * Usage:
 *  <Thermometer temperature={37} minTemp={0} maxTemp={100} unit="°C" />
 */

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

// ── Tick marks inside the tube ────────────────────────────────────────────────
function Ticks({ tubeHeight, tubeWidth, tickCount }) {
  const ticks = [];
  for (let i = 0; i <= tickCount; i++) {
    const isMajor = i % 2 === 0;
    const topPos = (tubeHeight / tickCount) * i;
    ticks.push(
      <View
        key={i}
        style={{
          position: "absolute",
          top: topPos - (isMajor ? 1 : 0.75),
          right: 0,
          width: isMajor ? tubeWidth * 0.52 : tubeWidth * 0.35,
          height: isMajor ? 2 : 1.5,
          backgroundColor: "rgba(255,255,255,0.55)",
          borderRadius: 2,
        }}
      />
    );
  }
  return <>{ticks}</>;
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Thermometer({
  temperature,
  minTemp = 0,
  maxTemp = 50,
  unit = "°C",
  tubeHeight = 150,
  tubeWidth = 34,
}) {
  const BORDER_W = 4;
  const BULB_SIZE = tubeWidth * 2.1; // diameter of the round bulb
  const TICK_COUNT = 10;

  // ratio 0–1 of how full the thermometer is
  const ratio = clamp((temperature - minTemp) / (maxTemp - minTemp), 0, 1);
  const animRatio = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animRatio, {
      toValue: ratio,
      duration: 700,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [ratio]);

  // Animated fill height (grows from the bottom of the tube)
  const fillHeight = animRatio.interpolate({
    inputRange: [0, 1],
    outputRange: [0, tubeHeight],
  });

  // Colour shifts: blue → orange → red with temperature
  const fillColor = animRatio.interpolate({
    inputRange: [0, 0.4, 0.6, 0.8, 1],
    // Tương ứng: 0°C (Rất lạnh), 20°C (Mát), 30°C (Ấm), 40°C (Nóng), 50°C (Rất nóng)
    outputRange: [
      "#64b5f6", // Blue (Lạnh)
      "#4caf50", // Green (Mát mẻ - Khoảng 20°C)
      "#ffeb3b", // Yellow (Ấm áp - Khoảng 30°C)
      "#ff9800", // Orange (Nóng - Khoảng 40°C)
      "#f44336", // Red (Cực nóng)
    ],
  });

  // ── Layout math ────────────────────────────────────────────────────────────
  const outerTubeW = tubeWidth;
  const innerTubeW = outerTubeW - BORDER_W * 2;
  const totalHeight = tubeHeight + BULB_SIZE * 0.55; // tube + half-bulb overlap

  return (
    <View style={styles.wrapper}>
      {/* ── Glass outer glow / halo ─────────────────────────────────────── */}
      <View
        style={[
          styles.halo,
          {
            width: outerTubeW + 16,
            height: totalHeight + 20,
            borderRadius: outerTubeW,
          },
        ]}
      />

      {/* ── Tube shell ──────────────────────────────────────────────────── */}
      <View
        style={[
          styles.tube,
          {
            width: outerTubeW,
            height: totalHeight,
            borderRadius: outerTubeW / 2,
            borderWidth: BORDER_W,
          },
        ]}
      >
        {/* Inner tube background (frosted glass look) */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: outerTubeW / 2,
            backgroundColor: "rgba(220,240,255,0.35)",
          }}
        />

        {/* ── Animated fill bar ─────────────────────────────────────────── */}
        <Animated.View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: fillHeight,
            backgroundColor: fillColor,
            borderRadius: outerTubeW / 2,
          }}
        />

        {/* ── Tick marks (right-aligned inside the tube upper area) ──────── */}
        <View
          style={{
            position: "absolute",
            top: BORDER_W + 2,
            right: BORDER_W,
            width: innerTubeW,
            height: tubeHeight,
          }}
        >
          <Ticks
            tubeHeight={tubeHeight}
            tubeWidth={innerTubeW}
            tickCount={TICK_COUNT}
          />
        </View>

        {/* ── Gloss highlight on left of tube ───────────────────────────── */}
        <View
          style={{
            position: "absolute",
            top: 8,
            left: 5,
            width: outerTubeW * 0.2,
            bottom: BULB_SIZE * 0.35,
            borderRadius: outerTubeW,
            backgroundColor: "rgba(255,255,255,0.35)",
          }}
        />
      </View>

      {/* ── Bulb ────────────────────────────────────────────────────────── */}
      <Animated.View
        style={[
          styles.bulb,
          {
            width: BULB_SIZE,
            height: BULB_SIZE,
            borderRadius: BULB_SIZE / 2,
            backgroundColor: fillColor,
            marginTop: -(BULB_SIZE * 0.52), // overlap tube bottom
          },
        ]}
      >
        {/* Bulb gloss */}
        <View
          style={{
            position: "absolute",
            bottom: BULB_SIZE * 0.18,
            right: BULB_SIZE * 0.18,
            width: BULB_SIZE * 0.22,
            height: BULB_SIZE * 0.22,
            borderRadius: BULB_SIZE,
            backgroundColor: "rgba(255,255,255,0.35)",
          }}
        />
      </Animated.View>

      {/* ── Temperature label ───────────────────────────────────────────── */}
      <Text style={styles.label}>
        {Math.round(temperature)}
        {unit}
      </Text>
    </View>
  );
}
