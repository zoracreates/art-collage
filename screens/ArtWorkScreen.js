import React from 'react';
import { View, StyleSheet, Dimensions, Image, ScrollView } from 'react-native';
import { Text } from 'react-native-elements';
import { auth, database } from '../database/config';
import { DeviceScroll, MainContainer } from '../components/Containers';
import AppHeader from '../components/AppHeader';

const placeholder = 'http://via.placeholder.com/350x150';

// fetch and display the data of an existing art work
export default class ArtWorkScreen extends React.Component {
    componentWillMount() {
        const userId = auth.currentUser.uid;
        const { navigation } = this.props;
        const artId = navigation.getParam('artId', 'NO-ID');
        if (artId !== 'NO-ID') {
            return database.ref(`users/${userId}/images/${artId}`).on('value', snapshot => {
                if (!snapshot.val()) {
                    return this.setState({ description: 'No art here', title: 'Untitled' })
                }
                this.setState({
                    image: snapshot.val().imageURL,
                    title: snapshot.val().title,
                    description: snapshot.val().description,
                    artId: artId
                })
            });
        }
        else 
        {
            this.setState({ description: 'No art here', title: 'Untitled' });
        }
    }
    constructor(props) {
        super(props);
        this.state = {
            image: placeholder,
            title: 'loading',
            description: 'loading',
            artId: 'NO-ID'
        }

    }

    render() {
        return (
            <MainContainer>
                <AppHeader
                    left='Profile'
                    leftPress={() => { this.props.navigation.navigate('Profile') }}
                    title='Art Work'
                    right='Edit'
                    rightPress={() => { this.props.navigation.navigate('EditArtWork', {artId: this.state.artId})}}
                />
                <DeviceScroll>
                    <Image
                        style={styles.img}
                        source={{ uri: this.state.image }}
                        resizeMode='cover'
                    />
                    <View style={styles.captionContainer}>
                        <Text h4>{this.state.title}</Text>
                        <Text>{this.state.description}</Text>
                    </View>
                </DeviceScroll>
            </MainContainer>
        );
    }
}

// establish component styles
const deviceWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
    captionContainer: {
        marginTop: 10,
        paddingLeft: 10,
        paddingRight: 10
    },
    img: {
        height: deviceWidth * .80,
        width: deviceWidth
    }
});
