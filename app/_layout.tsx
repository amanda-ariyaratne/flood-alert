import { Stack } from "expo-router";
import { LocationProvider } from "../src/contexts/LocationContext";

export default function RootLayout() {
  return (
    <LocationProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </LocationProvider>
  );
}
