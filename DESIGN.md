
# Art Collage Design

## Design Summary

Art Collage is built with React Native. It uses Firebase for its email and password authentication, Realtime Database storage, and Cloud Storage. The application is built on top of Expo, primarily to ease publication and testing on a mobile device. In addition, Art Collage uses Expo’s Image Picker, which provides a simple API for accessing a user’s phone camera and photo gallery.

Other relevant dependencies include React Native Elements, as a UI kit, React Native Keyboard Aware Scroll View for creating scrollable forms—React Native does not automatically make screens scroll or avoid the user’s keyboard—, and React Navigation for moving around the app.

## Firebase Database Structure

Firebase Authentication handles each user’s password and email log in details. Beyond that each user’s information is stored within Firebase’s Realtime Database in a `users` object. The object contains each user’s `profile` details, which are composed of their `bio`, `website`, `displayName` and the profile `imageURL`. It also stores `images` for users. These `images` are the artworks the user has uploaded to Art Collage. 

The database structure could be described as follows:

```
"users": {
	"userID": {
		"profile":{
			"bio" : "user bio information",
			"displayName": "user’s name",
			"photoURL": "a URL for user’s profile image"
		},
		"images": {
			"imageID": {
				"description" : "image’s description",
				"title”: “images’s title",
				"imageURL": "a URL for image"
			},
			// more images
		}
	},
	// more users
}
```
Additionally, to protect user’s data, rules within the database indicate that users must be logged in to read and write database information, and a logged in user can only update information stored under their own user ID. The  Firebase Realtime Database rules for Art Collage are the following:

```
{
  "rules": {
    "users": {
      "$uid": {
          ".read": "$uid === auth.uid",
    		".write": "$uid === auth.uid"
       }
     }
   }
}
```

## Key Files and Folders

### App.js File

This file contains the root `App` component, which controls what the user can see by determining wether they have signed in or not. 

Before the `App` component renders, the React lifecycle method `componentWillMount()` calls the Firebase `onAuthStateChange` method to verify if the user has signed in.

The `renderContent()` function establishes which components are shown to the user. While the state of the user is being confirmed, the `App` component has a state of `loggedIn: null`, and `renderContent()` will show `<PageLoading />`, which consists of a blank page with a spinner element in the middle. 

Once the status of the user has been determined, the callback inside `onAuthStateChange` will change the `loggedIn` state of `App` to either `true` or `false`. If the user is logged in then they are shown the `<Authenticate />` component, if they are not, then they are shown the `<Home />` component.


### Navigation Folder

Inside this folder are the `Authenticate` and `Home` components which are rendered by the `App` component. These two components simply allow the user to move around in the app.

`Authenticate`, which is shown to signed out users, allows them to either go to a `SignUp` or `LogIn` screen. Once the user signs in, they are shown `Home`, which allows them to view the rest of the app.

Navigation is established by the use of the `StackNavigator` provided by the React Navigation library. `StackNavigator` connects different components as  `screens`. It passes each screen a `props.navigation` object, that can call a `navigate()` method, which takes the name of another `screen` as a string. Several components on the `screens` and `screen-views` folders use this this `navigate` method.


### Assets Folder

This folder contains different images used in the app, as well as the app’s icon and the splash screen picture.

### Database Folder

This folder’s `config.js` imports the Firebase library and configures the Art Collage app with its corresponding Firebase bucket. 

Additionally it declares the the following variables to export elsewhere in the application: `database`, which references the app’s database, and `auth` which references the firebase authentication object.

### Components Folder

This folder contains several components that are meant to be reused throughout the app.

- `AppHeader.js` contains the header used on several screens.

- `StyledButtons.js` contains three different button components to be reused throughout the app:  

    a. `<PrimaryButton />` : a large blue button

    b.  `<SecondaryButton />`: a small black button

    c.  `<LoadingButton />` : a button-shaped component that displays a spinner element

- `Containers.js` has two components that can be used to contain sections of the app that need to cover the entirety of the screen. `DeviceScroll` is a scrollable component, and `MainContainer` is a fixed component.

