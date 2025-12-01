**Flood Alert — README**

- **Project**: Flood Alert — a minimal Expo app that lets users pick a location on a map and shows (mock) flood predictions for that point.

**Quick Start**
- **Clone**: `git clone <repo-url>`
- **Install dependencies**: `npm install` (or `yarn` if you prefer)
- **Create env**: copy `./.env.example` → `./.env` and fill in your Google Maps API keys.

**Files You Should Know**
- **Map screen**: `app/map.tsx` — main screen (map is the app entry) with a centered crosshair and "Use This Location" action.
- **Location screen**: `app/location.tsx` — displays the picked coordinates and dummy flood predictions.
- **Location state**: `src/contexts/LocationContext.tsx` — shared location store used across screens.
- **Toast**: `src/components/Toast.tsx` — small animated confirmation banner.
- **Config loader**: `app.config.js` — reads `.env` and injects `GOOGLE_MAPS_API_KEY_IOS` and `GOOGLE_MAPS_API_KEY_ANDROID` into the Expo config at build time.
- **Example env**: `.env.example` — variables to fill (`GOOGLE_MAPS_API_KEY_IOS`, `GOOGLE_MAPS_API_KEY_ANDROID`).

**Local Dev (Expo)**
- Start the developer server:

```
npx expo start
```

- Open on Android device/emulator: scan QR or press `a` in the terminal.
- Note: On Android, Google Maps will typically render in Expo Go when the API key is configured in the project config.
- On iOS, Expo Go uses Apple Maps — to test Google Maps on iOS you must build a custom dev client or a standalone app (see EAS section).

**Google Maps keys & setup**
- In Google Cloud Console enable the following APIs:
   - Maps SDK for Android
   - Maps SDK for iOS
- Create API keys and optionally restrict them by package name / bundle id and SHA-1 fingerprint.
- Add keys to `.env` (do not commit `.env`):

```
GOOGLE_MAPS_API_KEY_IOS=your_ios_key
GOOGLE_MAPS_API_KEY_ANDROID=your_android_key
```

- `app.config.js` will read those values and inject them into the Expo config at build time.

**Testing Google Maps on iOS (EAS dev client)**
- Install EAS CLI: `npm i -g eas-cli`
- Log in: `eas login`
- Create a minimal `eas.json` (if you don't have one) or use the default.
- Build a development client:

```
npx eas build --profile development --platform ios
```

- Install the resulting dev client on your device to test Google Maps.

**Native (bare) notes**
- If you eject to bare React Native you must follow `react-native-maps` platform install steps:
   - `pod install` in `ios/` and add Google Maps SDK entry in `AppDelegate` (or rely on `app.json` in managed builds).
   - Add Android `meta-data` entry in `AndroidManifest.xml` for `com.google.android.geo.API_KEY` if you are not using Expo-managed config injection.

**Commands**
- Start dev server: `npx expo start`
- Type-check: `npx tsc --noEmit`
- Lint: `npm run lint` (if configured)
- Build for iOS (EAS): `npx eas build --platform ios --profile <profile>`
- Build for Android (EAS): `npx eas build --platform android --profile <profile>`

**Debugging tips**
- Watch console output from your device using the Expo dev tools or remote JS debug console.
- Use `console.log` in `app/map.tsx` (where selection is made) and `app/location.tsx` to confirm data flow.
- If tiles do not show, check Google Cloud console for API errors and ensure keys are not restricted incorrectly.

**Next steps / suggestions**
- Replace the dummy predictions with a real forecasting API.
- Persist selected location using `AsyncStorage` if you want it to survive app restarts.
- Add copy-to-clipboard and share actions on the location screen.

If you want, I can also:
- Add a ready-to-use `eas.json` (development profile) and a short checklist to build a dev client for iOS,
- Or add persistence (AsyncStorage) for the picked location.

Enjoy — tell me which next step you'd like me to implement.
