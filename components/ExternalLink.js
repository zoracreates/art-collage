import React from 'react';
import { TouchableOpacity, StyleSheet, View, Linking } from 'react-native';
import { Text } from 'react-native-elements';
import { WebBrowser } from 'expo';

// format a URL
export default class ExternalLink extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: '',
        }
    }
    render() {
        let website = this.props.website;
        return (
            <View>
                <TouchableOpacity>
                    <Text style={styles.website} onPress={this.handlePress.bind(this, website)}>{website}</Text>
                </TouchableOpacity>
                <Text style={styles.error}>{this.state.errorMessage}</Text>
            </View>
        );
    }

    handlePress(url) {
        // check if url works
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                this.setState({ errorMessage: 'Could not open site. Please try again later.' })
            }
            else {
                // open URL in browser
                return WebBrowser.openBrowserAsync(url);
            }
        }).catch(err => console.error('An error occurred', err));
    }
}
// establish URL sytles
const styles = StyleSheet.create({
    website: {
        color: '#1976D2'
    },
    error: {
        color: 'red'
    }
});

