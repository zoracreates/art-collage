import { database, storage } from '../database/config';


// adds a new image to firebase storage and real time database
export async function uploadImage(info, userId) {
    // Create a reference for the image
    const storageRef = storage.ref();
    const timeStamp = new Date().getTime();
    const path = `images/${userId}/${timeStamp}.jpg`;
    // Create a reference to image
    var ref = storageRef.child(path);

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
        })
        .catch((error) => {
            alert('Sorry, could not add image information.');
        })
        .then((snapshot) => {
            this.setState({ loading: false })
            this.props.navigation.navigate('ArtWork', { artId: key });
        });

}
