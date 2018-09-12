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

////
var a=0;



function parse(m){
	console.log("Parsing: " + m);
	if(m.substr(0,4) == "help"){
		print(availableCommands,"green");
	}
	else if(m.substr(0,4) == "type"){
		type(m.substr(5,m.length));
	}
	else{
		invalid();
	}
}


////


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







