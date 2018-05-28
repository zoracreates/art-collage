import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, ScrollView, TextInput, Dimensions, KeyboardAvoidingView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { PrimaryButton, LoadingButton } from '../components/StyledButtons';
import { DeviceScroll, MainContainer } from '../components/Containers';
import { TextEntry, TextArea, ValidationError, FormLabel } from '../components/FormComponents';
import { maxChars } from '../helpers/FormVerification'
import GetImageLinks from '../components/GetImageLinks'

export default class PostFrom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title, // pass initial title state from parent 
            description: this.props.description, // pass initial description state from parent 
            titleError: '',
            descriptionError: '',
            updateImage: this.props.updateImage,
            image: this.props.imageSrc, // pass initial image state from parent 
        }
        this.verifyForm = this.verifyForm.bind(this);
        this.handleImage = this.handleImage.bind(this);
    }
    render(props) {
        let { image } = this.state;
        return (
            <KeyboardAwareScrollView enableOnAndroid={true}>
                <View style={styles.imgContainer}>
                    {image &&
                        <Image
                            style={styles.img}
                            source={this.state.image}
                            resizeMode='cover'
                        />
                    }
                    <GetImageLinks handleImage={this.handleImage} />
                    <ValidationError>{this.props.imageError}</ValidationError> 
                </View>
                <View style={styles.inputContainer}>
                    <FormLabel>Title</FormLabel>
                    <TextArea value={this.state.title} onChangeText={(title) => this.handleTitle(title)} />
                    <ValidationError>{this.state.titleError}</ValidationError>

                    <FormLabel>Description</FormLabel>
                    <TextArea value={this.state.description} onChangeText={(description) => this.handleDescription(description)} />
                    <ValidationError>{this.state.descriptionError}</ValidationError>

                </View>
                {this.handleLoading()}
            </KeyboardAwareScrollView>
        );
    }

    // mages spinner visibility for update profile
    handleLoading() {
        if (this.props.loading) {
            return <LoadingButton />
        }
        return (
            <PrimaryButton
                title='PUBLISH'
                onPress={this.verifyForm}
            />
        );
    }
    // update state when new image is received
    handleImage(result) {
        if (!result.cancelled) {
            this.setState({ image: { uri: result.uri }, updateImage: result.uri });
        }
    }


    // keep title to 120 characters
    handleTitle(title) {
        this.setState({ title });
        let titleError = maxChars(title, 120)
        this.setState({ titleError })
    }

    // keep description to 250 characters
    handleDescription(description) {
        this.setState({ description });
        let descriptionError = maxChars(description, 250)
        this.setState({ descriptionError })
    }


    verifyForm() {
        let validationValue = true;
        const { title, description, updateImage } = this.state;
        if (this.state.titleError !== '' || this.state.descriptionError !== '') {
            validationValue = false;
        }
        if (validationValue) {
            let validataionInfo = {
                title: title,
                description: description,
                updateImage: updateImage
            }
            this.props.submit(validataionInfo); // pass submit fuction from parent
        }

    }

}


// establish component styles
const deviceWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
    inputContainer: {
        marginBottom: 20
    },
    img: {
        height: deviceWidth * .80,
        width: deviceWidth
    },
    imgContainer: {
        marginBottom: 30
    }
});


