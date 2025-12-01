import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Button, StyleSheet, Text, View } from "react-native";
import { useLocationContext } from "../src/contexts/LocationContext";

export default function LocationScreen() {
  const { location, setLocation } = useLocationContext();
  const router = useRouter();
  const { t } = useTranslation();

  if (!location) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>{t('location.no_location_selected')}</Text>
        <Button title={t('location.open_map')} onPress={() => router.push('/map')} />
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
      <Text style={styles.label}>{t('location.title')}</Text>
      <Text style={styles.coords}>{t('coords.latitude')}: {location.coords.latitude.toFixed(6)}</Text>
      <Text style={styles.coords}>{t('coords.longitude')}: {location.coords.longitude.toFixed(6)}</Text>

      <View style={{ height: 12 }} />

      <Text style={[styles.label, { marginTop: 8 }]}>{t('location.predictions_label')}</Text>
      <View style={styles.predList}>
        {preds.map((p) => (
          <View key={p.hours} style={styles.predItem}>
            <Text style={styles.predHour}>{t('pred.next_hours', { hours: p.hours })}</Text>
            <Text style={styles.predLevel}>{p.level}</Text>
            <Text style={styles.predPct}>{p.pct}%</Text>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        {/* replace navigation so we don't accumulate history when the user wants to change the location */}
        <Button title={t('location.change')} onPress={() => router.replace('/map')} />
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
