import type { LocationObject } from "expo-location";
import { getCurrentPositionAsync, requestForegroundPermissionsAsync } from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { MapPressEvent, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { useLocationContext } from "../src/contexts/LocationContext";
import THEME from "../src/theme";

export default function MapScreen() {
    const { t } = useTranslation();
    const [marker, setMarker] = useState<{ latitude: number; longitude: number } | null>(null);
    const [region, setRegion] = useState<Region | null>(null);
    const router = useRouter();
    const mapRef = useRef<any>(null);
    const { setLocation } = useLocationContext();

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
        const center = region ?? marker;
        if (!center) return;
        const loc: LocationObject = {
            coords: {
                latitude: center.latitude,
                longitude: center.longitude,
                altitude: null,
                accuracy: null,
                altitudeAccuracy: null,
                heading: null,
                speed: null,
            },
            timestamp: Date.now(),
        };
        // persist into context then navigate to the location screen
        // use replace instead of push so the map doesn't accumulate in the navigation stack
        setLocation(loc);
        router.replace("/location");
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
                provider={PROVIDER_GOOGLE}
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
                <Text style={styles.info}>{t('map.hint')}</Text>
                <View style={styles.footerButtons}>
                    <TouchableOpacity onPress={centerOnCurrent} style={styles.secondaryButton}>
                        <Text style={styles.secondaryLabel}>{t('map.center_on_me')}</Text>
                    </TouchableOpacity>
                        <View style={{ width: 12 }} />
                        <TouchableOpacity
                            onPress={useLocation}
                            disabled={!region}
                            style={[styles.primaryButton, !region && styles.disabled]}>
                            <Text style={styles.primaryLabel}>{t('map.show_forecasts')}</Text>
                        </TouchableOpacity>
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
    primaryButton: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: THEME.brand,
    },
    primaryLabel: { color: '#fff', fontWeight: '700' },
    disabled: { opacity: 0.5 },
    secondaryButton: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: 'transparent',
        borderWidth: 0,
    },
    secondaryLabel: { color: THEME.brand, fontWeight: '600' },
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
