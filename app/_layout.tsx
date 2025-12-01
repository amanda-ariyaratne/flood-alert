import { Stack } from "expo-router";
import { LocationProvider } from "../src/contexts/LocationContext";
// initialize i18n early so translations are available for screens
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppTitle from "../src/components/AppTitle";
import LanguageSwitcher from "../src/components/LanguageSwitcher";
import "../src/i18n";
import THEME from "../src/theme";

export default function RootLayout() {
  const insets = useSafeAreaInsets();
  const headerHeight = Platform.OS === 'ios' ? 44 : 56;
  const floatingTop = insets.top + headerHeight + 6; // small gap below header

  return (
    <LocationProvider>
      <View style={styles.container}>
        <Stack
          screenOptions={{
            // branded header
            headerShown: true,
            headerStyle: { backgroundColor: THEME.brand },
            headerTitle: () => <AppTitle />,
            headerLeft: () => null,
            headerTitleAlign: 'left',
            headerTintColor: '#fff',
          }}
        />
        {/* Floating language switcher positioned just below the native header on the right */}
        <View style={[styles.floatingLang, { top: floatingTop }]} pointerEvents="box-none">
          <LanguageSwitcher />
        </View>
      </View>
    </LocationProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  floatingLang: {
    position: 'absolute',
    right: 12,
    top: Platform.select({ ios: 52, android: 48, default: 50 }),
    zIndex: 1000,
    // card style for contrast over the header/map
    backgroundColor: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: 12,
    // shadow (iOS)
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    // elevation for Android
    elevation: 6,
  },
});
