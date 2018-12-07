//Keyboard controls
function keyPressed(target) {
	if(target == "ArrowLeft"){
		return controls[37];
	}
	else if(target == "ArrowUp"){
		return controls[38];
	}
	else if(target == "ArrowRight"){
		return controls[39];
	}
	else if(target == "ArrowDown"){
		return controls[40];
	}
	else if(target == "PageUp"){
		return controls[33];
	}
	else if(target == "PageDown"){
		return controls[34];
	}
	else if(target == "Shift"){
		return controls[16];
	}
	else if(target == "`"){
		return controls[192];
	}
	else{
    return controls[target.toUpperCase().charCodeAt(0)];
	}
}

var controls=[];

//Mouse controls
var MouseSensitivity = 3;

var havePointerLock = 'pointerLockElement' in document ||
    'mozPointerLockElement' in document ||
    'webkitPointerLockElement' in document;
	
glCanvas.requestPointerLock = glCanvas.requestPointerLock ||
			     glCanvas.mozRequestPointerLock ||
			     glCanvas.webkitRequestPointerLock
				 
document.exitPointerLock = document.exitPointerLock ||
			   document.mozExitPointerLock ||
			   document.webkitExitPointerLock;

function outOfFocus(){
	document.exitPointerLock();
}
	
document.addEventListener('pointerlockchange', outOfFocus(), false);
document.addEventListener('mozpointerlockchange', outOfFocus(), false);
document.addEventListener('webkitpointerlockchange', outOfFocus(), false);

// Hook mouse move events
document.addEventListener("mousemove", function (e){
	if(document.pointerLockElement === glCanvas || document.mozPointerLockElement === glCanvas){
		alphaCameraRot += e.movementX/(1000*(1/MouseSensitivity));
		betaCameraRot -= e.movementY/(1000*(1/MouseSensitivity));
	}
}, false);

var glcanvas = document.getElementById("glCanvas");

function resize(){
	glcanvas.width  = window.innerWidth;
	glcanvas.height = window.innerHeight;
}
	
glCanvas.addEventListener ("mousedown", function (e) {
	//Lock pointer controls
	glCanvas.requestPointerLock();
	//Fullscreen
	//why are the pixels so off?
	if(e.x > 1536 - 50 && e.y > 686 - 50){
	//glcanvas.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
	glcanvas.mozRequestFullScreen();
	glcanvas.msRequestFullscreen();
	glcanvas.requestFullscreen();
	glcanvas.width  = window.innerWidth;
	glcanvas.height = window.innerHeight;
	}
});
glCanvas.addEventListener ("mouseup", function (e) {

});

	var xRotVel = 0;
	var yRotVel = 0;
	var zRotVel = 0;
	
	var zCameraPos = -6;
	var xCameraPos = 0;
	var yCameraPos = 0;
	
	var alphaCameraRot = Math.PI/2;
	var betaCameraRot = 0;
	
	var zCameraRot = 0;
	var xCameraRot = 0;
	var yCameraRot = 0;
	
	var cameraSpeed = 0.1;
	
	var debugDispToggle = true;
	
//Debug loop
function debugDisp(){
	document.getElementById("debug").innerHTML = 
			"alphaCamRot: " + Math.sin(alphaCameraRot).toFixed(3) + 
	"<br> betaCamRot: " + betaCameraRot.toFixed(3) + 
	"<br> " + 
	"<br> yLookingAt: " + (betaCameraRot  + yCameraPos).toFixed(3) + 
	"<br> " +
	"<br> xCamPos: " +  xCameraPos.toFixed(3) +
	"<br> yCamPos: " +  yCameraPos.toFixed(3) +
	"<br> zCamPos: " +  zCameraPos.toFixed(3) +
	"<br> <br> w a s d to move around, space up, shift down, click to lock mouse, esc to get out, commands to type in the box on top: gl background #660000 sets background color to a hex value; gl model 8 changes models 0-12 i think i have; gl texture 0-2 changes textures; ~ to toggle this.";
}
//Controls loop
function refreshControls(){
	if(document.pointerLockElement === glCanvas || document.mozPointerLockElement === glCanvas){
		if(keyPressed("w")){
			zCameraPos += Math.sin(alphaCameraRot)*cameraSpeed;
			xCameraPos += Math.cos(alphaCameraRot)*cameraSpeed;
		}
		else if(keyPressed("s")){
			zCameraPos -= Math.sin(alphaCameraRot)*cameraSpeed;
			xCameraPos -= Math.cos(alphaCameraRot)*cameraSpeed;
		}
		if(keyPressed("a")){
			xCameraPos += Math.sin(alphaCameraRot)*cameraSpeed;
			zCameraPos -= Math.cos(alphaCameraRot)*cameraSpeed;
		}
		else if(keyPressed("d")){
			xCameraPos -= Math.sin(alphaCameraRot)*cameraSpeed;
			zCameraPos += Math.cos(alphaCameraRot)*cameraSpeed;
		}
		if(keyPressed(" ")){
			yCameraPos += cameraSpeed;
		}
		else if(keyPressed("Shift")){
			yCameraPos -= cameraSpeed;
		}
		
		if(keyPressed("ArrowUp")){
			yRotVel += 0.01;
		}
		if(keyPressed("ArrowDown")){
			yRotVel -= 0.01;
		}
		if(keyPressed("ArrowLeft")){
			xRotVel += 0.01;
		}
		if(keyPressed("ArrowRight")){
			xRotVel -= 0.01;
		}
		if(keyPressed("PageUp")){
			zRotVel += 0.01;
		}
		if(keyPressed("PageDown")){
			zRotVel -= 0.01;
		}
		if(keyPressed("`")){
			if(debugDispToggle){
			console.log(debugDispToggle);
				setTimeout(function(){debugDispToggle = false;},200);
			}
			else{
				setTimeout(function(){debugDispToggle = true;},200);
			}
		}
	}
}
//Change camera speed
document.addEventListener("wheel", function (e) {
	//console.log(e.deltaY);
	if(cameraSpeed > 0){
	cameraSpeed -= e.deltaY/40;
	}
	else{
	cameraSpeed = 0.1;
	}
});
//Touch control
var TouchXS = 0;
var TouchYS = 0;
var movementX = 0;
var movementY = 0;

glCanvas.addEventListener("touchstart", function (e) {
	//Multiple fingers
if(e.touches.length > 1){

}
	//One
else{
  TouchXS = e.touches[0].screenX;
  TouchYS = e.touches[0].screenY;
}
});

glCanvas.addEventListener("touchmove", function (e) {
	movementX = -Math.min(Math.max((TouchXS - e.touches[0].screenX), -100), 100);
	movementY = -Math.min(Math.max((TouchYS - e.touches[0].screenY), -100), 100);
	alphaCameraRot += (movementX)/(1000*(1/MouseSensitivity));
	betaCameraRot -= (movementY)/(1000*(1/MouseSensitivity));
	TouchXS = e.touches[0].screenX;
	TouchYS = e.touches[0].screenY;
});

glCanvas.addEventListener("touchend", function (e) {
});

window.onkeydown = function(e) {
   var key = e.keyCode ? e.keyCode : e.which;

	for(var i =0; i < 222; i++){
		if(key == i){
			controls[i]= true;
		}
	}
};

window.onkeyup = function(e) {
   var key = e.keyCode ? e.keyCode : e.which;

	for(var i =0; i < 222; i++){
		if(key == i){
			controls[i]= false;
		}
	}
};