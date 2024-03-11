import React, { useEffect, useState } from 'react';
import { View, Image, ActivityIndicator, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function App() {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadedModel, setModel] = useState(null);
  const [leaves, setLeaves] = useState(null);
  const [damagedLeaves, setDamagedLeaves] = useState(null);
  const [fruits, setFruits] = useState(null);

  //Load Decision Tree model
  useEffect(() => {
    async function loadModel() {
      try{
        await tf.ready();
        await tf.setBackend('rn-webgl');
        const loadedModel = await tf.loadLayersModel('https://firebasestorage.googleapis.com/v0/b/coffee-prediction-2a261.appspot.com/o/model.json?alt=media&token=46b463b7-cf20-4767-99dc-d2d5e35d8304','https://firebasestorage.googleapis.com/v0/b/coffee-prediction-2a261.appspot.com/o/weights.bin?alt=media&token=54901c53-bea4-4fd1-be89-f6674c1dac5e');
        setModel(loadedModel);
        console.log("Model loaded!")
      } catch (error) {
        console.error('Error initializing TensorFlow.js:', error);
      }
    }

    loadModel();
  }, []);

  //Take picture and call imgur API
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access camera was denied.');
    } else {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        base64: true,
        quality: 1,
      });
      setLoading(true);
      if (!result.canceled) {
        setImage(result.assets[0].base64);
        uploadToImgur(result.assets[0].base64);
      }else{
        setLoading(false);
      }
    }
  };

  //Upload image to imgur
  const uploadToImgur = async (base64Image) => {
    try {
      const apiUrl = 'https://api.imgur.com/3/image';
      const apiKey = '3217489148371163b751bd40306ada1e31944721'; 
  
      const headers = {
        Authorization: `Bearer ${apiKey}`,
      };
  
      const form = new FormData();
      form.append('image', base64Image);
  
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: form,
      });
  
      const data = await response.json();
  
      if (data.success) {
        setImage(data.data.link);
        roboflowInference(data.data.link)
        
      } else {
        throw new Error('Failed to upload image to Imgur');
      }
    } catch (error) {
      console.error('Error uploading image to Imgur:', error);
      throw error;
    }
  };

  //Make leaves, damaged leaves and fruit inferences
  const roboflowInference = async (ImgLink) => {
    console.log(ImgLink)
    try {
      const apiUrl = 'https://detect.roboflow.com/coffee-leaf-detection/4';
      const apiKey = '9r1n3XfFDlZhbBnUfFTk';

      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };

      const params = {
        api_key: apiKey,
        image: ImgLink
      };

      const formData = new FormData();
      formData.append('data', ImgLink);

      const requestConfig = {
        method: 'POST',
        headers: Platform.OS === 'android' ? headers : { ...headers, 'Content-Type': 'multipart/form-data' },
      };

      fetch(`${apiUrl}?${new URLSearchParams(params)}`, requestConfig)
        .then(response => response.json())
        .then(data => {
          setPrediction(data);
        })
        .catch(error => {
          console.log(error.message);
        });
    } catch (error) {
      console.error('Error predicting image:', error);
    }
  };

  useEffect(()=> {
    console.log(prediction)
    if(prediction?.predictions){
      const countInferences = async () => {
          let leavesCountTemp = 0;
          let damagedLeavesCountTemp = 0;
          let fruitCountTemp = 0;
  
          prediction.predictions.forEach((prediction) => {
            if (prediction.confidence > 0.65) {
              switch (prediction.class) {
                case 'h':
                  leavesCountTemp += 1;
                  break;
                case 'hd':
                  damagedLeavesCountTemp += 1;
                  break;
                case 'f':
                  fruitCountTemp += 1;
                  break;
                default:
                  break;
              }
            }
          });
  
          // Update state with counts
          setLeaves(leavesCountTemp);
          console.log(`Leaves count: ${leavesCountTemp}`)
          setDamagedLeaves(damagedLeavesCountTemp);
          console.log(`Dead count: ${damagedLeavesCountTemp}`)
          setFruits(fruitCountTemp);
          console.log(`Fruit count: ${fruitCountTemp}`)
      };
      countInferences();
      
    }
    setLoading(false);
  }, [prediction])

  useEffect(()=>{
    if(prediction){
      makePrediction(leaves, damagedLeaves)
    }
  }, [fruits])

  const makePrediction = async (leaves, deadLeaves) => {
    const model = loadedModel;
  
    // Preprocess the input data if needed
    const inputData = tf.tensor2d([[leaves, deadLeaves]]);
    
    // Make prediction
    const prediction = model.predict(inputData);
  
    // Get the result
    const result = prediction.dataSync()[0];
  
    // Update your React component state or do something with the result
    const parsedResult = parseInt(result)
    const roundedResult = parsedResult.toFixed(1)
    setFruits(roundedResult)
    console.log(`Prediction ${roundedResult}`)
    // Dispose the tensors to free up resources
    inputData.dispose();
    prediction.dispose();
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#9CC78B', '#aa92a8']} // Green to #aa92a8 gradient
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <Image
        source={require('./assets/background.png')}
        style={styles.imageOverlay}
        resizeMode="repeat"
      />
      <View style={styles.banner}>
        <Text style={styles.bannerText}>Coffee App Predictor</Text>
      </View>
      <View style={styles.content}>
        {image && <Image source={{ uri: image }} style={styles.mainImage} />}
        <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
          <MaterialIcons name="photo-camera" size={24} color="white" />
        </TouchableOpacity>
        {loading && (
          <ActivityIndicator  size="large" color="#0000ff" />
        )}
        {!loading && fruits && leaves && damagedLeaves &&(
          <View>
            <Text style={styles.predictionText}>Leaves: {leaves} - Damaged leaves: {damagedLeaves}</Text>
            <Text style={styles.predictionText}>Predicted fruit production {fruits}</Text>
          </View>
        )}
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  banner: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  predictionText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    margin: 10
  },
  bannerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageOverlay: {
    position: 'absolute',
    width: '100%', // Set width to cover the entire screen
    height: '100%', // Set height to cover the entire screen
    opacity: 0.3, // Adjust opacity as needed
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainImage: {
    width: '80%', // Set width to cover the entire screen
    height: '70%', // Set height to cover the entire screen
    marginBottom:20,
  },
  cameraButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 50,
    padding: 15,
    margin: 10
  },
});