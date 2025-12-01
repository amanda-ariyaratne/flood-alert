import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { setAppLanguage } from '../i18n';
import THEME from '../theme';

const LANGS: { code: string; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'si', label: 'සි' },
  { code: 'ta', label: 'த' },
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
      {LANGS.map((l, idx) => {
        const active = current.startsWith(l.code);
        return (
          <TouchableOpacity
            key={l.code}
            onPress={() => onSelect(l.code)}
            style={[
              styles.btn,
              active ? styles.active : styles.inactive,
              // reduce left margin for the first item
              idx === 0 ? { marginLeft: 0 } : {},
            ]}
            accessibilityLabel={`Switch language to ${l.code}`}>
            <Text style={[styles.label, active ? styles.activeLabel : styles.inactiveLabel]}>{l.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  btn: { paddingHorizontal: 10, paddingVertical: 6, marginLeft: 6, borderRadius: 8, minWidth: 36, alignItems: 'center', justifyContent: 'center' },
  inactive: { backgroundColor: 'transparent', borderWidth: 0 },
  // active shows as a brand-colored pill with white text so it stands out on the white card
  active: { backgroundColor: THEME.brand },
  label: { fontSize: 13, fontWeight: '600' },
  inactiveLabel: { color: THEME.brand, opacity: 0.95 },
  activeLabel: { color: '#fff' },
});
