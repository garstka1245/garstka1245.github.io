var playerdataref = database.ref("playerdata/");
var username;
var serverplayers = [];

function sendPos(x,y,z) {
	var user = firebase.auth().currentUser;
	var username = "";
	
	if (user != null) {
		user.providerData.forEach(function (user) {
			//console.log("  Name: " + user.displayName);
			username = user.displayName;
		});
	}
	
  firebase.database().ref('playerdata/' + username).set({
		name: username,
    x: x,
		y: y,
		z: z
  });
	//console.log("Updated Position: " + x + " " + y + " " + z);
}

function updatePositions(){
	var playerdata;
	
	database.ref("playerdata/").once("value", function(snap) {
		playerdata = Object.values(snap.val());
	});
	
	// if the list doesn't exist
	if(serverplayers.length < 1){
		for(var i = 0; i < playerdata.length; i++){
			serverplayers[i] = new player(playerdata[i].x,playerdata[i].y,playerdata[i].z, playerdata[i].name);
			scene.add(serverplayers[i].mesh);
			//player.updateMove(serverplayers[i].x,serverplayers[i].y,serverplayers[i].z);
		}
		
	}
	else{
		for(var i = 0; i < playerdata.length; i++){
			serverplayers[i].updateMove(playerdata[i].x,playerdata[i].y,playerdata[i].z);
		}
	}
	
	
}

playerdataref.on("child_changed", function(snapshot) {
  updatePositions();
});

//When the data becomes available it also triggers child_added, it does not trigger child_changed
playerdataref.on("child_added", function(snapshot) {
  updatePositions();
});

function userLoggedIn(){
	var user = firebase.auth().currentUser;
	username = user.displayName;
}


