# Coffee Detector App

## Project Overview

The Coffee Detector App is a mobile application developed using React Native and Expo framework. It allows users to capture images of coffee plants, detect the presence of coffee leaves, determine the number of leaves and damaged leaves using the Roboflow API, and predict fruit production based on the detected leaves with the help of Scikit-learn Random Forest Regressor.

## Setup Instructions

1. **Clone the Repository:**
   - `git clone https://github.com/christian-rivera95/coffee-detector.git`

2. **Navigate to Project Directory:**
   - `cd coffee-detector`

3. **Install Dependencies:**
   - `npm install`

4. **Install Expo CLI (if not already installed):**
   - `npm install -g expo-cli`

5. **Install EAS CLI (Expo Application Services):**
   - `npm install -g eas-cli`

6. **Ensure Android SDK is Installed:**
   - Make sure you have the Android SDK installed on your machine if you want to run the application on a connected Android device. You can download it from [here](https://developer.android.com/studio#downloads).

## Running the Application

1. **Start the Development Server:**
   - `npm start`

2. **Choose a Platform:**
   - **Android:** Press `a` in the terminal to open the app in an Android emulator or connected Android device.
   - **iOS:** Press `i` to open the app in an iOS simulator (MacOS only) or scan the QR code with the Expo Go app on your iOS device.
   - **Web:** Press `w` to open the app in a web browser.

## Testing the Application

- Grant camera access when prompted.
- Use the camera button to capture images.

## Building on EAS

1. **Initialize EAS Build:**
   - `npx eas-cli login`

2. **Configure EAS Build Options (Optional):**
   - If needed, you can configure build options such as build profiles, credentials, etc., in the `eas.json` file generated in your project directory.

3. **Start the Build Process:**
   - `eas build -p android --profile preview`

4. **Monitor Build Progress:**
   - Once the build is initiated, you can monitor its progress by visiting the EAS dashboard or using the command-line interface.

5. **Retrieve Build Artifacts:**
   - After the build is completed successfully, you can download the generated artifacts from the EAS dashboard or using the command-line interface.

6. **Testing the Built Application:**
   - Install the built application on your device for testing purposes.

7. **Terminating the EAS Build Process:**
   - Once you've obtained the necessary build artifacts and completed testing, you can terminate the EAS build process.
