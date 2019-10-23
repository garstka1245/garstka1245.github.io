var page;
var currentUser;

// Base Signing in functions
function signUp(email, password){
	if (currentUser == null) {
		// sign up user
		firebase.auth().createUserWithEmailAndPassword(email, password).then(function(){
		
		}).catch(function(error) {
			var errorCode = error.code;
			var errorMessage = error.message;
			
			console.log(errorMessage);
			document.getElementById("error").innerHTML = errorMessage;
			document.getElementById("error").style.visibility = "visible"; 
		});
	}
	else{
		//setting displayName
		var dispName = document.getElementById("usernameElement").value;
		if(dispName != ""){
			currentUser.updateProfile({
				displayName: dispName
			}).then(function(){
				window.location.href = 'game.html';
			});
		}
	}
}

function signOut(){
	firebase.auth().signOut();
}

function signIn(email, password){
	firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
		document.getElementById("error").style.visibility = "hidden"
	}).catch(function(error) {
  var errorCode = error.code;
  var errorMessage = error.message;
	
	console.log(errorMessage);
	document.getElementById("error").innerHTML = errorMessage;
	document.getElementById("error").style.visibility = "visible"; 
	});
	
}

// Automatic redirect if you are already logged in / are not

firebase.auth().onAuthStateChanged(function() {
	currentUser = firebase.auth().currentUser;
  if(currentUser != null) {
		if(page == "login"){
			if(currentUser.displayName){
				window.location.href = 'game.html';
			}
			else{
				var usernameLabel = document.createElement("label");
				var usernameElement = document.createElement("input");
				usernameLabel.innerHTML = "Display Name:";
				usernameLabel.setAttribute('id', "usernameLabel");
				usernameElement.setAttribute('id', "usernameElement");
				document.getElementById("inputs").appendChild(usernameLabel); 
				document.getElementById("inputs").appendChild(usernameElement);
				document.getElementById("signOutButton").style.visibility = "visible";
				document.getElementById("signInButton").style.visibility = "hidden";
			}
		} else {
			userLoggedIn();
		}
  } else {
		if(page == "login" && document.getElementById("usernameLabel") != null){
			var labelElement = document.getElementById("usernameLabel");
			var usernameElement = document.getElementById("usernameElement");
			labelElement.parentNode.removeChild(labelElement);
			usernameElement.parentNode.removeChild(usernameElement);
			document.getElementById("signOutButton").style.visibility = "hidden";
			document.getElementById("signInButton").style.visibility = "visible";
		}
		
		if(page == "game"){
			window.location.href = 'index.html';
		}
  }
});

// Html Buttons
function signUpButton(){
	var email = document.getElementById("username-input").value;
	var pass = document.getElementById("password-input").value;
	signUp(email, pass);
}

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
if (currentUser != null) {
  currentUser.providerData.forEach(function (profile) {
    console.log("Sign-in provider: " + profile.providerId);
    console.log("  Provider-specific UID: " + profile.uid);
    console.log("  Name: " + profile.displayName);
    console.log("  Email: " + profile.email);
    console.log("  Photo URL: " + profile.photoURL);
  });
}
}

function setUserInfo(displayName, photoURL){
	currentUser = firebase.auth().currentUser;

	currentUser.updateProfile({
  displayName: displayName,
  photoURL: photoURL
});	
}

function setUserInfo(displayName){
	currentUser = firebase.auth().currentUser;
	 
	currentUser.updateProfile({
  displayName: displayName
});	
}

function loggedIn(){
	currentUser = firebase.auth().currentUser;
	
	if(currentUser !=  null) {
		return true;
	}
}

// Auth config

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);





