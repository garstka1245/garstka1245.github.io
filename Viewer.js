

var click={
grab:0,
xdiff:[],
ydiff:[],
xinit:[],
yinit:[]	
};
var up = new vector(0,100,0);

//Mouse controls
Canvas.addEventListener ("mousedown", function (e) {
if(e.which == 1){
click.grab = 1;
}
if(e.which == 2){
click.grab = 2;
}
if(e.which == 3){
click.grab = 3;
}
});
Canvas.addEventListener ("mouseup", function (e) {
click.grab = 0;
});
Canvas.addEventListener ("mousemove", function (e) {

if(click.grab == 1){
for(var i = 0; i < shape.length; i++){
shape[i].x += ((e.x - (Canvas.width/2))/100);
shape[i].y -= ((e.y - (Canvas.height/2))/100);	
}
}
else if(click.grab == 2){
for(var i = 0; i < shape.length; i++){
shape[i].z+= ((e.y - (Canvas.height/2))/100);
}	
}
else if(click.grab == 3){
for(var i = 0; i < shape.length; i++){
shape[i].rotateY((e.x-(Canvas.width/2))/10000);	
shape[i].rotateZ((e.y-(Canvas.height/2))/10000);	
}
}
});
//Touch controls
Canvas.addEventListener("touchstart", function (e) {
if(e.touches.length > 1){
click.grab = 3;
}
else{
click.grab = 1;
}
});
Canvas.addEventListener("touchend", function (e) {
click.grab = 0;
});
Canvas.addEventListener("touchmove", function (e) {
if(click.grab == 1){
for(var i = 0; i < shape.length; i++){
shape[i].x += ((e.touches[0].screenX - (Canvas.width/2))/100);
shape[i].y -= ((e.touches[0].screenY - (Canvas.height/2))/100);	
}
}
else if(click.grab == 3){
for(var i = 0; i < shape.length; i++){
shape[i].rotateY((e.touches[0].screenX-(Canvas.width/2))/10000);	
shape[i].rotateZ((e.touches[0].screenY-(Canvas.height/2))/10000);	
}
}
});


//Keyboard controls
var controls={
w:false,
a:false,
s:false,
d:false,
q:false,
e:false,
r:false,
f:false,
}

window.onkeydown = function(e) {
   var key = e.keyCode ? e.keyCode : e.which;

if (key==87){//w
  controls.up=true;
}
if (key==65){//a
  controls.left=true;
}
if (key==83){//s
  controls.down=true;
}
if (key==68){//d
   controls.right=true;
}
if (key==69){//e
   controls.e=true;
}

};
window.onkeyup = function(e) {
   var key = e.keyCode ? e.keyCode : e.which;

if (key==87){//w
  controls.up=false;
}
if (key==65){//a
  controls.left=false;
}
if (key==83){//s
  controls.down=false;
}
if (key==68){//d
  controls.right=false;
}
if (key==69){//e
   controls.e=false;
}
};

setInterval(function() {
if(controls.w == true){
	console.log(shape);
}
},20);


function refresh(){
x=[];
y=[];
shape = [];
faces = [];
}

function Cube(){
refresh();
xC = 700;
yC = -300;
asyncCall(200,"basic/cube");
}
function Monkey(){
refresh();
xC = 700;
yC = 0;
asyncCall(200,"basic/monkey");
setTimeout(function(){
for(var i = 0; i < shape.length; i++){
shape[i].rotateY(Math.PI);
}
},100);
}
function Wolf(){
refresh();
xC = 700;
yC = 100;
asyncCall(1,"animals/wolf");
}
function Sphere(){
refresh();
xC = 500;
yC = -100;
asyncCall(200,"basic/level4");
}


