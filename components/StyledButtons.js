import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// most common button element in the app
export const PrimaryButton = (props) => {
    return (
        <TouchableOpacity onPress={props.onPress} style={styles.outerContainer}>
            <View style={[styles.buttonContainer, styles.primaryButton]}>
                <Text style={styles.buttonText}>{props.title}</Text>
            </View>
        </TouchableOpacity>
    );
}

// button-shapped view that has a spinner in the center
export const LoadingButton = (props) => {
    return (
        <View style={styles.outerContainer}>
            <View style={[styles.buttonContainer, styles.loadingButton]}>
                <ActivityIndicator size='small' color='#616a75' />
            </View>
        </View>
    );

}

// small black button
export const SecondaryButton = (props) => {
    return (
        <TouchableOpacity onPress={props.onPress} style={styles.outerContainer}>
            <View style={[styles.secondaryButton]}>
                <Text style={styles.buttonText}>{props.title}</Text>
            </View>
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 250,
        height: 45,
        alignSelf: 'center',
    },
    primaryButton: {
        backgroundColor: '#1976D2'
    },
    facebookButton: {
        backgroundColor: '#3b5998'
    },
    secondaryButton: {
        backgroundColor: '#292C31',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 175,
        height: 40,
        alignSelf: 'center'
    },
    loadingButton: {
        backgroundColor: '#d6d3ce'
    },
    buttonText: {
        fontSize: 20,
        color: 'white'
    },
    buttonIcon: {
        paddingRight: 10
    },
    outerContainer: {
        paddingTop: 10,
        paddingBottom: 10
    }
});