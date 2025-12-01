import { useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import * as Location from "expo-location";

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const getLocation = async () => {
    setLoading(true);
    setErrorMsg("");
    setLocation(null);

    // Request permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied.");
      setLoading(false);
      return;
    }

    try {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      setLocation(loc);
    } catch (err) {
      setErrorMsg("Failed to get location");
      console.log(err);
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* Action Button */}
      <TouchableOpacity style={styles.button} onPress={getLocation}>
        <Text style={styles.buttonText}>Get My Location</Text>
      </TouchableOpacity>

      {/* Loading Spinner */}
      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

      {/* Error */}
      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

      {/* Coordinates */}
      {location && (
        <View style={{ marginTop: 20 }}>
          <Text style={styles.coords}>Latitude: {location.coords.latitude}</Text>
          <Text style={styles.coords}>Longitude: {location.coords.longitude}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  coords: {
    fontSize: 16,
    marginTop: 4,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
});
