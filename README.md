# Coffee Detector App

## Project Overview

The Coffee Detector App is a mobile application developed using React Native and Expo framework. It allows users to capture images of coffee plants, detect the presence of coffee leaves, determine the number of leaves and damaged leaves using the Roboflow API, and predict fruit production based on the detected leaves with the help of Scikit-learn Random Forest Regressor.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js:** Ensure you have Node.js installed, preferably version 20.11.1. You can download it from [here](https://nodejs.org/).
- **Python:** Ensure you have Python installed, preferably version 3.11.8. You can download it from [here](https://www.python.org/downloads/).


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

![Wireframe Flowchart Whiteboard](https://github.com/christian-rivera95/coffee-detector/assets/11074768/1aabbe9b-3325-492b-952a-d148ab48a294)



## Changing EAS Project ID Instructions

If the next developer doesn't have access to your EAS project and needs to build a new APK, they will have to create a new project on their EAS account and get the ID. Follow these steps to change the EAS project ID:

1. **Create a New EAS Project:**
   - The next developer needs to log in to their EAS account and create a new project.

2. **Get the Project ID:**
   - Once the new project is created, the next developer needs to find the project ID. This ID is usually displayed in the project settings or dashboard.

3. **Install EAS CLI:**
   - If the developer doesn't have EAS CLI installed, they need to run the following command in their terminal:
     ```
     sudo npm install --global eas-cli
     ```

4. **Initialize EAS with New Project ID:**
   - With EAS CLI installed, the developer needs to run the following command in the project directory, replacing `<Your Project ID>` with the actual project ID obtained in step 2:
     ```
     eas init --id <Your Project ID>
     ```

5. **Follow the Prompts:**
   - The `eas init` command will prompt the developer to authenticate and configure the project settings. They should follow the prompts to complete the initialization.

6. **Verify Configuration:**
   - Once the initialization is complete, the developer should verify that the project ID has been updated correctly by checking the project configuration on app.json.
     
      ```
      "extra": {
         "eas": {
           "projectId": "<Your Project ID>"
         }
       },
       "owner": "<Your Expo Username>"
      ```

8. **Build APK:**
   - With the new project configured, the developer can now proceed to build the APK using EAS CLI as usual.

That's it! The EAS project ID has been successfully changed, and the next developer can continue working on the project without any issues.


## Building on EAS

1. **Initialize EAS Build:**
   - `npx expo login`
<img width="630" alt="expo login" src="https://github.com/christian-rivera95/coffee-detector/assets/11074768/670f1d04-33a0-463d-ad52-79d6f77cd404">

2. **Configure EAS Build Options (Optional):**
   - If needed, you can configure build options such as build profiles, credentials, etc., in the `eas.json` file generated in your project directory.

3. **Start the Build Process:**
   - `eas build -p android`

4. **Monitor Build Progress:**
   - Once the build is initiated, you can monitor its progress by visiting the EAS dashboard or using the command-line interface.

5. **Retrieve Build Artifacts:**
   - After the build is completed successfully, you can download the generated artifacts from the EAS dashboard or using the command-line interface.

6. **Testing the Built Application:**
   - Install the built application on your device for testing purposes.

7. **Terminating the EAS Build Process:**
   - Once you've obtained the necessary build artifacts and completed testing, you can terminate the EAS build process.
