import { database, storage } from '../database/config'


// adds a new profile image to firebase storage and real time database
export async function updateProfileImage(updates, userId) {
    // Create a root reference
    var storageRef = storage.ref();

    // Create a reference to image
    var ref = storageRef.child(`profileImages/${userId}`);

    const response = await fetch(updates.photoURL);
    const blob = await response.blob();

    // store image in cloud storage
    await ref.put(blob)
        .catch(
            () => {
                alert('Could not upload profile image.')
            }
        )
        .then(() => {
            // get the url
            return ref.getDownloadURL();
        })
        .then((url) => {
            // store profole information to real time databae
            database.ref(`users/${userId}/profile`).set({
                displayName: updates.displayName,
                photoURL: url,
                website: updates.website,
                bio: updates.bio
            }).catch((error) => {
                alert('Sorry, could not update profile information.');
            })
        });
}
