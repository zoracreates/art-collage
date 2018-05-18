import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Card } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { ImagePicker, Permissions } from 'expo';

import { PrimaryButton } from '../components/StyledButtons';

export default class GetImageLinks extends React.Component {
    render(props) {
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={this.captureImage} style={styles.linkContainer}>
                    <Ionicons name='ios-camera' size={20} color='#1976D2' />
                    <Text style={styles.linkText}> Take Picture</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.pickImage} style={styles.linkContainer}>
                    <Ionicons name='ios-image' size={20} color='#1976D2' />
                    <Text style={styles.linkText}> Select form Gallery</Text>
                </TouchableOpacity>
            </View>
        );
    }
    // select a picture from camera roll
    pickImage = async () => {
        // ask for camera roll permission
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
            throw new Error('Camera Roll permission not granted');
            return alert('Hey! To select a picture, you might want to allow access to your camera roll.');
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3]
        });
        return this.props.handleImage(result)

    }

    captureImage = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        if (status !== 'granted') {
            throw new Error('Camera permission not granted');
            return alert('Hey! To take a picture, you might want to allow access to your camera roll.');
        }

        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3]
        });

        return this.props.handleImage(result)
    }
}



const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        marginTop: 3,
    },
    linkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 3,
    },
    linkText: {
        color: '#1976D2',
        fontWeight: 'bold'
    }
});