import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Header, Text } from 'react-native-elements';

// create a reusable header for the app
export default AppHeader = (props) => {
    return (
        <Header backgroundColor={background}
            leftComponent={
                <TouchableOpacity onPress={props.leftPress}>
                    <View>
                        <Text style={styles.text}>{props.left}</Text>
                    </View>
                </TouchableOpacity>
            }
            centerComponent={
                <View>
                    <Text h4 style={styles.text}>{props.title}</Text>
                </View>
            }

            rightComponent={
                <TouchableOpacity onPress={props.rightPress}>
                    <View>
                        <Text style={styles.text}>{props.right}</Text>
                    </View>
                </TouchableOpacity>
            }
        />
    );
}



const background = '#1976D2'

const styles = StyleSheet.create({
    text: {
        color: 'white'
    }
}
);