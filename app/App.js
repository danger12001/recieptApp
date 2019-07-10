import React from "react";
import {  View, TouchableOpacity, ImageBackground, Text } from "react-native";
import { RNCamera as Camera } from "react-native-camera";
import RNTextDetector from "react-native-text-detector";

import style, { screenHeight, screenWidth } from "./styles";

const PICTURE_OPTIONS = {
  quality: 1,
  fixOrientation: true,
  forceUpOrientation: true
};
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      image: null,
      error: null,
      visionResp: []
    };
    this.camera = null;
  }

  takePicture = async camera => {
    this.setState({
      loading: true
    });
    try {
      const data = camera.takePictureAsync(PICTURE_OPTIONS).then((data) => {
        console.log(data)
        this.setState(
          {
            image: data.uri
          },
          () => {
            console.log(data.uri);
            this.processImage(data.uri, {
              height: data.height,
              width: data.width
            });
          }
        );
      }).catch((err) => {
        alert('error', err)
      });
    } catch (e) {
      console.warn(e);
      this.reset(e);
    }
  };

  processImage = async (uri, imageProperties) => {
    RNTextDetector.detectFromUri(uri).then((res) => {
      console.log(res)
    });

    console.log(visionResp);
    if (!(visionResp && visionResp.length > 0)) {
      throw "UNMATCHED";
    }
    this.setState({
      visionResp: this.mapVisionRespToScreen(visionResp, imageProperties)
    });
  };

  mapVisionRespToScreen = (visionResp, imageProperties) => {
    const IMAGE_TO_SCREEN_Y = screenHeight / imageProperties.height;
    const IMAGE_TO_SCREEN_X = screenWidth / imageProperties.width;

    return visionResp.map(item => {
      return {
        ...item,
        position: {
          width: item.bounding.width * IMAGE_TO_SCREEN_X,
          left: item.bounding.left * IMAGE_TO_SCREEN_X,
          height: item.bounding.height * IMAGE_TO_SCREEN_Y,
          top: item.bounding.top * IMAGE_TO_SCREEN_Y
        }
      };
    });
  };


  render() {
    return (
      <View style={{backgroundColor: 'black'}}>
        
        {!this.state.image ? (
         <View style={style.cameraContainer}>
         <Camera
           ref={(ref) => { this.camera = ref }}
           style={style.camera}
           captureAudio={false}
           flashMode={Camera.Constants.FlashMode.on}
           type={Camera.Constants.Type.back} />
         <View style={style.buttonContainer}>
                 <TouchableOpacity
                   onPress={() => this.takePicture(this.camera)}
                   style={style.button}
                 />
           </View>
       </View>
        ) : null}
        {this.state.image ? (
          <ImageBackground
            source={{ uri: this.state.image }}
            style={style.imageBackground}
            key="image"
            resizeMode="cover"
          >
            {this.state.visionResp.map(item => {
              return (
                <TouchableOpacity
                  style={[style.boundingRect, item.position]}
                  key={item.text}
                />
              );
            })}
          </ImageBackground>
        ) : null}
      </View>
    
    );
  }
}
