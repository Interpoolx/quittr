# Quittr.app

> 100% Free. 100% Private. Recovery Made Simple.

A privacy-first mobile app designed to help adults overcome pornography addiction through compassionate, evidence-based recovery tools.

![React Native](https://img.shields.io/badge/React_Native-0.81-blue?logo=react)
![Expo](https://img.shields.io/badge/Expo-SDK_54-000020?logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- **🔢 Sobriety Counter** - Real-time tracking with milestone celebrations
- **🆘 Panic Button** - Multi-step intervention during urges
- **📊 Urge Tracking** - Log triggers, intensity, and patterns
- **📓 Daily Journal** - Mood tracking, prompts, and reflection
- **🏆 Achievements** - Gamified motivation with XP and badges
- **🔒 Privacy First** - No account required, all data stored locally

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ 
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- For Android: [Android Studio](https://developer.android.com/studio) with SDK 23+
- For iOS: [Xcode](https://developer.apple.com/xcode/) 14+ (macOS only)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/quittr.git
cd quittr

# Install dependencies
npm install

# Start development server
npx expo start
```

### Running the App

```bash
# Start Expo development server with options
npx expo start

# Run in web browser
npx expo start --web

# Run on Android (requires Android Studio/emulator or connected device)
npx expo start --android

# Run on iOS (macOS with Xcode only)
npx expo start --ios
```

## 📱 Building for Production

### Android APK / AAB

#### Option 1: EAS Build (Recommended - Cloud Build)

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Login to Expo account (create free account at expo.dev)
eas login

# Configure your project for EAS Build
eas build:configure

# Build Android APK (for testing/sideloading)
eas build --platform android --profile preview

# Build Android AAB (for Google Play Store)
eas build --platform android --profile production
```

#### Option 2: Local Build (Requires Android Studio)

```bash
# Generate native Android project
npx expo prebuild --platform android

# Navigate to android folder
cd android

# Build debug APK
./gradlew assembleDebug

# Build release APK (requires signing configuration)
./gradlew assembleRelease

# The APK will be at: android/app/build/outputs/apk/
```

### iOS Build (macOS only)

```bash
# EAS Cloud Build (Recommended)
eas build --platform ios --profile production

# Local Build
npx expo prebuild --platform ios
cd ios
pod install
# Open in Xcode and build
open quittr.xcworkspace
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
APP_ENV=development
ENABLE_ANALYTICS=false
DEBUG_MODE=true
```

### App Configuration

Edit `app.json` for app-specific settings:

```json
{
  "expo": {
    "name": "Quittr",
    "slug": "quittr",
    "version": "1.0.0",
    "android": {
      "package": "app.quittr.recovery"
    },
    "ios": {
      "bundleIdentifier": "app.quittr.recovery"
    }
  }
}
```

### EAS Build Configuration

The `eas.json` file configures build profiles. The `appVersionSource: "local"` field uses version from `app.json`:

```json
{
  "cli": {
    "version": ">= 5.0.0",
    "appVersionSource": "local"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "android": {
        "buildType": "apk"
      },
      "distribution": "internal"
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      },
      "ios": {
        "resourceClass": "m-medium"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### Quick Build Commands

```bash
# Login to Expo (required once)
eas login

# Configure EAS project (required once)
eas build:configure

# Build APK for testing
eas build --profile preview --platform android

# Build AAB for Play Store
eas build --profile production --platform android

# Build for iOS (requires Apple Developer account)
eas build --profile production --platform ios
```

## 📁 Project Structure

```
quittr/
├── app/                    # Expo Router screens
│   ├── (tabs)/             # Tab navigation screens
│   │   ├── index.tsx       # Dashboard (home)
│   │   ├── urges.tsx       # Urge tracking
│   │   ├── panic.tsx       # Emergency panic button
│   │   ├── journal.tsx     # Daily journal
│   │   └── profile.tsx     # Profile & settings
│   └── _layout.tsx         # Root layout with Redux
├── src/
│   ├── constants/          # Colors, typography, layout
│   ├── hooks/              # Custom React hooks
│   ├── store/              # Redux store & slices
│   │   └── slices/         # User, settings, urges, journal, achievements
│   └── types/              # TypeScript interfaces
├── assets/                 # Images, icons, fonts
├── app.json                # Expo configuration
├── package.json            # Dependencies
└── tsconfig.json           # TypeScript config
```

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React Native 0.81 + Expo SDK 54 |
| Language | TypeScript 5.9 |
| Navigation | Expo Router 5.1 |
| State Management | Redux Toolkit + Redux Persist |
| Storage | AsyncStorage (Redux Persist) |
| Styling | React Native StyleSheet |

## 📝 Development Commands

```bash
# Start dev server
npm start

# Run on specific platform
npm run android
npm run ios  
npm run web

# Type checking
npx tsc --noEmit

# Format code
npm run format
```

## 🔐 Privacy & Security

- **No Account Required** - Start using immediately
- **Local Storage Only** - All data stays on your device
- **No Analytics** - Zero tracking or data collection
- **Optional PIN Lock** - Protect with PIN or biometrics
- **App Disguise** - Change app icon and name for privacy

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## ⚠️ Disclaimer

This app is a recovery support tool, not a replacement for professional help. If you're struggling, please seek support from a qualified mental health professional.

**Crisis Resources:**
- National Suicide Prevention Lifeline: 988
- SAMHSA Helpline: 1-800-662-4357
- Crisis Text Line: Text HOME to 741741

---

Built with ❤️ for the recovery community
