import React from 'react';
import { auth, database } from '../database/config'
import Profile from '../screen-views/Profile';

// fetch the user's profile details and pass them to the Profile component
export default class ProfileScreen extends React.Component {
    componentWillMount() {
        this.loadData();
    }

    constructor(props) {
        super(props);
        this.state = {
            name: 'loading',
            image: null,
            bio: 'loading',
            webiste: 'loading',
        }
    }
    render() {
        return (
            <Profile
                navigation={this.props.navigation}
                name={this.state.name}
                image={this.state.image}
                bio={this.state.bio}
                website={this.state.website}
            />
        );
    }

    loadData() {
        const userId = auth.currentUser.uid;
        // fetch the bio and website information
        handleQuery = (name, image, bio, website) => {
            // handle missing field information
            if (!name) {
                name = ''
            }

            if (!bio) {
                bio = ''
            }

            if (!website) {
                website = ''
            }

            let profileImgUri = image;
            let profileImg;
            // if no profile photo use a placeholder
            if (!profileImgUri) {
                profileImg = require('../assets/portrait-placeholder.png')
            }
            else {
                profileImg = { uri: `${profileImgUri}` }
            }

            this.setState({
                name: name,
                image: profileImg,
                bio: bio,
                website: website
            })

        }
        return database.ref(`users/${userId}/profile`).on('value', snapshot => {
            if (!snapshot.val()) {
                return (
                    this.setState({
                        name: '',
                        image: '',
                        bio: '',
                        website: ''
                    })
                );
            }
            handleQuery(
                snapshot.val().displayName,
                snapshot.val().photoURL,
                snapshot.val().bio,
                snapshot.val().website,
            );
        });
    }


}

