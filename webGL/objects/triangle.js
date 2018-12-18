

function triangle(vec1, vec2, vec3){
	this.vec1 = vec1;
	this.vec2 = vec2;
	this.vec3 = vec3;
	this.texture;
	this.vertices = [];
	this.indices = [];
	this.uvs = [];
	
}

triangle.prototype.draw = function(program){
	
	//gl.attachShader(program, vertexShader);
	//gl.attachShader(program, fragmentShader);
	

	
	
	
	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
	
	if(this.texture != null){
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	gl.activeTexture(gl.TEXTURE0);
	}
	
	gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);	
}


















