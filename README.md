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

`npx react-native bundle --platform android --dev false --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/ --entry-file index.js`

### Building For Release on iOS

First, build the JavaScript bundle

`npx react-native bundle --platform ios --dev false --bundle-output ios/com.insanityradio.player_v2/main.jsbundle`

Next, edit `AppDelegate.m`. You must swap over comments on the lines starting `jsCodeLocation = `, such that the bottom one is uncommented. 

Third, with the application open in Xcode and go to Product, Build

