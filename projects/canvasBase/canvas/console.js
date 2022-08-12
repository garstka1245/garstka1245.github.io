
// Listen for enter
document.onkeypress = function (e) {
    e = e || window.event;
    if (e.keyCode === 13) {
    	var command = document.getElementById("input").value.toLowerCase();
  		parse(command);
    }
};

// Text returned to Console.
var availableCommands = ["lvl [subcommand]","canvas [subcommand]","edit [true/false]",""]
var lvlsub = ["phys","clear",""];
var editsub = ["true","false",""];
var invalidMsg = ["Invalid command, try again",""]

////
var a=0;
function print(msg, c){
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
else if(m.substr(0,4) == "edit"){
	edit(m.substr(4,m.length));
}
else{
	invalid();
}
}


function lvl(subm){
	if(subm == " phys"){
		document.getElementById("input").value = "";
		init(physTest1());
		console.log("Level set");
	}
	else if (subm == " clear"){
		document.getElementById("input").value = "";
		clearLvl();
		console.log("Level cleared");
	}
	else{
		print(lvlsub,"green");
	}
}

function edit(subm){
	if(subm == " true"){
		document.getElementById("input").value = "";
		if(!editor){
			editor = true;
			makeEditorElements();
		}
		console.log("Edit true");
	}
	else if (subm == " false"){
		document.getElementById("input").value = "";
		if(editor){
			editor = false;
			deleteEditorElements();
		}
		console.log("Edit false");
	}
	else{
		print(editsub,"green");
	}
}

function help(){
	print(availableCommands,"green");
}

function invalid(){
	print(invalidMsg,"red");
}





