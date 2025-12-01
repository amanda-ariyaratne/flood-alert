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

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Selected coordinates</Text>
      <Text style={styles.coords}>Latitude: {location.coords.latitude}</Text>
      <Text style={styles.coords}>Longitude: {location.coords.longitude}</Text>

      <View style={styles.actions}>
        <Button title="Change" onPress={() => router.push("/map")} />
        <View style={{ width: 12 }} />
        <Button title="Clear" onPress={() => setLocation(null)} />
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
});
