var canvas = document.getElementById("glCanvas");
var gl = canvas.getContext("webgl");


var camera, scene, renderer;

initGame();

function initGame(){
	initScene();
	var controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.mouseButtons = {
		LEFT: null,
		MIDDLE: THREE.MOUSE.DOLLY,
		RIGHT: THREE.MOUSE.ROTATE
	}
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





