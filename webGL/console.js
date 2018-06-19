document.getElementById("input").addEventListener("keydown", function(event) {
if (event.keyCode === 13) {
	m = document.getElementById("input").value;
    parse(m);
}
});
	
var m;

//Text returned to Console.
var availableCommands = ["gl [subcommand]",""]
var glSubCommands = ["background [color]"]
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

////
/*
can i make this with 
objects as commands, eg.
command, 
function,
layer

and can i parse that with layers?



*/



function parse(m){
console.log("Parsing: " + m);
if(m.substr(0,4) == "help"){
	help();
}
else if(m.substr(0,2) == "gl"){
	gl(m.substr(2,m.length));
}
else{
	invalid();
}
}

function help(){
	print(availableCommands,"green");
}

function invalid(){
	print(invalidMsg,"red");
}

function gl(subm){
	console.log(subm.substr(1,10));
	if(subm.substr(1,11) == "background "){
		var c = spaceString(subm,12,0);
		print(["color set to" + c],c);
		

	}
	else{
		invalid();
	}
	
}



function command(input){
	this.input=input;
}
command.prototype.result






