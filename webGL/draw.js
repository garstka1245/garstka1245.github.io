
function model(vertices, indices, uvs, img){
	this.vertices = vertices;
	this.uvs = uvs;
	this.allindices = [];
	this.indices = indices;
	//console.log(indices);
	for(var i = 0; i < indices.length; i++){
	this.allindices = this.allindices.concat(indices[i]);
	}
	
	this.program = gl.createProgram();
	
	this.VertexBufferObject = gl.createBuffer();
	this.IndexBufferObject = gl.createBuffer();
	this.UvsBufferObject = gl.createBuffer();
	
	//
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.IndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.allindices), gl.STATIC_DRAW);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.UvsBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uvs), gl.STATIC_DRAW);
	
	this.texture = [];
	for(var i = 0; i < img.length; i++){
	this.texture[i] = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, this.texture[i]);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, img[i]);
	gl.bindTexture(gl.TEXTURE_2D, null);
	}
	
}

model.prototype.drawFull = function(program){
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
	
	var addativeIdex = 0;
	
	for(var i = 0; i < this.indices.length-1; i++){
	gl.bindTexture(gl.TEXTURE_2D, this.texture[i]);
	
	addativeIdex += this.indices[i].length; 
	
    gl.drawElements(gl.TRIANGLES, this.indices[i+1].length, gl.UNSIGNED_SHORT, 2*addativeIdex);
	}
	
}

model.prototype.drawInit = function(program){
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
}

model.prototype.drawNext = function(program){
    gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
}

function draw(model, ModelData, s, x, y, z, alpha, beta){
	mat4.translate(ModelData.translationMatrix, ModelData.viewMatrix, [x, y, z]);
	mat4.scale(ModelData.scaleMatrix, ModelData.translationMatrix, [s, s, s]);
	mat4.rotate(ModelData.rotMatrix, ModelData.scaleMatrix, alpha * (Math.PI/180), [0, 1, 0]);
	mat4.rotate(ModelData.drawMatrix, ModelData.rotMatrix, beta * (Math.PI/180), [1, 0, 0]);
	gl.uniformMatrix4fv(gl.getUniformLocation(ModelData.program, 'mView'), gl.FALSE, ModelData.drawMatrix);
	model.drawFull(ModelData.program);
}

function gridHollow(model, ModelData, spacing, px, py, pz, lx, ly, lz, ax, ay){
	model.drawInit(ModelData.program);
	
	for(var z = 1; z < lz + 1; z++){
		for(var y = 1; y < ly + 1; y++){
			for(var x = 1; x < lx + 1; x++){
				if((x == 1) || (x == lx) || (y == 1) || (y == ly) || (z == 1) || (z == lz)){
					mat4.translate(ModelData.translationMatrix, ModelData.viewMatrix, [x*spacing + px, y*spacing + py, z*spacing + pz]);
					mat4.scale(ModelData.scaleMatrix, ModelData.translationMatrix, [.1, .1, .1]);
					mat4.rotate(ModelData.rotMatrix, ModelData.scaleMatrix, ax * (Math.PI/180), [0, 1, 0]);
					mat4.rotate(ModelData.drawMatrix, ModelData.rotMatrix, ay * (Math.PI/180), [1, 0, 0]);
					gl.uniformMatrix4fv(gl.getUniformLocation(ModelData.program, 'mView'), gl.FALSE, ModelData.drawMatrix);
					model.drawNext(ModelData.program);
				}
			}
		}
	}
}

function gridFull(model, ModelData, spacing, px, py, pz, lx, ly, lz, ax, ay, s){
	model.drawInit(ModelData.program);
	
	for(var z = 1; z < lz + 1; z++){
		for(var y = 1; y < ly + 1; y++){
			for(var x = 1; x < lx + 1; x++){
				if((x == 1) || (x == lx) || (y == 1) || (y == ly) || (z == 1) || (z == lz)){
					mat4.translate(ModelData.translationMatrix, ModelData.viewMatrix, [x*spacing + px, y*spacing + py, z*spacing + pz]);
					mat4.scale(ModelData.scaleMatrix, ModelData.translationMatrix, [s, s, s]);
					mat4.rotate(ModelData.rotMatrix, ModelData.scaleMatrix, ax * (Math.PI/180), [0, 1, 0]);
					mat4.rotate(ModelData.drawMatrix, ModelData.rotMatrix, ay * (Math.PI/180), [1, 0, 0]);
					gl.uniformMatrix4fv(gl.getUniformLocation(ModelData.program, 'mView'), gl.FALSE, ModelData.drawMatrix);
					model.drawNext(ModelData.program);
				}
			}
		}
	}
}
















