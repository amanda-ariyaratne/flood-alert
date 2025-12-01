import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import THEME from '../theme';

export default function AppTitle() {
    return (
        <View style={styles.row}>
            <Text style={styles.logoEmoji}>🌊</Text>
            <Text numberOfLines={1} style={styles.title}>FloodAlert</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center' },
    logoEmoji: { fontSize: 18, textAlign: 'center', color: THEME.brand },
    title: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
