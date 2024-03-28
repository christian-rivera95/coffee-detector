import React, { useEffect, useState } from 'react';
import { View, Image, ActivityIndicator, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function App() {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [leaves, setLeaves] = useState(null);
  const [damagedLeaves, setDamagedLeaves] = useState(null);
  const [fruits, setFruits] = useState(null);

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

      if (!result.cancelled && result.assets) {
        uploadToImgbb(result.assets[0].base64);
      } else {
        setLoading(false);
      }
    }
  };

  const pickImageFromGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access gallery was denied.');
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        base64: true,
        quality: 1,
      });

      if (!result.cancelled && result.assets) {
        uploadToImgbb(result.assets[0].base64);
      } else {
        setLoading(false);
      }
    }
  };

  const uploadToImgbb = async (base64Image) => {
    try {
      const formData = new FormData();
      formData.append('image', base64Image);

      fetch('https://api.imgbb.com/1/upload?key=e39a11a3661e282d762593c2bcfee657', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          setImage(data.data.url);
          roboflowInference(data.data.url);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    } catch (error) {
      console.error('Error uploading image to Imgbb:', error);
    }
  };

  const roboflowInference = async (ImgLink) => {
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

  useEffect(() => {
    if (prediction?.predictions) {
      const countInferences = async () => {
        let leavesCountTemp = 0;
        let damagedLeavesCountTemp = 0;

        prediction.predictions.forEach((prediction) => {
          if (prediction.confidence > 0.65) {
            switch (prediction.class) {
              case 'h':
                leavesCountTemp += 1;
                break;
              case 'hd':
                damagedLeavesCountTemp += 1;
                break;
              default:
                break;
            }
          }
        });

        setLeaves(leavesCountTemp);
        setDamagedLeaves(damagedLeavesCountTemp);
      };
      countInferences();
    }
    setLoading(false);
  }, [prediction]);

  useEffect(() => {
    if (leaves !== null && damagedLeaves !== null) {
      makePrediction(leaves, damagedLeaves);
    }
  }, [leaves, damagedLeaves]);

  const makePrediction = async (leaves, damagedLeaves) => {
    if (leaves !== null) {
      fetch('http://kurisu95.pythonanywhere.com/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leaves: leaves,
          damaged_leaves: damagedLeaves,
        }),
      })
        .then(response => response.json())
        .then(data => {
          const roundedNumber = Math.round(data.prediction);
          setFruits(roundedNumber);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    } else {
      setFruits(0);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#9CC78B', '#aa92a8']}
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
        <View style={styles.iconContainer}>
          <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
            <MaterialIcons name="photo-camera" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.cameraButton} onPress={pickImageFromGallery}>
            <MaterialIcons name="image" size={24} color="white" />
          </TouchableOpacity>
        </View>
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
        {!loading && fruits !== undefined && leaves !== undefined && damagedLeaves !== undefined && prediction && (
          <View>
            <Text style={styles.predictionText}>Leaves: {leaves} - Damaged leaves: {damagedLeaves}</Text>
            <Text style={styles.predictionText}>Predicted fruit production: {fruits}</Text>
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
    margin: 10,
  },
  bannerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.3,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainImage: {
    width: '80%', 
    height: '70%',
    marginBottom: 20,
  },
  cameraButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 50,
    padding: 15,
    margin: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '50%',
  },
});