import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Card, Text } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { auth } from '../database/config'

import { MainContainer } from '../components/Containers';
import { PrimaryButton, SecondaryButton, LoadingButton } from '../components/StyledButtons';
import { TextEntry, ValidationError, FormLabel } from '../components/FormComponents';
import { requiredField, emailCheck } from '../helpers/FormVerification'

// present andd validate user log in
export default class LogInScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            logInEmail: '',
            logInEmailError: '',
            logInPassword: '',
            logInPasswordError: '',
            loading: false,
            logInError: ''
        }
        this.verifyLogIn = this.verifyLogIn.bind(this);
    }
    render() {
        return (
            <MainContainer style={styles.container}>
                <KeyboardAwareScrollView enableOnAndroid={true}>
                    <Text h3 style={styles.title}>Welcome to Art Collage!</Text>


                    <Card>
                        <FormLabel>Email</FormLabel>
                        <TextEntry value={this.state.logInEmail} onChangeText={(logInEmail) => this.setState({ logInEmail })} />
                        <ValidationError>{this.state.logInEmailError}</ValidationError>

                        <FormLabel>Password</FormLabel>
                        <TextEntry value={this.state.logInPassword} secureTextEntry onChangeText={(logInPassword) => this.setState({ logInPassword })} />
                        <ValidationError>{this.state.logInPasswordError}</ValidationError>

                        {/*Error in the event firebase is unable to crete user*/}
                        <ValidationError>{this.state.logInError}</ValidationError>

                        {/* show email log in button or loading */}
                        {this.handleLoading()}

                        <Text h4 style={styles.title}>New Here?</Text>
                        <SecondaryButton onPress={() => this.props.navigation.navigate('SignUp')} title='Create Account' />
                    </Card>

                </KeyboardAwareScrollView>
            </MainContainer>
        );
    }

    // mages spinner visibility for email log in
    handleLoading() {
        if (this.state.loading) {
            return <LoadingButton />
        }
        return (
            <PrimaryButton
                title='LOG IN'
                onPress={this.verifyLogIn}
            />
        );
    }

    // validate log in from
    verifyLogIn() {

        // show spinner and clear all errors
        this.setState({
            logInEmailError: '',
            logInPasswordError: '',
            loading: true,
            logInError: ''
        });

        let validationValue = true;

        // check for a valid email
        let verifyEmail = emailCheck(this.state.logInEmail);
        this.setState({ logInEmailError: verifyEmail.message });
        if (!verifyEmail.validation) {
            validationValue = false;
        }

        // require password
        let requirePassword = requiredField(this.state.logInPassword, 'password');
        this.setState({ logInPasswordError: requirePassword.message });
        if (!requirePassword.validation) {
            validationValue = false;
        }

        // if validate submit
        if (validationValue) {
            return this.submitLogIn();
        }
        else {
            // else remove spinner
            this.setState({ loading: false });
        }
    }

    // submit log in form
    submitLogIn() {
        const { logInEmail, logInPassword } = this.state;
        auth.signInWithEmailAndPassword(logInEmail, logInPassword).
            catch((error) => {
                switch (error.code) {
                    case 'auth/invalid-email':
                        return this.setState({ logInEmailError: 'Email not valid.' })
                    case 'auth/user-disabled':
                        return this.setState({ logInError: 'Sorry, this account has been disabled.' })
                    case 'auth/user-not-found':
                        return this.setState({ logInError: 'Hmm looks like you don\'t have an account yet.' })
                    case 'auth/wrong-password':
                        return this.setState({ logInPasswordError: 'Oops wrong password.' })
                    default:
                        return this.setState({ logInError: 'Could not log in, please try again.' })
                }

            }).then(() => {
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
    }
});