
function model(vertices, indices, uvs, img){
	this.vertices = vertices;
	this.indices = indices;
	this.uvs = uvs;
	
	this.program = gl.createProgram();
	
	this.VertexBufferObject = gl.createBuffer();
	this.IndexBufferObject = gl.createBuffer();
	this.UvsBufferObject = gl.createBuffer();
	
	//
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.IndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.UvsBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uvs), gl.STATIC_DRAW);
	
	
	this.texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, img);
	gl.bindTexture(gl.TEXTURE_2D, null);
}

model.prototype.draw = function(program){
	gl.useProgram(program);
		
	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	var texCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexBufferObject);

	gl.enableVertexAttribArray(positionAttribLocation);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.IndexBufferObject);
	gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT,0);
	
	gl.enableVertexAttribArray(texCoordAttribLocation);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.UvsBufferObject);
	gl.vertexAttribPointer(texCoordAttribLocation, 2, gl.FLOAT, gl.FALSE, 2 * Float32Array.BYTES_PER_ELEMENT, 0 * Float32Array.BYTES_PER_ELEMENT);
	
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	gl.activeTexture(gl.TEXTURE0);
	
    gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
}

function draw(model, ModelData, s, x, y, z, alpha, beta){
	mat4.translate(ModelData.translationMatrix, ModelData.viewMatrix, [x, y, z]);
	mat4.scale(ModelData.scaleMatrix, ModelData.translationMatrix, [s, s, s]);
	mat4.rotate(ModelData.rotMatrix, ModelData.scaleMatrix, alpha * (Math.PI/180), [0, 1, 0]);
	mat4.rotate(ModelData.drawMatrix, ModelData.rotMatrix, beta * (Math.PI/180), [1, 0, 0]);
	gl.uniformMatrix4fv(gl.getUniformLocation(ModelData.program, 'mView'), gl.FALSE, ModelData.drawMatrix);
	model.draw(ModelData.program);
}

function grid(model, ModelData, spacing, px, py, pz, lx, ly, lz){
	for(var z = 1; z < lx + 1; z++){
		for(var y = 1; y < ly + 1; y++){
			for(var x = 1; x < lz + 1; x++){
				draw(model, ModelData, 1, x*spacing + px, y*spacing + py, z*spacing + pz, 0, 0);
			}
		}
	}
}

















