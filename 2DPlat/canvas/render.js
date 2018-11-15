var c = document.getElementById("Canvas");
var ctx = c.getContext("2d");

function startProg(){
	setInterval(drawWorld, 20);
	setInterval(doWorld, 20);
}

// Objects
function block(x, y, w, h){
	block.numInstances = (block.numInstances || 0) + 1;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.yv = 0;
	this.xv = 0;
	this.m = 10;
	this.grounded = false;
	this.texture;
}
block.prototype.dispose = function() {
	return this.numInstances -= 1;
}
block.prototype.draw = function (){
	if(this.texture == null){
		ctx.strokeWidth = 2;
		ctx.strokeStyle = "#000000";
		ctx.fillStyle = "#fff0f0";
		ctx.fillRect(this.x ,c.height -this.w - this.y, this.w , this.h);
		ctx.strokeRect(this.x ,c.height -this.w - this.y, this.w , this.h);
	}
	else{
		this.texture.setAttribute("width", this.w);
        this.texture.setAttribute("height", this.h);
		ctx.drawImage(this.texture, this.x, 100 );
		console.log(this.y);
	}
}
block.prototype.addtexture = function (path){
	this.texture = document.createElement("IMG");
    this.texture.setAttribute("src", "canvas/textures/" + path + ".png");
    this.texture.setAttribute("alt", "NoTexture");
}

// Init World Objects
var world = [];
function physTest1(){
var test = new block(1000, 50, 90, 100);
test.addtexture("g");
//var test2 = new block(1000, 500, 90, 100);
//var test3 = new block(1000, 1000, 90, 100);
/*test.xv = 5;
test.yv = 10;
test2.xv = -5;
test2.yv = 18;
test3.xv = -2;
test3.yv = 0;*/
world.push(test);
//world.push(test2);
//world.push(test3);
}

// Draw World

function drawWorld(){
	ctx.clearRect(0,0,c.width,c.height);
	for(var i = 0; i < block.numInstances; i++){
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


function doWorld(){
	for(var i = 0; i < block.numInstances; i++){
		
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
		for(var a = 0; a < block.numInstances; a++){
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

physTest1();





