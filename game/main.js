var database = firebase.database();


var user = firebase.auth().currentUser;


  user.providerData.forEach(function (profile) {
    console.log("Sign-in provider: " + profile.providerId);
    console.log("  Provider-specific UID: " + profile.uid);
    console.log("  Name: " + profile.displayName);
    console.log("  Email: " + profile.email);
    console.log("  Photo URL: " + profile.photoURL);
  });





function sendChat(user, msg, date) {
  firebase.database().ref('chatlog/' + date + ":" + user).set({
    msg: msg
  });
	console.log("Sent message: " + msg);
	document.getElementById("chatInput").value = ""; 
}





//------------------
window.addEventListener('keypress', function (e) {
    if (e.keyCode == 13) {
			var chatInput = document.getElementById("chatInput").value;
			if(chatInput !== ""){
				sendChat("Chris", chatInput, "198151231");
			}
    }
}, false);

window.onresize = function(e) {
	refreshSize();
}
refreshSize();
function refreshSize(){
	document.getElementById("chatBot").style.top = window.innerHeight - 160 + "px";
	document.getElementById("chatTop").style.top = window.innerHeight - 160 + "px";
}


