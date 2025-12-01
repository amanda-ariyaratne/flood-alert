import { getCurrentPositionAsync, requestForegroundPermissionsAsync } from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import MapView, { MapPressEvent, Region } from "react-native-maps";

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

    // Keep the marker in the center as the user moves the map
    const onRegionChangeComplete = (r: Region) => {
        setRegion(r);
        // update marker to the center of the visible map
        setMarker({ latitude: r.latitude, longitude: r.longitude });
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
                onRegionChangeComplete={onRegionChangeComplete}
            />

            {/* Centered crosshair overlay - fixed while the map moves */}
            <View pointerEvents="none" style={styles.crosshairContainer}>
                <View style={styles.crosshairOuter} />
                <View style={styles.crosshairInner} />
            </View>

            <View style={styles.footer}>
                <Text style={styles.info}>
                    {region ? `Selected: ${region.latitude.toFixed(6)}, ${region.longitude.toFixed(6)}` : "Move map to select location"}
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
    crosshairContainer: {
        position: "absolute",
        top: "50%",
        left: "50%",
        width: 0,
        height: 0,
        transform: [{ translateX: -12 }, { translateY: -12 }],
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
    },
    crosshairOuter: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: "rgba(0,0,0,0.35)",
        backgroundColor: "rgba(255,255,255,0.9)",
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
    },
    crosshairInner: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#007AFF",
        position: "absolute",
    },
});