- `ExternalLinks.js` formats links to websites, and uses Expo’s `WebBrowser` to open these links if they can be opened.

- `GetImageLinks.js` has two buttons that when tapped, open the user’s camera or photo gallery through the use of Expo’s `ImagePicker`

- `FormComponent.js` has four components that are used in different forms through out the app:

    a.  `<FormLabel />` : the text that appears above a form field

    b. `<TextEntry />`: a field where users can enter one line of text

    c. `<TextArea />` : a field where users can enter multiple lines of text
   
    d.  `<ValidationError />` : a field meant to format error messages as red text

- `PageLoading.js` has a component that displays a spinner icon in the middle of a blank screen.


### Helpers Folder

This folder is meant to contain reusable helper functions. Inside it are the files `FormVerification.js`  and `UpdateImage.js`.

#### helpers/FormVerification.js

- `maxChars` takes a string as `field`, and a number that indicates the maximum number of characters that field should be. It returns an error message if the `field` string is too long.

- `requiredField` takes the name of a form’s field as `messageName`, and the value of that field as `formField`. It then checks wether the value exists. If the value does not exist, it returns an object with a `validation` key set to false, and an error `message` that contains the field’s name.

- `emailCheck` verifies wether a string follows the pattern on an email address, and like `requiredField`, it returns an object with a `validation` boolean and a `message` string. While Firebase can verify if a string has an email format, having this verified in the front end can give quicker feedback to users.

#### helpers/Update.js

This file contains two functions that write or overwrite the images in a given path on the cloud base storage, and also update information on the database.

- `updateProfileImage` handles the submission of a new profile image and new profile information.

- `updateArtworkImage` handles the submission of a new artwork image and artwork information.


### Screens and Screen-Views Folders

The `screens` folder contains the main views of the application. These are the components that serve as `screens` on the `Authenticate` and `Home` components.  Some of these components are made of other smaller components contained within the `screen-views` folder. Breaking components this way facilitates debugging and makes the code easier to reuse.

##### screens/LogInScreen.js

The `<LogInScreen />` renders a form where the user can enter their email and password.  Immediately under  the two fields,  is the `handleLoading()` function, which renders a `PrimaryButton` that the user can use to submit their information or `LoadingButton` if the user has already submitted their information and the information is being verified.

`handleLoading()` uses the `loading` state of the application to establish which button to display.  When the component first renders the `loading` state is `false`, so the user sees a `PrimaryButton`. As soon as the user clicks the button the `verifyLogIn()` function is triggered, which sets the `loading` state to `true`, and causes the `LoadingButton` to render.

`verifyLogIn` does more that just change the `loading` state. It also assures the user entered an email and a password, and returns from verification messages. If the user has entered the information required, then it submits the form’s information to `submitLogIn()`, which uses Firebase’s email and password authentication to sign in the user, and returns an error if Firebase encounters an issue.

Additionally, a `SecondaryButton` allows the user to navigate towards the `<SignUpScreen />` page if they do not have an account.

##### screens/SignUpScreen.js

`SignUpScreen` looks very similar to `LogInScreen`. However it requires the user to also enter a name. When the user signs up, their information is verified by `verifySignUp()`. If their information is valid, then `submitSignUp()` creates a new user with Firebase email and password authentication, and adds the user’s name to the application’s database.

Additionally,  `SignUpScreen`  also gives users the option to navigate to the the `LogInScreen`.

##### screens/ProfileScreen.js

`<ProfileScreen />` renders immediately after the application determines that the user has signed in.  Inside the `render` method of `ProfileScreen` is just one component, `<Profile/>` which is defined in the  `screen-views/Profile.js` folder.

The `ProfileScreen` component handles fetching user’s information from the Firebase database through the `loadData()` function, and then passes this information as `props` to `Profile`, which in turns handles how the data will be rendered to the users.

###### screen-views/Profile.js

`Profile` contains three main components:

- `AppHeader`, which allows the user to log out or to navigate to the `EditProfile` screen. 
 
