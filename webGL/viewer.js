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
	
	var cameraSpeed = 0.1;
	
 /*//Debug 
setInterval(function(){
	//console.log("xCamRot: " + (Math.sin(xCameraRot) + xCameraPos));
	//console.log("zCamRot: " + (Math.cos(zCameraRot) + zCameraPos));
	//console.log("yCamRot: " + (yCameraRot + yCameraPos));
}, 100);
*/
function refreshControls(){
	if(keyPressed("w")){
		zCameraPos += Math.cos(zCameraRot)*cameraSpeed;
		xCameraPos += Math.sin(xCameraRot)*cameraSpeed;
	}
	else if(keyPressed("s")){
		zCameraPos -= Math.cos(zCameraRot)*cameraSpeed;
		xCameraPos -= Math.sin(xCameraRot)*cameraSpeed;
	}
	if(keyPressed("a")){
		xCameraPos += Math.cos(zCameraRot)*cameraSpeed;
		zCameraPos -= Math.sin(xCameraRot)*cameraSpeed;
	}
	else if(keyPressed("d")){
		xCameraPos -= Math.cos(zCameraRot)*cameraSpeed;
		zCameraPos += Math.sin(xCameraRot)*cameraSpeed;
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