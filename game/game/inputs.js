
var keymap = {
	jump : 32
}


document.addEventListener("keydown", e => {
  if (e.keyCode === keymap.jump) {
    jump();
  }
});

canvas.onmousedown = function(e){
	move(e);
}

document.oncontextmenu = function() {
  return false;
}






