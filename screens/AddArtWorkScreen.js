import React from 'react';
import { auth, database } from '../database/config'

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
    addWork(info) {
        this.setState({ loading: true })
        const userId = auth.currentUser.uid;
        database.ref(`users/${userId}/images`).push({
            imageURL: info.updateImage,
            title: info.title,
            description: info.description
        }).catch((error) => {
            alert('Sorry, could not add image.');
        }).then((snapshot) => {
            this.setState({ loading: false })
            this.props.navigation.navigate('ArtWork', { artId: snapshot.key });
        });

    }
}




