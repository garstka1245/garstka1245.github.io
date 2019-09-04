var canvas = document.getElementById("glCanvas");
var gl = canvas.getContext("webgl");



gl.clearColor(1.0, 1.0, 1.0, 1.0);

function loop(){
	render();
	window.requestAnimationFrame(loop);
}
window.requestAnimationFrame(loop);

refreshGameWindow();
function refreshGameWindow(){
	canvas.style.width = window.innerWidth - 10 + "px";
	canvas.style.height = window.innerHeight - 10 + "px";
}





