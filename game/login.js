// Base Signing in functions
function createUser(email, password){
firebase.auth().createUserWithEmailAndPassword(email, password);
}

function signOut(){
	firebase.auth().signOut();
}

function signIn(email, password){
	firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
		window.location.href = 'game.html';
	});
}

// Automatic redirect if you are already logged in / are not
var page;

firebase.auth().onAuthStateChanged(function(user) {
  if(user) {
		if(page == "login"){
			window.location.href = 'game.html';
		}
  } else {
		if(page == "game"){
			window.location.href = 'index.html';
		}
  }
});

// Html Buttons
function signInButton(){
	var email = document.getElementById("username-input").value;
	var pass = document.getElementById("password-input").value;
	signIn(email, pass);
}

function signOutButton(){
	signOut();
}

window.addEventListener('keypress', function (e) {
    if (e.keyCode == 13) {
			if(document.getElementById("password-input") === document.activeElement){
				signInButton();
			}
    }
}, false);


// User Info Functions
function getUserInfo(){
var user = firebase.auth().currentUser;

if (user != null) {
  user.providerData.forEach(function (profile) {
    console.log("Sign-in provider: " + profile.providerId);
    console.log("  Provider-specific UID: " + profile.uid);
    console.log("  Name: " + profile.displayName);
    console.log("  Email: " + profile.email);
    console.log("  Photo URL: " + profile.photoURL);
  });
}
}

function setUserInfo(displayName, photoURL){
	var user = firebase.auth().currentUser;

	user.updateProfile({
  displayName: displayName,
  photoURL: photoURL
});	
}
function setUserInfo(displayName){
	var user = firebase.auth().currentUser;

	user.updateProfile({
  displayName: displayName
});	
}

function loggedIn(){
	var user = firebase.auth().currentUser;
	if(user !=  null) {
		return true;
	}
}

// Auth config

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);





