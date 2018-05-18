import React from 'react';
import { StyleSheet, View, TextInput, Text } from 'react-native';

export const TextEntry = (props) => {
    return <TextInput {...props} style={[props.style, styles.input, styles.inputContainer, styles.inputText]} />;
}


export const TextArea = (props) => {
    return (
        <View style={[props.style, styles.input, styles.inputContainer]}>
            <TextInput multiline={true} {...props} style={[props.style, styles.inputText]} />
        </View>
    );
}

export const ValidationError = (props) =>{
    return <Text {...props} style={[props.style, styles.error, styles.inputContainer]} />;
}


export const FormLabel = (props) => {
    return <Text {...props} style={[props.style, styles.label]} />;  
}



const styles = StyleSheet.create({
    input: {
        borderBottomColor: '#1976D2',
        borderBottomWidth: 3
    },
    error: {
        color: 'red'
    },
    inputContainer: {
        marginLeft: 25,
        marginRight: 25,
        marginTop: 15
    },
    inputText: {
        color:'#757575'
    },
    label: {
        marginLeft: 20,
        marginRight: 20,
        fontWeight: 'bold'
    }
});
