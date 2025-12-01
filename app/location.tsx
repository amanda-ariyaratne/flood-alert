import { useRouter } from "expo-router";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { useLocationContext } from "../src/contexts/LocationContext";

export default function LocationScreen() {
  const { location, setLocation } = useLocationContext();
  const router = useRouter();

  if (!location) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>No location selected.</Text>
        <Button title="Open Map" onPress={() => router.push("/map")} />
      </View>
    );
  }
  // Dummy flood prediction generator (deterministic per location)
  const makePredictions = (lat: number, lng: number) => {
    // seed from coordinates so results are stable for the same point
    const seed = Math.abs(Math.floor((lat + lng) * 10000)) % 1000;
    const rand = (n: number) => ((seed * (n + 1)) % 100) / 100;

    const riskFrom = (v: number) => {
      if (v > 0.8) return { level: "High", pct: Math.round(v * 100) };
      if (v > 0.5) return { level: "Moderate", pct: Math.round(v * 100) };
      return { level: "Low", pct: Math.round(v * 100) };
    };

    return [2, 5, 10, 24].map((h, i) => {
      const v = Math.min(1, rand(i) + (i * 0.08));
      return { hours: h, ...riskFrom(v) };
    });
  };

  const preds = makePredictions(location.coords.latitude, location.coords.longitude);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Selected coordinates</Text>
      <Text style={styles.coords}>Latitude: {location.coords.latitude.toFixed(6)}</Text>
      <Text style={styles.coords}>Longitude: {location.coords.longitude.toFixed(6)}</Text>

      <View style={{ height: 12 }} />

      <Text style={[styles.label, { marginTop: 8 }]}>Flood predictions (dummy)</Text>
      <View style={styles.predList}>
        {preds.map((p) => (
          <View key={p.hours} style={styles.predItem}>
            <Text style={styles.predHour}>Next {p.hours}h</Text>
            <Text style={styles.predLevel}>{p.level}</Text>
            <Text style={styles.predPct}>{p.pct}%</Text>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <Button title="Change" onPress={() => router.push("/map")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  coords: { fontSize: 16, marginTop: 4 },
  actions: { flexDirection: "row", marginTop: 20 },
  message: { marginBottom: 12 },
  predList: { marginTop: 8, width: "100%" },
  predItem: { flexDirection: "row", justifyContent: "space-between", padding: 12, borderBottomWidth: 1, borderColor: "#eee" },
  predHour: { fontSize: 14, color: "#333" },
  predLevel: { fontSize: 14, fontWeight: "600" },
  predPct: { fontSize: 14, color: "#007AFF" },
});
