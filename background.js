Canvas = document.getElementById('background'),
Canvas.width = window.innerWidth;
Canvas.height = window.innerHeight;
ctx = Canvas.getContext('2d');
ctx.miterLimit = 1;//edges of paths don't freak out on sharp turns

var particleArray = [];

function pop(x, y){
ctx.fillStyle = "#eaeaea";
ctx.strokeStyle = "#eaeaea";
particleArray.push(new particles(x, y));
}

function particle(x, y){
this.x = x;
this.y = y;
this.life = 10;
}

function particles(x, y){
this.x = x;
this.y = y;
this.particle = [];
}
particles.prototype.draw = function(){
for(var i = 0; i < this.particle.length; i++){
ctx.fillRect(this.particle[i].x + (Math.random() - 0.5), this.particle[i].y + Math.random() + 10, 2, 2);
this.particle[i].life -= 2 + 2*Math.random();
}
}

function star(x, y){
this.x = x;
this.y = y;
this.on = true;
}
star.prototype.draw = function(){
//if(this.on){
ctx.fillStyle = "#d8d8d8";
ctx.strokeStyle = "#d8d8d8";
ctx.fillRect(this.x + 4, this.y, 2, 10);
ctx.fillRect(this.x, this.y + 4, 10, 2);
ctx.fillStyle = "#eaeaea";
ctx.strokeStyle = "#eaeaea";
ctx.fillRect(this.x + 3, this.y + 3, 4, 4);

//}
}

var stars = 20;
var starSpeed = 1;
var starChance = 50;
var starArray = [];
genStars();
clear();
	
//Render/Bounds
setInterval(function(){
	clear();
	for(var i = 0; i < stars; i++){	
		if(starArray[i].y < 0){
			pop(starArray[i].x, 0);
			starArray[i].y += Canvas.height;
		}

		starArray[i].draw();
		starArray[i].y -= starSpeed;
		starArray[i].x += Math.random() - 0.5;

	}
	for(var i = 0; i < particleArray.length; i++){
		particleArray[i].draw();
		
		for(var a = 0; a < particleArray[i].particles.length; a++){
		if (particleArray[i].particles[a].life <= 0){
			particleArray[i].particles.splice(a, 1);
		}
		}
		if (particleArray[i].particles.length = 0){
			particleArray.splice(i, 1)
		}
	}	
},20);

//Flicker on/off timer
setInterval(function(){
for(var i = 0; i < stars*Math.random(); i++){	
if(Math.random() > (1 - (starChance/100))){
starArray[i].on = true;
}
else{
starArray[i].on = false;
}
}	
},200);

setInterval(function(){
//genStars();
},500);
	

function clear(){
ctx.fillStyle = "black";
ctx.strokeStyle = "black";	
ctx.fillRect(0,0,Canvas.width, Canvas.height);
}
	
function genStars(){
for(var i = 0; i < stars; i++){
starArray[i] = new star(Math.random()*Canvas.width, Canvas.height + (Math.random()*Canvas.height));
}
}	
	

	
	