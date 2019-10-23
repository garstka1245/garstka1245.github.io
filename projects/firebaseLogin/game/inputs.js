
var keymap = {
	jump : 32
}


document.addEventListener("keydown", e => {
  if (e.keyCode === keymap.jump) {
  }
});

renderer.domElement.onmousedown = function(e){
	//move(e);
}

renderer.domElement.onmousemove = function(e){
	//move(e);
}

document.oncontextmenu = function() {
  return false;
}






