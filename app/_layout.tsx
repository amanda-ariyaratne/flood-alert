import { Stack } from "expo-router";
import { LocationProvider } from "../src/contexts/LocationContext";
// initialize i18n early so translations are available for screens
import LanguageSwitcher from "../src/components/LanguageSwitcher";
import "../src/i18n";

export default function RootLayout() {
  return (
    <LocationProvider>
      <Stack
        screenOptions={{
          // show a simple header and place the language switcher on the right
          headerShown: true,
          headerTitle: '',
          // hide default back button on the left to keep header clean
          headerLeft: () => null,
          headerRight: () => <LanguageSwitcher />,
        }}
      />
    </LocationProvider>
  );
}
