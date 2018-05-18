import React from 'react'
import { auth, database } from '../database/config'

import { View, TouchableOpacity } from 'react-native'
import { Card } from 'react-native-elements'

// fet the user's art works and map them to card components
export default class ArtList extends React.Component {
    componentWillMount() {
        this.photoResults();
    }
    constructor(props) {
        super(props);
        this.state = {
            artworks: []
        }
    }
    render(props) {
        const {artworks} = this.state;
        return (
            <View>
                {
                    artworks.map((artwork, i) => {
                        return (
                            <TouchableOpacity
                                key={artwork.key}
                                onPress={() => this.props.navigation.navigate('ArtWork', {artId: `${artwork.key}`})}
                            >
                                <Card
                                    image={{ uri: `${artwork.imageURL}` }}
                                    title={artwork.title}
                                >
                                </Card>
                            </TouchableOpacity>
                        );
                    })
                }
            </View>

        );
    }

    // fetch user's art works
    photoResults() {
        const userId = auth.currentUser.uid;
        return database.ref(`users/${userId}/images`).on('value', snapshot => {
            let items = [];
            if (!snapshot.val()) {
                return this.setState({ artworks: items })
            }
            snapshot.forEach((child) => {
                items.push({
                    title: child.val().title,
                    description: child.val().description,
                    imageURL: child.val().imageURL,
                    key: child.key
                });
            });
            this.setState({ artworks: items })
        });
    }


}