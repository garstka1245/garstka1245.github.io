function render(){
	for(var i = 0; i < serverplayers.length; i++){
		serverplayers[i].loop();
	}
	renderer.render( scene, camera );
}
