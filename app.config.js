/*
  app.config.js — reads Google Maps API keys from .env and injects into Expo config.
  Usage: create a `.env` (not checked into git) with keys:
    GOOGLE_MAPS_API_KEY_IOS=your_ios_key
    GOOGLE_MAPS_API_KEY_ANDROID=your_android_key

  This file merges with the existing `app.json` and exposes keys to the native builds.
*/
require("dotenv").config();
const appJson = require("./app.json");

const iosKey = process.env.GOOGLE_MAPS_API_KEY_IOS;
const androidKey = process.env.GOOGLE_MAPS_API_KEY_ANDROID;

const expo = { ...(appJson.expo || {}) };

expo.ios = expo.ios || {};
expo.ios.config = expo.ios.config || {};
if (iosKey) expo.ios.config.googleMapsApiKey = iosKey;

expo.android = expo.android || {};
expo.android.config = expo.android.config || {};
expo.android.config.googleMaps = expo.android.config.googleMaps || {};
if (androidKey) expo.android.config.googleMaps.apiKey = androidKey;

module.exports = () => ({ expo });
