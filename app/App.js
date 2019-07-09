/**
 * React Native Business Cards
 * https://github.com/zsajjad/BusinessCard
 *
 */

import React, { Component } from "react";
import {  View, Text } from "react-native";
// import { RNCamera as Camera } from "react-native-camera";
// import RNTextDetector from "react-native-text-detector";

import style, { screenHeight, screenWidth } from "./styles";

// const PICTURE_OPTIONS = {
//   quality: 1,
//   fixOrientation: true,
//   forceUpOrientation: true
// };

export default class App extends React.Component {
  state = {
    loading: false,
    image: null,
    error: null,
    visionResp: []
  };


  render() {
    console.log('test')
    return (
      <View style={{backgroundColor: 'white'}}>
        <Text style={{ color: "red" }}>Some Text</Text>
      </View>
    
    );
  }
}
