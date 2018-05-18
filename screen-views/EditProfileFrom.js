import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, ScrollView, TextInput , Text} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { auth, database, storage } from '../database/config'

import { PrimaryButton, LoadingButton } from '../components/StyledButtons';
import { DeviceScroll, MainContainer } from '../components/Containers';
import AppHeader from '../components/AppHeader';
import { TextEntry, TextArea, ValidationError, FormLabel } from '../components/FormComponents';
import { maxChars, requiredField } from '../helpers/FormVerification'
import GetImageLinks from '../components/GetImageLinks'

// present a form for the user to upload the profile
export default class EditProfileScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.name,
            website: this.props.website,
            bio: this.props.bio,
            nameError: '',
            websiteError: '',
            bioError: '',
            imageUpdate: this.props.imageUpdate,
            image: this.props.image,
            loading: false,
        }
        this.verifyForm = this.verifyForm.bind(this);
        this.handleImage = this.handleImage.bind(this);
    }
    render() {

        let { image } = this.state;
        return (
            <MainContainer>
                <AppHeader
                    left='Cancel'
                    leftPress={() => this.props.navigation.navigate('Profile')}
                    title='Edit Profile'
                />
                
                <KeyboardAwareScrollView>
                    <View style={styles.imgContainer}>
                        {image &&
                            <Image
                                style={styles.profileImg}
                                source={this.state.image}
                            />}
                        <GetImageLinks handleImage={this.handleImage} />
                    </View>

                    <View style={styles.inputContainer}>
                        <FormLabel>Name (Required)</FormLabel>
                        <TextEntry value={this.state.name} onChangeText={(name) => this.setState({ name })} />
                        <ValidationError>{this.state.nameError}</ValidationError>

                        <FormLabel>Website</FormLabel>
                        <TextEntry value={this.state.website} onChangeText={(website) => this.setState({ website })} />
                        <ValidationError>{this.state.websiteError}</ValidationError>


                        <FormLabel>Bio</FormLabel>
                        <TextArea value={this.state.bio} onChangeText={(bio) => this.handleBio(bio)} />
                        <ValidationError>{this.state.bioError}</ValidationError>

                    </View>
                    {this.handleLoading()}

                </KeyboardAwareScrollView>
            </MainContainer>

        );
    }

    // mages spinner visibility for update profile
    handleLoading() {
        if (this.state.loading) {
            return <LoadingButton />
        }
        return (
            <PrimaryButton
                title='UPDATE'
                onPress={this.verifyForm}
            />
        );
    }

    // close modal and set new image if one was selected or take
    handleImage(result) {
        if (!result.cancelled) {
            this.setState({ image: { uri: result.uri }, imageUpdate: result.uri });
        }
    }

    // give bio a max of 150 characters
    handleBio(bio) {
        this.setState({ bio })
        let bioError = maxChars(bio, 150);
        this.setState({ bioError })
    }

    // validate the form
    verifyForm() {
        // start spinner and clear all errors, except bio error which clears itself
        this.setState({
            loading: true,
            nameError: '',
            websiteError: ''
        });

        let validationValue = true;

        // require a name
        let requireName = requiredField(this.state.name, 'name');
        this.setState({ nameError: requireName.message });
        if (!requireName.validation) {
            validationValue = false;
        }

        // if a website is provided make sure it's formatted with http or https
        if (this.state.website !== '') {

            // regular expression obtained from https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
            let pattern = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;

            if (!pattern.test(this.state.website)) {
                this.setState({ websiteError: 'Web address entered is not valid. Make sure it it starts with http:// or https://.' });
                validationValue = false;
            }


        }

        // verify that the bio is no more than 150 characters
        if (this.state.bioError !== '') {
            validationValue = false;
        }

        // if the form is valid change the validated state
        if (validationValue) {
            this.submit(validationValue);
        }
        else {
            this.setState({loading: false});
        }


    }

    // submit the form
    submit(validated) {

        let {name, imageUpdate, website, bio} = this.state;

        let dataUpdates = {
            displayName: name,
            photoURL: imageUpdate,
            website: website,
            bio: bio
        }
        if(!imageUpdate) {
            delete dataUpdates.photoURL;
        }
        const user = auth.currentUser.uid;
        
        // update website and bio on the firebase realtime database
        database.ref(`users/${user}/profile`).set(dataUpdates).then(()=>{
            this.setState({loading: false});
            this.props.navigation.navigate('Profile');
        }).catch((error) => {
            alert('Sorry, could not update profile, please try again.');
        });
    }
}


// establish component styles
const styles = StyleSheet.create({
    imgContainer: {
        alignItems: 'center',
        paddingTop: 20,
        marginBottom: 30
    },
    profileImg: {
        width: 100,
        height: 100,
        borderRadius: 50,
        resizeMode: 'cover'
    },
    inputContainer: {
        marginBottom: 20
    }
});


