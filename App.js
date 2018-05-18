import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Constants } from 'expo'

import { auth } from './database/config'


// import routes
import Authenticate from './navigation/Authenticate'
import Home from './navigation/Home'
import ProfileScreen from './screens/ProfileScreen'


export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      loggedIn: null
    };
    // ignore setting a timer warning caused by possible firebase library bug
    console.ignoredYellowBox = [
      'Setting a timer'
      ];

  }
 

  //verify if user is logged in or not
  componentWillMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ loggedIn: true })
      }
      else {
        this.setState({ loggedIn: false })
      }
    });
  }

  // control views depending on logged in status, show spinner while status is being determined
  renderContent() {
    switch (this.state.loggedIn) {
      case true:
        return <Home />

      case false:
        return <Authenticate />

      default:
        return <PageLoading />

    }
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderContent()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});