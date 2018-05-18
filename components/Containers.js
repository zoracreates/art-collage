import React from 'react';
import { ScrollView, View, Dimensions } from 'react-native';

const deviceWidth =  Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
// make  a scroll view the length and width of screen
export const DeviceScroll = (props) =>{
  return <ScrollView {...props} style={[props.style, {height: deviceHeight} , {width: deviceWidth}]} />;
}
// make a view the size of the screen
export const MainContainer = (props) => {
  return <View {...props} style={[props.style, {height: deviceHeight}]} />;
}