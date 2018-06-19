Canvas = document.getElementById('background'),
Canvas.width = window.innerWidth;
Canvas.height = window.innerHeight;
ctx = Canvas.getContext('2d');
ctx.miterLimit = 1;//edges of paths don't freak out on sharp turns
	
function cube(x,y){
ctx.fillStyle = "black";
ctx.strokeStyle = "black";
ctx.fillRect(x,y,50,50);
}
function star(x,y){
ctx.fillStyle = "grey";
ctx.strokeStyle = "grey";
ctx.fillRect(x+4,y,2,10);
ctx.fillRect(x,y+4,10,2);
}




setInterval(function(){
for(var i = 0; i < 20; i++){
cube(Math.random()*Canvas.width,Math.random()*Canvas.height)
}
},20);
setTimeout(function(){
ctx.fillRect(0,0,Canvas.width,Canvas.height);	
	
},7000);

setInterval(function(){
for(var i = 0; i < 10; i++){
star(Math.random()*Canvas.width,Math.random()*Canvas.height)
}
},200);
	
	