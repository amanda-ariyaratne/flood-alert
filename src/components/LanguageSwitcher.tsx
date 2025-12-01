import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { setAppLanguage } from '../i18n';

const LANGS: { code: string; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'si', label: 'SI' },
  { code: 'ta', label: 'TA' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.language || 'en';

  const onSelect = async (lang: string) => {
    try {
      await setAppLanguage(lang);
    } catch (e) {
      // ignore
    }
  };

  return (
    <View style={styles.row}>
      {LANGS.map((l) => {
        const active = current.startsWith(l.code);
        return (
          <TouchableOpacity
            key={l.code}
            onPress={() => onSelect(l.code)}
            style={[styles.btn, active && styles.active]}
            accessibilityLabel={`Switch language to ${l.code}`}>
            <Text style={[styles.label, active && styles.activeLabel]}>{l.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingRight: 8 },
  btn: { paddingHorizontal: 8, paddingVertical: 6, marginLeft: 6, borderRadius: 6, backgroundColor: 'transparent' },
  active: { backgroundColor: '#007AFF' },
  label: { fontSize: 12, color: '#007AFF', fontWeight: '600' },
  activeLabel: { color: '#fff' },
});
