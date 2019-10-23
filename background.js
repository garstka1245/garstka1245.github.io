//CanvasSetup
Canvas = document.getElementById('background');
ctx = Canvas.getContext('2d');
ctx.miterLimit = 1; // Edges of paths don't freak out on sharp turns

//---
//Global Variables
{
//particles
var particleArray = [];
//stars
var starArray = [];
var stars = 20;
var starSpeed = 1;
var starChance = 50;
//vaporlines
var linesY = [0,1,2,3,4];
var vaporTop = Canvas.height*3/4;
}
//---
//Objects
{
function pop(x, y){
	ctx.fillStyle = "#eaeaea";
	ctx.strokeStyle = "#eaeaea";
	particleArray.push(new particles(x, y, Math.floor(Math.random()*3 + 2)));
}

function particle(x, y){
	this.x = x;
	this.y = y;
	this.deltaX = Math.random()*8 - 4;
	this.life = 50;
}

function particles(x, y, num){
	this.x = x;
	this.y = y;
	this.particle = [];
	for(var i = 0; i < num; i++){
		this.particle.push(new particle(x + (Math.random()*10-5),y));
	}
}
particles.prototype.draw = function(){
	ctx.fillStyle = "#f9b5b3";
	ctx.strokeStyle = "#f9b5b3";
	for(var i = 0; i < this.particle.length; i++){
		ctx.fillRect(this.particle[i].x + (Math.random() - 0.5), this.particle[i].y + Math.random() + 10, 2, 2);
		this.particle[i].y += 1;
		this.particle[i].x += this.particle[i].deltaX;
		this.particle[i].life -= 2 + 2*Math.random();
	}
}

function star(x, y){
	this.x = x;
	this.y = y;
	this.on = true;
}
star.prototype.draw = function(){
	if(this.on){
		ctx.fillStyle = "#e8da99";//"#d8d8d8";
		ctx.strokeStyle = "#e8da99";//"#d8d8d8";
		ctx.fillRect(this.x + 4, this.y, 2, 10);
		ctx.fillRect(this.x, this.y + 4, 10, 2);
		ctx.fillStyle = "#efe19b"//"#eaeaea";
		ctx.strokeStyle = "#efe19b"//"#eaeaea";
		ctx.fillRect(this.x + 3, this.y + 3, 4, 4);
	}
	else{
		ctx.fillStyle = "#8e865e";//"#565656";
		ctx.strokeStyle = "#8e865e";//"#565656";
		ctx.fillRect(this.x + 4, this.y, 2, 10);
		ctx.fillRect(this.x, this.y + 4, 10, 2);
		ctx.fillStyle = "#bcb27c"//"#8e8e8e";
		ctx.strokeStyle = "#bcb27c";//"#8e8e8e";
		ctx.fillRect(this.x + 3, this.y + 3, 4, 4);
	}
}	
}
//---
//Functions
{
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


function drawVaporGrid(){
	ctx.strokeStyle = "#0a0235";
	ctx.fillStyle = "#361149";
	ctx.fillRect(0, vaporTop, Canvas.width, Canvas.height);
	ctx.fillRect(0, vaporTop, Canvas.width, Canvas.height);
	
	ctx.strokeStyle = "#f049fc";
	ctx.lineWidth = "3";
	ctx.beginPath();
	ctx.moveTo(0, vaporTop);
	ctx.lineTo(Canvas.width, vaporTop);
	
	for(var i = -10; i < 10; i++){
		ctx.moveTo(Canvas.width/2 + 50*i, vaporTop);
		ctx.lineTo(Canvas.width/2 + 250*i, Canvas.height);
	}
	for(var i = 0; i < linesY.length; i++){
		ctx.moveTo(0, vaporTop + Math.pow(3, (linesY[i])));
		ctx.lineTo(Canvas.width, vaporTop + Math.pow(3, (linesY[i])));
		linesY[i] += 0.01;
		if(Math.pow(3, (linesY[i])) > 200){
			linesY[i] = 0;
		}
	}
	ctx.stroke();
	ctx.lineWidth = "1";
}
}
//---
//Calls
clear();
genStars();
//---
//Timers
{
//Render/Bounds
setInterval(function(){
	clear();
	for(var i = 0; i < stars; i++){	
		if(starArray[i].y < 0){
			pop(starArray[i].x, starArray[i].y);
			starArray[i].y += Canvas.height;
		}
 
		starArray[i].draw();
		starArray[i].y -= starSpeed;
		starArray[i].x += Math.random() - 0.5;

	}
	for(var i = 0; i < particleArray.length; i++){
		particleArray[i].draw();
		
		for(var a = 0; a < particleArray[i].particle.length; a++){
			if (particleArray[i].particle[a].life <= 0){
				particleArray[i].particle.splice(a, 1);
			}
		}
		if (particleArray[i].particle.length <= 0){
			particleArray.splice(i, 1)
		}
	}

	drawVaporGrid();
	
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
},1000);

}
//---
//Resizing
{
/* 
//Debug mouse position
document.addEventListener ("mousedown", function (e) {
	console.log("x: " + e.clientX * (Canvas.width/parseInt(Canvas.style.width)) + "   y: " + e.pageY * (Canvas.height/parseInt(Canvas.style.height)));
});
*/

window.onresize = function(e) {
	refreshSize();
}

refreshSize();
function refreshSize
	// This gets so confusing, I give up.
	Canvas.style.width = window.innerWidth - 20 + "px";
	Canvas.style.height = window.innerHeight - 20 + "px";
}
}