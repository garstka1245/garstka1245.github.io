
function player(x, y, z, name){
	this.x = x;
	this.y = y;
	this.z = z;
	var cyan_mat = new THREE.MeshPhongMaterial({color: '#066'});
	var vec_box = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
	
	this.mesh = new THREE.Mesh( vec_box, cyan_mat );
	this.name = name; 
}

player.prototype.init = function (){


}
player.prototype.loop = function (){
	this.mesh.position.x = this.x;
	this.mesh.position.y = this.y;
	this.mesh.position.z = this.z;
}
player.prototype.move = function (x,y,z){
		this.x = x;
		this.y = y + 0.1;
		this.z = z;
		sendPos(this.x, this.y, this.z);
}
player.prototype.updateMove = function (x,y,z){
		this.x = x;
		this.y = y + 0.1;
		this.z = z;
}

