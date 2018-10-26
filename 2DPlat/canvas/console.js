

document.getElementById("input").addEventListener("keydown", function(event) {
if (event.keyCode === 13) {
	m = document.getElementById("input").value;
	m = m.toLowerCase();
    parse(m);
}
});
	
var m;

//Text returned to Console.
var availableCommands = ["lvl [subcommand]","canvas [subcommand]",""]
var lvlsub = ["phys",""];
var invalidMsg = ["Invalid command, try again",""]

////
var a=0;
function print(msg,c){
if(a < msg.length){
	setTimeout(function(){a++;print(msg);},1000);
	document.getElementById("input").disabled = true;
	document.getElementById("input").value = msg[a];
	document.getElementById("input").style.color = c;
	if(msg[a]!=""){
	console.log("Returned: " + msg[a]);
	}
	else{document.getElementById("input").style.color = "black";
			document.getElementById("input").disabled = false;}
}
else{a=0;}
}

function spaceString(m,after,space){
return m.substr(after,m.length).split(' ')[space]
}


function parse(m){
console.log("Parsing: " + m);
if(m.substr(0,4) == "help"){
	help();
}
else if(m.substr(0,3) == "lvl"){
	lvl(m.substr(3,m.length));
}
else{
	invalid();
}
}


function lvl(subm){
	if(subm == " phys"){
		document.getElementById("input").value = "";
		physTest1();
		console.log("Level set");
	}
	else{
		print(lvlsub,"green");
	}
}

function help(){
	print(availableCommands,"green");
}

function invalid(){
	print(invalidMsg,"red");
}





