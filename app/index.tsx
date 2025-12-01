import type { LocationObject } from "expo-location";
import { Accuracy, getCurrentPositionAsync, requestForegroundPermissionsAsync } from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Toast from "../src/components/Toast";
import { useLocationContext } from "../src/contexts/LocationContext";

export default function HomeScreen() {
    const { location, setLocation } = useLocationContext();
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [toastMessage, setToastMessage] = useState("");
    const [toastVisible, setToastVisible] = useState(false);
    const router = useRouter();
    const params = useLocalSearchParams();
    const appliedParamsRef = useRef(false);

    useEffect(() => {
        if (appliedParamsRef.current) return;
        const latParam = params.lat as string | undefined;
        const lngParam = params.lng as string | undefined;
        if (latParam && lngParam) {
            const lat = parseFloat(latParam);
            const lng = parseFloat(lngParam);
            if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
                const loc: LocationObject = {
                    coords: {
                        latitude: lat,
                        longitude: lng,
                        altitude: null,
                        accuracy: null,
                        altitudeAccuracy: null,
                        heading: null,
                        speed: null,
                    },
                    timestamp: Date.now(),
                };
                // persist into context so it survives route replace
                setLocation(loc);
                appliedParamsRef.current = true;
                // show a quick toast so user sees location was applied
                setToastMessage(`Location selected: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
                setToastVisible(true);
                // clear params from URL without losing the persisted location
                router.replace("/");
            }
        }
    }, [params.lat, params.lng]);

    // auto-hide toast after a short delay
    useEffect(() => {
        if (!toastVisible) return;
        const t = setTimeout(() => setToastVisible(false), 3000);
        return () => clearTimeout(t);
    }, [toastVisible]);

    const getLocation = async () => {
        setLoading(true);
        setErrorMsg("");
        setLocation(null);

        // Request permission
        const { status } = await requestForegroundPermissionsAsync();
        if (status !== "granted") {
            setErrorMsg("Permission to access location was denied.");
            setLoading(false);
            return;
        }

        try {
            const loc = await getCurrentPositionAsync({
                accuracy: Accuracy.Highest,
            });
            setLocation(loc);
        } catch (err) {
            setErrorMsg("Failed to get location");
            console.log(err);
        }

        setLoading(false);
    };

    const clearLocation = () => {
        setLocation(null);
        setErrorMsg("");
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Toast message={toastMessage} visible={toastVisible} />
            {/* Action Button */}
            <TouchableOpacity
                style={styles.button}
                onPress={location ? clearLocation : getLocation}
            >
                <Text style={styles.buttonText}>
                    {location ? "Clear Location" : "Get My Location"}
                </Text>
            </TouchableOpacity>

            {/* Open Map Button */}
            <TouchableOpacity
                style={styles.mapButton}
                onPress={() => router.push("/map")}
            >
                <Text style={styles.buttonText}>Pick On Map</Text>
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
    mapButton: {
        marginTop: 12,
        backgroundColor: "#34C759",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
    },
});
