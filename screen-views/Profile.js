import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image} from 'react-native';
import { Card, Text } from 'react-native-elements';
import { auth } from '../database/config'

import ExternalLink from '../components/ExternalLink';
import { DeviceScroll, MainContainer } from '../components/Containers';
import AppHeader from '../components/AppHeader';
import { Ionicons } from '@expo/vector-icons';
import ArtList from './ArtList';



// display user's profile information and call the Artlist component to render their art works
export default Profile = (props) => {
    return (
        <MainContainer>
            <AppHeader
                left='Log Out'
                leftPress={logOut.bind(this)}
                title='Profile'
                right='Edit'
                rightPress={() => props.navigation.navigate('EditProfile')}
            />
            <DeviceScroll>
                <Card containerStyle={styles.infoCardContainer}>
                    <View style={styles.infoCard}>
                        <Image
                            style={styles.profileImg}
                            source={props.image}
                        />
                        <View style={styles.profileTextContainer}>
                            <Text style={styles.name}>{props.name}</Text>
                            <ExternalLink website={props.website} />
                        </View>
                    </View>
                    <Text>{props.bio}</Text>
                </Card>

                <ArtList
                    navigation={props.navigation}
                 />
            </DeviceScroll>
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={styles.bottomButton}
                    onPress={() => props.navigation.navigate('AddArtWork')}
                >
                    <Text><Ionicons name='md-add-circle' size={30} color='#1976D2'/></Text>
                    <Text style={styles.caption}>Add Art</Text>
                </TouchableOpacity>
            </View>
        </MainContainer>
    );
}

// sign out user
const logOut = () => {
    auth.signOut().catch(() => {
        alert('Looks like there was a sign out issue. Please try again');
    });
}

// establish component styles
const styles = StyleSheet.create({
    infoCard: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },
    infoCardContainer: {
        margin: 0,
        borderTopWidth: 0,
    },
    profileImg: {
        width: 100,
        height: 100,
        borderRadius: 50,
        resizeMode: 'cover'
    },
    profileTextContainer: {
        width: 200,
        paddingTop: 25,
        paddingLeft: 10
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    bottomBar: {
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: 1,
        borderTopColor: '#1976D2',
        position: 'relative',
        bottom: 0,
        left: 0
    },
    bottomButton: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    caption: {
        fontSize: 12,
        color: '#757575'
    }
});
