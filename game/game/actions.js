

function jump(){
	console.log("jump");
}



function move(e){
	var point;
	var rayCaster =  new THREE.Raycaster();
	var mousePosition = new THREE.Vector2();
	var canvasPosition = $(canvas).position();
	mousePosition.x = ((e.clientX - canvasPosition.left) / canvas.width) * 2 - 1;
	mousePosition.y = -((e.clientY - canvasPosition.top) / canvas.height) * 2 + 1;
	
	rayCaster.setFromCamera(mousePosition, camera);
	
	var intersects = rayCaster.intersectObjects(scene.getObjectByName('MyObj_s').children, true);
	if (intersects.length > 0){
		point = intersects[0].point;
		player1.x = point.x;
		player1.z = point.z;
	}
}



