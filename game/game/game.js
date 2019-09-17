var canvas = document.getElementById("glCanvas");
var gl = canvas.getContext("webgl");


var camera, scene, renderer, domEvents;

initGame();

function initGame(){
	initScene();
	//plane with player
	debugScene();
	window.requestAnimationFrame(loop);
}

function loop(){
	render();
	window.requestAnimationFrame(loop);
}

refreshGameWindow();
function refreshGameWindow(){
	renderer.domElement.style.width = window.innerWidth - 10 + "px";
	renderer.domElement.style.height = window.innerHeight - 10 + "px";
}

// have to cancel on mouse move
domEvents.addEventListener(plane, 'click', function(event){
	// check if mouse has moved since click
player1.move(event.intersect.point.x,event.intersect.point.y,event.intersect.point.z);
}, false);

