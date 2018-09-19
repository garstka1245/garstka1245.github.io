document.getElementById("input").addEventListener("keydown", function(event) {
if (event.keyCode === 13) {
	m = document.getElementById("input").value;
    parse(m);
}
});

var m;

//Text returned to Console.
var availableCommands = ["type [msg]",""]
var glSubCommands = ["background [color]"]
var invalidMsg = ["Invalid command, try again",""]

//// Parsing
var a=0;



function parse(m){
	console.log("Parsing: " + m);
	if(m.substr(0,4) == "help"){
		print(availableCommands,"green");
	}
	else if(m.substr(0,4) == "type"){
		type(m.substr(5,m.length));
	}
	else if(m.substr(0,3) == "pin"){
		pinmsg(m.substr(3,m.length));
	}
	else{
		invalid();
	}
}


////  Functions


function print(msg,c){
if(a < msg.length){
	setTimeout(function(){a++;print(msg);},1000);
	document.getElementById("output").value = msg[a];
	document.getElementById("output").style.color = c;
	if(msg[a]!=""){
	console.log("Returned: " + msg[a]);
	}
}
else{a=0;document.getElementById("input").style.color = "black";}
}

function spaceString(m,after,space){
return m.substr(after,m.length).split(' ')[space]
}



function invalid(){
	print(invalidMsg,"red");
}

function type(subm){
	var audio = new Audio('keyboard_click.mp3');
	var audio2 = new Audio('keyboard_click.mp3');

	var b = 0;
	var typeloop = setInterval(
	function(){
	if(b < subm.length){
		if(b%2){
				audio.play();
			}
			else{
				audio2.play();
			}
		}
		else{
			console.log("Returned: " + subm + " :typed");
			clearInterval(typeloop);
		}
		b++;
		document.getElementById("output").value = subm.substr(0, b);
	}
	, 150);
}

function pinmsg(subm){
	if(subm.substr(0,1) == " "){
		setPin(subm.substr(1,subm.length));
	}
	else{
		getPin();
		document.getElementById("output").value = "";
		document.getElementById("output").value = "Pinned Msg: " + pinnedmsg;
	}
}

//Database
	var config = {
		apiKey: "AIzaSyDEIx3Lp_UiBOTfJK28hGFiwhVRECDbm-w",
		authDomain: "chriswiztk.firebaseapp.com",
		databaseURL: "https://chriswiztk.firebaseio.com",
		projectId: "chriswiztk",
		storageBucket: "chriswiztk.appspot.com",
		messagingSenderId: "781761041218"
	};
	firebase.initializeApp(config);

var database = firebase.database();

var pin = database.ref();
//.on listener, .once to get once
var pinnedmsg;
function getPin(){
	pin.once('value', function(snapshot) {
		pinnedmsg = snapshot.val().pin;
		console.log("Returned: " + pinnedmsg);
	});
}

function setPin(string) {
	console.log("Set pin.");
  database.ref().set({
    pin: string
  });
}







