import { database, storage } from '../database/config';
import * as base64js from 'base64-js';
import * as TextDecoder from 'text-encoder-lite'

// converts base64 string to a byte array 
// source https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
function Base64Decode(str, encoding = 'utf-8') {
    var bytes = base64js.toByteArray(str);
    return new (TextDecoder || TextDecoderLite)(encoding).decode(bytes);
}


// adds a new image to firebase storage and real time database
export function uploadImage(info, userId) {
    // Create a reference for the image
    const storageRef = storage.ref();
    const timeStamp = new Date().getTime();
    const path = `images/${userId}/${timeStamp}.jpg`;
    // Create a reference to image
    var ref = storageRef.child(path);

    // decode base64 string into a byte array
    let image = Base64Decode(info.updateImage);
    // store image
    ref.put(imageBlob, { contentType: 'image/jpg' })
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
            }).catch((error) => {
                alert('Sorry, could not add image information.');
            })
        })
        .catch(() => {
            alert('Could not upload image');
        });
}