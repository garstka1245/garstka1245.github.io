var database = firebase.database();
chatlogref = database.ref("chatlog/");



function sendChat(msg) {
	var user = firebase.auth().currentUser;
	var username = "";
	var date = new Date();
	
	if (user != null) {
		user.providerData.forEach(function (profile) {
			console.log("  Name: " + profile.displayName);
			username = profile.displayName;
  });
}
	
  firebase.database().ref('chatlog/' + date.getTime() + "" + username).set({
		name: username,
    msg: msg
  });
	console.log("Sent message: " + msg);
	document.getElementById("chatInput").value = ""; 
}

// Database retrieve messages

function retrieveMessages(){
	chatlogref.orderByChild("msg").once("value", function(snap) {
	var msgs = [];
		
	var chatlog = Object.values(snap.val());
	
	for(var i = 0; i < chatlog.length; i++){
		msgs.push(chatlog[i].name + ": " + chatlog[i].msg);
	}
	
	
	document.getElementById("chatOut").value = msgs.join('\n');
});
}

// Refresh when a new message is added
chatlogref.on("child_added", function(snapshot, prevChildKey) {
  retrieveMessages();
});


//------------------
window.addEventListener('keypress', function (e) {
    if (e.keyCode == 13) {
			var chatInput = document.getElementById("chatInput").value;
			if(chatInput !== ""){
				sendChat(chatInput);
			}
    }
}, false);

window.onresize = function(e) {
	refreshSize();
}
refreshSize();
function refreshSize(){
	document.getElementById("chatBot").style.top = window.innerHeight - 182 + "px";
	document.getElementById("chatTop").style.top = window.innerHeight - 182 + "px";
}