-  A `Card` component imported from the React Native Elements library, which takes care of displaying the user’s name, bio, profile picture, and website.

- `<ArtList/>` which is defined in `screen-views/ArtList.js`. 

###### screen-views/ArtList.js

`ArtList` uses `photoResults()` to fetch the artworks of a particular user from the database. Once the data has been received, it then renders the the image and title for each work in a `Card` component.

The `Card` is itself is wrapped by a `TouchableOpacity` component that has an `onPress` function which allows the user to navigate to the `ArtWork` screen. This `onPress` function also passes `artwork.key` as a parameter to the `ArtWork` screen.

Each artwork is stored in the database under an `images` object with a corresponding ID or key generated by Firebase;  `artwork.key` refers to this ID.

##### screens/ArtWorkScreen.js

This screen receives one parameter and remembers it as `artId`. The parameter should correspond to a key for an image stored in the database.  If no parameter is received or the `artId` does not correspond to any images in the database `<ArtWorkScreen />` simply renders a placeholder image and a message of “Untitled” and “No art here”. 

If `artId` corresponds to an image in the database, then this image’s URL, title, and description are retrieved from the database and displayed to the user. 

`ArtWorkScreen`’s `AppHeader` also passes the received `artId` as a parameter to the `EditArtWork` screen.

##### screens/EditProfileScreen.js

`<EditProfileScreen />` retrieve’s the current user’s profile image, display name, website, and bio from the database and then passes it to `<EditProfileForm />` as props.

###### screen-views/EditProfileForm

`EditProfileForm` auto populates the user’s information to a form, so they may edit their current information. The information is held on the components `state`. When a user changes their information in the form, the `state` is updated. Then, when the user taps the `UPDATE` button returned by `handleLoading()`, the user’s information is retrieved from the `state` and passed to `verifyForm()`. If the user has provided valid information (mainly included a name, and submitted a website that includes http or https), then the information is updated in the database and cloud storage by the `submit()` function.


##### screens/AddArtWorkScreen.js 

`AddArtWorkScreen` renders the `<PostForm />` component, which presents a form for the user to submit an image with its title and description. 

`AddArtWorkScreen` also verifies that an image has in fact been captured or chosen by the users. If the user has not taken a picture or selected one from their gallery, the then `PostForm` will not return an image’s URL to `AddArtWorkScreen`. At this point,  the `handleSubmission()` function in `AddArtWorkScreen` will return an error to the user.

If an image’s URL is received by `handleSubmission()`, then `addWork()` will be called to add the image to the Firebase cloud storage and database.

##### screens/EditArtWorkScreen.js

`EditArtWorkScreen` also renders `PostFrom`. However, it pre-populates the form with the information of a current image. 

The screen receives the current image’s database key as a parameter and remembers it as `artId`. Then it fetches the image’s information and populates it for the user.

This screen allows the user to either edit an artwork’s information or delete an artwork from the database.

If the user taps the `PUBLISH` button rendered by `PostFrom` then `handleSumbis`sion()` is called. This function has a callback to `editWork()` which takes care of updating the information in the database and cloud storage.

If the user wishes to remove an art work, they can tap `Delete` on the `AppHeader` component. This triggers `deleteWork()`, which sets the `deleting` state of the component to true, and  removes the artwork from the database. While the `deleting` state is true, `renderDelete()` causes the page to render a spinner icon through the use of a `PageLoading` component.

###### screen-views/PostForm

`PostFrom` renders a form where the user can select or take a photo, and add a title and description for that photo. 

The image’s details are held on the components `state`. When the user taps the `PUBLISH` button returned by `handleLoading()`, the user’s information is retrieved from the state and passed to `verifyForm()`, which in turn sends the information to a `submit()` function passed by a parent component. In the case of `EditArtWorkScreen` and `AddArtWorkScreen`, the information passed by `submit()` is received by `handleSubmission()`.

It should be noted that, before sending the information to `submit()`, `PostForm` verifies that the title of an image is no more than 120 characters long, and that the description is no longer than 250 characters long.
