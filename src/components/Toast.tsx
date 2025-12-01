import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

type Props = {
    message: string;
    visible: boolean;
};

export default function Toast({ message, visible }: Props) {
    const anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.spring(anim, { toValue: 1, useNativeDriver: true }).start();
            const t = setTimeout(() => {
                Animated.timing(anim, { toValue: 0, duration: 250, useNativeDriver: true }).start();
            }, 2500);
            return () => clearTimeout(t);
        }
    }, [visible, anim]);

    if (!visible) return null;

    return (
        <Animated.View
            pointerEvents="none"
            style={[
                styles.container,
                {
                    transform: [
                        {
                            translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-24, 0] }),
                        },
                    ],
                    opacity: anim,
                },
            ]}
        >
            <View style={styles.inner}>
                <Text style={styles.text}>{message}</Text>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 48,
        left: 16,
        right: 16,
        alignItems: "center",
        zIndex: 1000,
    },
    inner: {
        backgroundColor: "rgba(0,0,0,0.8)",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    text: { color: "#fff" },
});
