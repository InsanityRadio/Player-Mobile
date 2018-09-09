# <img src="https://raw.githubusercontent.com/InsanityRadio/OnAirController/master/doc/headphones_dark.png" align="left" height=48 /> Player

This repository contains the code for the new Insanity Radio iOS and Android app.

It is to be developed independently of web-player. This is because web-player does not compile to native code, and the HTML5 performance on devices is bad.

## Installing

In the root directory, run `npm install`.

To build for iOS and Android platforms, you need either Xcode or Android Studio installed.  

### Debugging on iOS

`npx react-native run-ios`

### Debugging on Android

`npx react-native run-android`


### Building For Release on Android

Make sure you have some sort of app signing key set-up. For Insanity, this should be the keystore we've used since 1.0, as the certificate chains need to match or something.

First, build the JavaScript bundle

`npx react-native bundle --platform android --dev false --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/ --entry-file index.js`

Next, make sure you've edited `~/.gradle/gradle.properties` and filled in the following:

	INSANITY_RELEASE_STORE_FILE=/path/to/my-release-key.keystore
	INSANITY_RELEASE_KEY_ALIAS=my-key-alias
	INSANITY_RELEASE_STORE_PASSWORD=*****
	INSANITY_RELEASE_KEY_PASSWORD=*****


You can get these values from the Head of Computing if you need them for any reason. 

Finally, build and sign the APK.

`bash -c 'cd android && ./gradlew assembleRelease'`


### Building For Release on iOS

First, build the JavaScript bundle

`npx react-native bundle --platform ios --dev false --bundle-output ios/com.insanityradio.player_v2/main.jsbundle --entry-file index.js`

Next, edit `AppDelegate.m`. You must swap over comments on the lines starting `jsCodeLocation = `, such that the bottom one is uncommented. 

Third, with the application open in Xcode, go to Product, Build. This will build the app for release. 

