/**
 *
 * Styles for CameraRedemption Screen
 *
 */

import { StyleSheet } from "react-native";

import Colors from "./theme/Colors";
import Dimensions from "./theme/Dimensions";
export const screenHeight = Dimensions.screenHeight;
export const screenWidth = Dimensions.screenWidth;
const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: "center",
    alignContent: 'center',
    backgroundColor: 'black',
    padding: 20,
    width: '100%',
    alignSelf: 'center',
  },
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
  },
  imageBackground: {
    position: "absolute",
    width: Dimensions.screenWidth,
    height: Dimensions.screenHeight,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    top: 0,
    left: 0
  },
  button: {
    width: 64,
    height: 64,
    backgroundColor: Colors.white,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: Colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    alignContent: 'center'
  },
  boundingRect: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FF6600"
  }
});

export default styles;
