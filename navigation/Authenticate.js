import React from 'react';
import { Dimensions } from 'react-native';
import { StackNavigator } from 'react-navigation'

// import routes
import LogInScreen from '../screens/LogInScreen';
import SignUpScreen from '../screens/SignUpScreen';


export default Authenticate = () => {
    return <StartNavigation style={{ width: Dimensions.get('window').width }} />
}

// create navigator for users not yet signed in
const StartNavigation = StackNavigator({
  LogIn: { screen: LogInScreen },
  SignUp: { screen: SignUpScreen }
}, {
  headerMode: 'none',
}
);