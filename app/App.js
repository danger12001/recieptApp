import React from "react";
import {  View, TouchableOpacity, ImageBackground, Text } from "react-native";
import { RNCamera as Camera } from "react-native-camera";
import RNTextDetector from "react-native-text-detector";
import Dimensions from "./theme/Dimensions";
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
    try {
      const visionResp = await RNTextDetector.detectFromUri(uri);
      console.log(visionResp)

      //TODO - only map vision resp if fits within boundries.
      //BOUNDRIES: TOP: 20%, LEFT: <50% - ITEMS, LEFT: >50% - TOTALS 
      //TODO - draw boundries on camera.

      let newVisionResp = [];
      let items = [];
      let totals = [];
      let topBounding = ((imageProperties.height / 100) * 20);
      let itemBounding = ((imageProperties.width / 100) * 50);

      console.log(topBounding, 'top');
      console.log(itemBounding, 'item side <');


      visionResp.forEach((resp) => {
        if(resp.bounding.top && resp.bounding.top > topBounding && resp.bounding.left && resp.bounding.left < itemBounding)  {
          console.log('within top', resp);
          newVisionResp.push(resp);
          items.push(resp);
        } else if (resp.bounding.top && resp.bounding.top > topBounding && resp.bounding.left && resp.bounding.left > itemBounding) {
          totals.push(resp)
        }  else {
          console.log('outside array', resp)
        }
      })

      console.log(items, 'items');
      console.log(totals, 'totals');


       this.setState({
          visionResp: this.mapVisionRespToScreen(newVisionResp, imageProperties)
      });
    } catch(err) {
      alert(err);
    }

  };

  mapVisionRespToScreen = (visionResp, imageProperties) => {
    const IMAGE_TO_SCREEN_Y = screenHeight / imageProperties.height;
    const IMAGE_TO_SCREEN_X = screenWidth / imageProperties.width;

    return visionResp.map(item => {
      console.log(item);
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
    <View style={style.container}>

      <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={style.preview}></Camera>
          <View style={style.cameraBoundingContainer}> 
              <View style={style.cameraBoundingTop}/>
              <View style={style.cameraBoundingLeft}/>
              <View style={style.cameraBoundingBottom}/>

          </View>
      <View style={style.buttonContainer}>
       <TouchableOpacity
         onPress={() => this.takePicture(this.camera)}
                style={style.button}
                  />
      </View>
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
