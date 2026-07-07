# Running Dompetku

## Development (Expo Go)

Cara tercepat — tidak butuh Android SDK.

```bash
npx expo start
```

Scan QR code dengan app **Expo Go** di HP Android/iOS.

---

## Build APK — EAS Build (Cloud, No SDK)

Tidak butuh install Android SDK. Build dijalankan di cloud Expo.

```bash
# Install EAS CLI
npm install -g eas-cli

# Login ke Expo account (gratis)
eas login

# Build APK preview
eas build -p android --profile preview
```

Download APK dari link yang diberikan setelah build selesai.

---

## Build Lokal — Android SDK Required

Butuh Android Studio + SDK terinstall.

```bash
# 1. Install Android Studio
#    https://developer.android.com/studio
#    Jalankan wizard → pilih Standard → tunggu SDK download selesai

# 2. Set environment variable — JANGAN pisah PATH jadi dua baris
export ANDROID_HOME=$HOME/Android/Sdk
export JAVA_HOME=/home/handrawan/Desktop/Application/android-studio/jbr
export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$JAVA_HOME/bin
```

Tambahkan 3 baris di atas ke `~/.bashrc`, lalu:

```bash
source ~/.bashrc
```

```bash
# 3. Verifikasi
java -version
adb --version

# 4. Buat emulator (AVD)
#    Android Studio → Tools → Device Manager → Create Device
#    Pilih: Pixel 8 → API 35 (dengan Google Play Store) → Finish → ▶ Start

# 5. Pastikan emulator running
adb devices
# Output: emulator-5554   device

# 6. Run
npx expo run:android
```

### Error: spawn adb ENOENT

`ANDROID_HOME` belum di-set. Ikuti langkah 2 di atas.

### Error: JAVA_HOME is not set

`JAVA_HOME` belum di-set. Gunakan JDK bawaan Android Studio di `~/Desktop/Application/android-studio/jbr`.

### Error: PATH rusak / perintah tidak ditemukan

Terjadi jika `export PATH=$JAVA_HOME/bin` tanpa `$PATH:` di depannya — ini **overwrite** seluruh PATH.

Fix darurat (tanpa restart terminal):
```bash
export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
```

Lalu edit `~/.bashrc` dan pastikan PATH hanya ada **satu baris** yang benar:
```bash
export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$JAVA_HOME/bin
```

### Error: No Android connected device found

Emulator belum running. Buka Device Manager di Android Studio → klik ▶ pada AVD → tunggu booting.

---

## EAS Build Profiles (eas.json)

Buat file `eas.json` di root project:

```json
{
  "cli": {
    "version": ">= 16.0.0"
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
      }
    }
  }
}
```

| Profile | Output | Kegunaan |
|---------|--------|----------|
| `preview` | APK | Test di HP langsung |
| `production` | AAB | Upload ke Play Store |
