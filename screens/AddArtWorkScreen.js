import React from 'react';
import { auth, database, storage } from '../database/config'

import { MainContainer } from '../components/Containers';
import AppHeader from '../components/AppHeader';
import PostFrom from '../screen-views/PostForm';

const placeholder = require('../assets/placeholder.png');

// display a form for user to enter and artwork's information and send information to database
export default class AddArtWorkScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            imageError: '',
            title: '',
            description: '',
            updateImage: '',
            loading: false
        }

        this.handleSubmission = (validationInfo) => {
            if (validationInfo.updateImage === '') {
                return this.setState({ imageError: 'Oops missing an image. If you changed your mind, tap cancel.' })
            }
            else {
                this.addWork(validationInfo);
            }
        }

    }
    render() {

        return (
            <MainContainer>
                <AppHeader
                    left='Cancel'
                    leftPress={() => this.props.navigation.navigate('Profile')}
                    title='Add Art'
                />
                <PostFrom
                    loading={this.state.loading}
                    title={this.state.title}
                    updateImage={this.state.updateImage}
                    description={this.state.description}
                    imageSrc={placeholder}
                    submit={this.handleSubmission}
                    imageError={this.state.imageError}
                />
            </MainContainer>
        );
    }
    // send art work information to the database
    async addWork(info) {
        this.setState({ loading: true })
        const userId = auth.currentUser.uid;

        // Create a reference for the image
        const storageRef = storage.ref();
        const timeStamp = new Date().getTime();
        const path = `images/${userId}/${timeStamp}.jpg`;
        const ref = storageRef.child(path);

        const response = await fetch(info.updateImage);
        const blob = await response.blob();

        // store image in cloud storage
        await ref.put(blob)
            .catch(
                () => {
                    alert('Could not upload image')
                }
            )
            .then(() => {
                // get the url
                return ref.getDownloadURL();
            })
            .then((url) => {
                // store image information to real time databae, including the path information
                database.ref(`users/${userId}/images`).push({
                    imageURL: url,
                    title: info.title,
                    description: info.description,
                    path: path
                })
                    .catch((error) => {
                        alert('Sorry, could not add image information.');
                    })
                    .then((snapshot) => {
                        this.setState({ loading: false })
                        this.props.navigation.navigate('ArtWork', { artId: snapshot.key });
                    })

            });
    }
}




