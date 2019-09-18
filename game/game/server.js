var playerdataref = database.ref("playerdata/");


function sendPos(x,y,z) {
	var user = firebase.auth().currentUser;
	var username = "";
	
	if (user != null) {
		user.providerData.forEach(function (user) {
			console.log("  Name: " + user.displayName);
			username = user.displayName;
  });
}
	
  firebase.database().ref('playerdata/' + username).set({
		name: username,
    x: x,
		y: y,
		z: z
  });
	console.log("Updated Position: " + x + " " + y + " " + z);
}

function updatePositions(){
	var username = "";
	var playerdata;
	
	var user = firebase.auth().currentUser;
	if (user != null) {
		user.providerData.forEach(function (user) {
			console.log("  Name: " + user.displayName);
			username = user.displayName;
  });
	}
	
	database.ref("playerdata/" + username).once("value", function(snap) {
		playerdata = snap.val();
	});
		
	console.log(playerdata);
	
	player1.updateMove(playerdata.x,playerdata.y,playerdata.z);
	
}

playerdataref.on("child_changed", function(snapshot) {
  updatePositions();
});

//When the data becomes available it also triggers child_added, it does not trigger child_changed
playerdataref.on("child_added", function(snapshot) {
  updatePositions();
});




