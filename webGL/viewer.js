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
	else{
    return controls[target.toUpperCase().charCodeAt(0)];
	}
}

var controls=[];

//Mouse controls
var MouseSensitivity = 6;

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
	xCameraRot -= e.movementX/(1000*(1/MouseSensitivity));	
	zCameraRot += e.movementX/(1000*(1/MouseSensitivity));
	yCameraRot -= e.movementY/(1000*(1/MouseSensitivity));
}, false);

	
glCanvas.addEventListener ("mousedown", function (e) {
	//Lock pointer controls
	glCanvas.requestPointerLock();

});
glCanvas.addEventListener ("mouseup", function (e) {

});

	var xRotVel = 0;
	var yRotVel = 0;
	var zRotVel = 0;
	
	var zCameraPos = -6;
	var xCameraPos = 0;
	var yCameraPos = 0;
	
	var zCameraRot = 0;
	var xCameraRot = 0;
	var yCameraRot = 0;
	
 /*//Debug 
setInterval(function(){
	//console.log("xCamRot: " + (Math.sin(xCameraRot) + xCameraPos));
	//console.log("zCamRot: " + (Math.cos(zCameraRot) + zCameraPos));
	//console.log("yCamRot: " + (yCameraRot + yCameraPos));
}, 100);
*/
function refreshControls(){
	if(keyPressed("w")){
		yRotVel += 0.1;
	}
	else if(keyPressed("s")){
		yRotVel -= 0.1;
	}
	if(keyPressed("a")){
		xRotVel += 0.1;
	}
	else if(keyPressed("d")){
		xRotVel -= 0.1;
	}
	if(keyPressed("r")){
		zRotVel += 0.1;
	}
	else if(keyPressed("f")){
		zRotVel -= 0.1;
	}
	
	if(keyPressed("ArrowUp")){
		zCameraPos += Math.cos(zCameraRot)/10;
		xCameraPos += Math.sin(xCameraRot)/10;
	}
	if(keyPressed("ArrowDown")){
		zCameraPos -= Math.cos(zCameraRot)/10;
		xCameraPos -= Math.sin(xCameraRot)/10;
	}
	if(keyPressed("ArrowLeft")){
		xCameraPos += Math.cos(zCameraRot)/10;
		zCameraPos -= Math.sin(xCameraRot)/10;
	}
	if(keyPressed("ArrowRight")){
		xCameraPos -= Math.cos(zCameraRot)/10;
		zCameraPos += Math.sin(xCameraRot)/10;
	}
	if(keyPressed("PageUp")){
		yCameraPos += 0.1;
	}
	if(keyPressed("PageDown")){
		yCameraPos -= 0.1;
	}
}


//Touch control
glCanvas.addEventListener("touchstart", function (e) {
if(e.touches.length > 1){
click.grab = 3;
click.xinit = e.touches[0].screenX;
click.yinit = e.touches[0].screenY;
}
else{
click.grab = 1;
click.xinit = e.touches[0].screenX;
click.yinit = e.touches[0].screenY;
}
});

glCanvas.addEventListener("touchend", function (e) {
click.grab = 0;
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