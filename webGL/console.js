

document.getElementById("input").addEventListener("keydown", function(event) {
if (event.keyCode === 13) {
	m = document.getElementById("input").value;
    parse(m);
}
});
	
var m;

//Text returned to Console.
var availableCommands = ["gl [subcommand]",""]
var glSubCommands = ["background [color]","texture [texture index]",""]
var invalidMsg = ["Invalid command, try again",""]

////
var a=0;
function print(msg,c){
if(a < msg.length){
	setTimeout(function(){a++;print(msg);},1000);
	document.getElementById("input").value = msg[a];
	document.getElementById("input").style.color = c;
	if(msg[a]!=""){
	console.log("Returned: " + msg[a]);
	}
}
else{a=0;document.getElementById("input").style.color = "black";}
}

function spaceString(m,after,space){
return m.substr(after,m.length).split(' ')[space]
}

function parse(m){
console.log("Parsing: " + m);
if(m.substr(0,4) == "help"){
	print(availableCommands,"green");
}
else if(m.substr(0,2) == "gl"){
	glsub(m.substr(2,m.length));
}
else{
	print(invalidMsg,"red");
}
}


	var backgroundColor = {
		r:0.0,
		g:0.0,
		b:0.0
	}

function glsub(subm){
	if(subm.substr(1,11) == "background "){
		//#123456
		var c = parseInt(subm.substr(13,19),16);
		backgroundColor.r = (c >> 16)/255;
		backgroundColor.g = (c >> 8 & 0x00FF)/255;
		backgroundColor.b = (c & 0x0000FF)/255;
		console.log("color set to: " + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b);
	}
	else if(subm.substr(1,8) == "texture "){
		TextureIndex = parseInt(subm.substr(8,subm.length));
		console.log("Loaded texture: " + parseInt(subm.substr(8,subm.length)));
		refreshProg();
	}
	else if(subm.substr(1,6) == "model "){
		ModelIndex = parseInt(subm.substr(6,subm.length));
		console.log("Loaded model: " + parseInt(subm.substr(6,subm.length)));
		refreshProg();
	}
	else{
		print(glSubCommands,"red");
	}
}







