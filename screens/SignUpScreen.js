import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { auth, database } from '../database/config'

import { MainContainer } from '../components/Containers';
import { PrimaryButton, SecondaryButton, LoadingButton } from '../components/StyledButtons';
import { TextEntry, ValidationError, FormLabel } from '../components/FormComponents';
import { requiredField, emailCheck } from '../helpers/FormVerification'

// show sign up form
export default class SignUpScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newName: '',
            newNameError: '',
            newEmail: '',
            newEmailError: '',
            newPassword: '',
            newPasswordError: '',
            matchPassword: '',
            matchPasswordError: '',
            signUpError: ''
        }
        this.verifySignUp = this.verifySignUp.bind(this);
    }
    render() {
        return (
            <MainContainer style={styles.container}>
                <KeyboardAwareScrollView enableOnAndroid={true}>
                    <Text h3 style={styles.title}>Welcome to Art Collage!</Text>

                    <Card>
                        <FormLabel>Name</FormLabel>
                        <TextEntry value={this.state.newName} onChangeText={(newName) => this.setState({ newName })} />
                        <ValidationError>{this.state.newNameError}</ValidationError>

                        <FormLabel>Email</FormLabel>
                        <TextEntry value={this.state.newEmail} onChangeText={(newEmail) => this.setState({ newEmail })} />
                        <ValidationError>{this.state.newEmailError}</ValidationError>

                        <FormLabel>Password</FormLabel>
                        <TextEntry value={this.state.newPassword} secureTextEntry onChangeText={(newPassword) => this.setState({ newPassword })} />
                        <ValidationError>{this.state.newPasswordError}</ValidationError>

                        <FormLabel>Confirm Password</FormLabel>
                        <TextEntry value={this.state.matchPassword} secureTextEntry onChangeText={(matchPassword) => this.setState({ matchPassword })} />
                        <ValidationError>{this.state.matchPasswordError}</ValidationError>

                        {/*Error in the event firebase is unable to crete user*/}
                        <ValidationError>{this.state.signUpError}</ValidationError>

                        {/* show email sign up button or loading */}
                        {this.handleLoading()}

                        <View style={styles.navigateContainer}>
                            <Text h4 style={styles.title}>Have an Account?</Text>
                            <SecondaryButton onPress={() => this.props.navigation.navigate('LogIn')} title='Log In' />
                        </View>
                    </Card>

                </KeyboardAwareScrollView>
            </MainContainer>
        );
    }

    // mages spinner visibility for email sign up
    handleLoading() {
        if (this.state.loading) {
            return <LoadingButton />
        }
        return (
            <PrimaryButton
                title='SIGN UP'
                onPress={this.verifySignUp}
            />
        );
    }

    // validate sign up from
    verifySignUp() {
        // start spinner and clear all errors
        this.setState({
            loading: true,
            newNameError: '',
            newEmailError: '',
            newPasswordError: '',
            matchPasswordError: '',
            signUpError: ''
        });

        let validationValue = true;

        // require a name
        let requireName = requiredField(this.state.newName, 'name');
        this.setState({ newNameError: requireName.message });
        if (!requireName.validation) {
            validationValue = false;
        }

        // check for a valid email
        let verifyEmail = emailCheck(this.state.newEmail);
        this.setState({ newEmailError: verifyEmail.message });
        if (!verifyEmail.validation) {
            validationValue = false;
        }

        // require password
        let requirePassword = requiredField(this.state.newPassword, 'password');
        this.setState({ newPasswordError: requirePassword.message });
        if (!requirePassword.validation) {
            validationValue = false;
        }

        // verify passwords match
        if (this.state.newPassword !== this.state.matchPassword) {
            this.setState({ matchPasswordError: 'Passwords do not match.' });
            validationValue = false;
        }

        if (validationValue) {
            this.submitSignUp(validationValue);
        }
        else {
            // clear spinner
            this.setState({ loading: false })
        }
    }

    // submit sign up form
    submitSignUp(validationValue) {
        const { newEmail, newPassword } = this.state;
        auth.createUserWithEmailAndPassword(newEmail, newPassword).catch((error) => {
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        return this.setState({ newEmailError: 'An account exists with that email.' })
                    case 'auth/invalid-email':
                        return this.setState({ newEmailError: 'Email not valid.' })
                    case 'auth/weak-password':
                        return this.setState({ newPasswordError: 'Password must be at least 6 characters long.' })
                    default:
                        return this.setState({ signUpError: 'Could not sign you up, please try again.' })
                }

            }).then((user) => {
                const userId = user.uid
                database.ref(`users/${userId}/profile`).set({
                    displayName: this.state.newName
                  }).catch((error) => {
                    alert('Sorry, could not add your name. You may add it by editing your profile.');
                  });
                // clear spinner
                this.setState({ loading: false })
            })      
    }


}

// establish component styles
const styles = StyleSheet.create({
    container: {
        paddingTop: 40
    },
    title: {
        textAlign: 'center',
        color: '#1976D2'
    },
    navigateContainer: {
        paddingBottom: 2
    }
});