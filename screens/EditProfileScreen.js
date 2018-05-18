import React from 'react';
import { auth, database } from '../database/config'
import EditProfileForm from '../screen-views/EditProfileFrom'

// fetch data to populate for the EditProfileForm and send the new data to the database
export default class EditProfileScreen extends React.Component {
    componentWillMount() {
        this.loadData();
    }
    constructor(props) {
        super(props);
        this.state = {
            name: 'loading',
            website: 'loading',
            bio: 'loading',
            imageUpdate: '',
            image: require('../assets/portrait-placeholder.png'),
        }
    }
    render() {
        return (
            <EditProfileForm
                navigation={this.props.navigation}
                name={this.state.name}
                imageUpdate={this.state.imageUpdate}
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
            // handle case of no name
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
                imageUpdate: profileImgUri,
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
                        imageUpdate: '',
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
