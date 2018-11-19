var c = document.getElementById("Canvas");
var ctx = c.getContext("2d");

window.onresize = function(e) {
	c.style.width = window.innerWidth;
	c.style.height = window.innerHeight;
}

var loadedImgs = [];
var editor = true;

function startProg(){
	if(editor)makeEditorElements();

	setInterval(doWorld, 20);
	setInterval(drawWorld, 20);
	
	init(physTest1());
}

// Objects

/*
Square 
>GSquare
>>Player
>Plat
>Item

*/ 
//square
function square(x, y, w, h){
	world.push(this);
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.yv = 0;
	this.xv = 0;
	this.texture;
}
square.prototype.dispose = function(squareObj) {
	for(var i = 0; i < world.length; i++){
		if(world[i] == squareObj){
			world.splice(i, 1);
		}
	}
}
square.prototype.draw = function (){
	if(this.texture == null){
		ctx.strokeWidth = 2;
		ctx.strokeStyle = "#000000";
		ctx.fillStyle = "#fff0f0";
		ctx.fillRect(this.x ,c.height -this.w - this.y, this.w , this.h);
		ctx.strokeRect(this.x ,c.height -this.w - this.y, this.w , this.h);
	}
	else{
		ctx.drawImage(this.texture, this.x, c.height - this.y - this.h, this.w, this.h);
	}
}
square.prototype.addtexture = function (img){
	this.texture = img;
}
//gsquare
function gsquare(x, y, w, h){
	square.apply(this,arguments)
	this.m = 10;
	this.grounded = false;
}
// Extends square
gsquare.prototype = square.prototype;
gsquare.prototype.constructor = gsquare;   
//player
function player(sx, sy){
	gsquare.apply(this,arguments)
	this.x = sx;
	this.y = sy;
	this.w = 100;
	this.h = 100;
}
// Extends gsquare
player.prototype = gsquare.prototype;
player.prototype.constructor = player;



//Textures
function getPng(path) {
    return new Promise(function(resolve, reject) {
        var image = new Image();
        image.onload = function() {
			resolve(image);//work
		};
	image.src = path;
	 });
}

async function loadImg(name) {
	var result = await getPng("canvas/textures/" + name + ".png");
	loadedImgs.push(result);
}

function init(level){
	Promise.all([loadImg("g")]).then(function(){
		console.log("Assets loaded.");
		level();
	}, function(){
		console.log("Failed loading assets, please refresh or try a different browser? *shrug*");
	});
}

// Init World Objects
var world = [];

function clearLvl(){
	world = [];
}

function physTest1(){
var test = new gsquare(1000, 50, 100, 100);
test.addtexture(loadedImgs[0]);
var test2 = new gsquare(1000, 500, 100, 100);
var test3 = new player(1000, 1000);
test.xv = 5;
test.yv = 10;
test2.xv = -5;
test2.yv = 18;
}

// Draw World

function drawWorld(){
	ctx.clearRect(0,0,c.width,c.height);
	for(var i = 0; i < world.length; i++){
		world[i].draw();
	}
}


// World Phys.

/*
2px = 1m
g = -10px/s
so it should accelerate a 2/5 of a pixel every 20ms loop

mv = m1v1 + m2v2
*/

function collides(i, a){
	if(
	// Right x Axis check
	((world[i].x >= world[a].x && world[i].x <= world[a].x + world[a].w) || 
	// Left x Axis check
	(world[i].x + world[i].w>= world[a].x && world[i].x + world[i].w<= world[a].x + world[a].w)) &&
	// Bot y Axis check
	((world[i].y >= world[a].y && world[i].y <= world[a].y + world[a].h) || 
	// Top y Axis check
	(world[i].y + world[i].h >= world[a].y && world[i].y + world[i].h <= world[a].y + world[a].h))
	){
		return true;
	}
	else{
		return false;
	}
}

function collidesPoint(x, y, a){
	console.log(x);
	console.log(a.x);
	if(x > a.x && x < a.x + a.w ){//%& y > a.y && y < a.y + a.h){
		return true;
	}
	else{
		return false;
	}
}


function doWorld(){
	if(!editor){
	for(var i = 0; i < world.length; i++){
		
		world[i].x += world[i].xv;
		world[i].y += world[i].yv;
	
		// Floor
		if(world[i].y > -world[i].yv){
			world[i].yv -= (2/5);
			world[i].grounded = false;
		}
		else{
			world[i].yv = -world[i].yv *.2;
			world[i].grounded = true;
		}
		//Right wall
		if(world[i].x + world[i].w > c.width){
			world[i].xv = -world[i].xv *1;
		}
		//Left wall
		if(world[i].x < 0){
			world[i].xv = -world[i].xv *1;
		}
		
		// Collision with other objects
		// inellastic collision 
		for(var a = 0; a < world.length; a++){
			// if collided, swap velocities?
			if(collides(i, a) && world[a].grounded){
				world[i].yv = -world[i].yv;
				//world[i].grounded = true;
			}
			if(collides(i, a)){
				var swap = world[i].xv;
				world[i].xv = world[a].xv;
				world[a].xv = swap;
			}
		}
	}
	}
}

var squareBtn;
var moveBtn;
var resizeBtn;

var buttonsList = [];

// Editor menu
function makeButton(name, element){
	element = document.createElement("button");
	element.innerHTML = name;
	element.style.position = "absolute";
	element.style.top = (buttonsList.length * 50) + 30;
	element.style.left = "2px";
	element.style.height = "40px";
	element.style.width = "80px";
	element.style.backgroundColor  = "#00aaaa";
	element.style.borderColor = "black";
	document.body.appendChild(element);
	
	buttonsList.push(element);
	
	element.onclick = function(){
		for(var i = 0; i < buttonsList.length; i++){
			buttonsList[i].disabled = false;
		}
		element.disabled = true;
	};
}

function makeEditorElements(){
	//Square
	makeButton("Square", squareBtn);
	//Move
	makeButton("Move", moveBtn);
	//Resize
	makeButton("Resize", resizeBtn);
}

function deleteEditorElements(){
	for (var i =0; i < buttonsList.length; i++){
		buttonsList[i].remove();
	}
	buttonsList = [];
}

//Editing
c.addEventListener("click", function(e) {
	doEdit(e);
}, false);


function doEdit(e){
	if(editor){
		//Square
		if(buttonsList[0].disabled){
			
		}
		//Move
		else if(buttonsList[1].disabled){
			console.log("move!")
			for(var i = 0; i < world.length; i++){
				if(collidesPoint(e.x, e.y, world[i])){
					console.log("grabed object!");
				}
			}
		}
		//Resize
		else if(buttonsList[2].disabled){
			
		}
	}
}









