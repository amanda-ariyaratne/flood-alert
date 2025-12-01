import { getCurrentPositionAsync, requestForegroundPermissionsAsync } from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import MapView, { MapPressEvent, Marker, Region } from "react-native-maps";

export default function MapScreen() {
  const [marker, setMarker] = useState<{ latitude: number; longitude: number } | null>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const router = useRouter();
  const mapRef = useRef<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await requestForegroundPermissionsAsync();
        if (status !== "granted") return;
        const loc = await getCurrentPositionAsync({ accuracy: 3 });
        const { latitude, longitude } = loc.coords;
        const r: Region = {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setRegion(r);
        setMarker({ latitude, longitude });
        // animate when ref is ready
        if (mapRef.current) {
          mapRef.current.animateToRegion(r, 500);
        }
      } catch (e) {
        console.log("Failed to get current position on map open:", e);
      }
    })();
  }, []);

  const onMapPress = (e: MapPressEvent) => {
    setMarker(e.nativeEvent.coordinate);
    // animate to tapped coord
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: e.nativeEvent.coordinate.latitude,
        longitude: e.nativeEvent.coordinate.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 300);
    }
  };

  const useLocation = () => {
    if (!marker) return;
    router.push({ pathname: "/", params: { lat: String(marker.latitude), lng: String(marker.longitude) } });
  };

  const centerOnCurrent = async () => {
    try {
      const { status } = await requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const loc = await getCurrentPositionAsync({ accuracy: 3 });
      const { latitude, longitude } = loc.coords;
      const r: Region = { latitude, longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 };
      setRegion(r);
      setMarker({ latitude, longitude });
      if (mapRef.current) mapRef.current.animateToRegion(r, 400);
    } catch (e) {
      console.log("Failed to center on current location:", e);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region ?? {
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={onMapPress}
      >
        {marker && <Marker coordinate={marker} />}
      </MapView>

      <View style={styles.footer}>
        <Text style={styles.info}>
          {marker ? `Selected: ${marker.latitude.toFixed(6)}, ${marker.longitude.toFixed(6)}` : "Tap map to select location"}
        </Text>
        <View style={styles.footerButtons}>
          <Button title="Center On Me" onPress={centerOnCurrent} />
          <View style={{ width: 12 }} />
          <Button title="Use This Location" onPress={useLocation} disabled={!marker} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  footer: {
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  info: { marginBottom: 8, textAlign: "center" },
  footerButtons: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
});
