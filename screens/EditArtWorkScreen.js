import React from 'react';
import { MainContainer } from '../components/Containers';
import AppHeader from '../components/AppHeader';
import PostFrom from '../screen-views/PostForm';
import { auth, database } from '../database/config';
import PageLoading from '../components/PageLoading';

const placeholder = 'http://via.placeholder.com/350x150';

// populate data from an existing artwork into an edit form and allows the user to edit the information
export default class EditArtWorkScreen extends React.Component {
    componentWillMount() {
        const userId = auth.currentUser.uid;
        const { navigation } = this.props;
        const artId = navigation.getParam('artId', 'NO-ID');
        if (artId !== 'NO-ID') {
            return database.ref(`users/${userId}/images/${artId}`).on('value', snapshot => {
                if (!snapshot.val()) {
                    return this.setState({ description: '', title: '' })
                }
                this.setState({
                    image: snapshot.val().imageURL,
                    title: snapshot.val().title,
                    description: snapshot.val().description,
                    artId: artId,
                })
            });
        }
        else {
            this.setState({ description: '', title: '' });
        }
    }
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            image: placeholder,
            title: 'loading',
            description: 'loading',
            artId: 'NO-ID',
            updateImage: '',
            deleting: false,
        }

        this.handleSubmission = (validationInfo) => {
            this.editWork(validationInfo);
        }
    }
    render() {
        return (
            <MainContainer>
                <AppHeader
                    left='Cancel'
                    leftPress={() => { this.props.navigation.navigate('ArtWork', { artId: this.state.artId }) }}
                    title='Edit Art'
                    right='Delete'
                    rightPress={() => { this.deleteWork() }}
                />
                {this.renderDelete()}
            </MainContainer>
        );
    }

    renderDelete() {
        if (this.state.deleting) {
            return <PageLoading />
        }
        return (
            <PostFrom
                loading={this.state.loading}
                title={this.state.title}
                updateImage={this.state.updateImage}
                description={this.state.description}
                imageSrc={{ uri: this.state.image }}
                submit={this.handleSubmission}
            />
        );
    }

    // send new data to the database
    editWork(info) {
        this.setState({ loading: true });
        const artId = this.state.artId;
        const userId = auth.currentUser.uid;
        let updates = {
            imageURL: info.updateImage,
            description: info.description,
            title: info.title,
        };
        if (!updates.imageURL) {
            delete updates.imageURL;
        }
        database.ref(`users/${userId}/images/${artId}`).update(updates).catch((error) => {
            alert('Sorry, could not update image.');
        }).then(() => {
            // clear spinner
            this.setState({ loading: false })
            this.props.navigation.navigate('ArtWork', { artId: this.state.artId });
        });
    }

    // delete the  artwork
    deleteWork() {
        this.setState({ deleting: true });
        const artId = this.state.artId;
        const userId = auth.currentUser.uid;
        database.ref(`users/${userId}/images/${artId}`).remove().then(() => {
            this.setState({ deleting: false });
            this.props.navigation.navigate('Profile');
        });
    }
}
