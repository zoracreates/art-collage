import React from 'react';
import { Dimensions } from 'react-native';
import { StackNavigator } from 'react-navigation'

// import routes
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import AddArtWorkScreen from '../screens/AddArtWorkScreen';
import ArtWorkStack from '../screens/ArtWorkScreen';
import EditArtWorkScreen from '../screens/EditArtWorkScreen';

export default Home = () => {
  return  <HomeNavigation style={{ width: Dimensions.get('window').width }} />
}

// create navigator for signed in users
const HomeNavigation = StackNavigator({
  Profile: { screen: ProfileScreen },
  EditProfile: { screen: EditProfileScreen },
  AddArtWork: { screen: AddArtWorkScreen },
  ArtWork: { screen: ArtWorkStack },
  EditArtWork: { screen: EditArtWorkScreen }
},{
  headerMode: 'none',
}
);