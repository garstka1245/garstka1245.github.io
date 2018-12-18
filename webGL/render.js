// Vertex shader
var vertexShaderText = `
    precision mediump float;
    attribute vec3 vertPosition;
	attribute vec2 vertTexCoord;
	attribute vec3 vertColor;
    varying vec2 fragTexCoord;
	varying vec3 fragColor;
    uniform mat4 mView;
    uniform mat4 mProj;
	uniform mat4 mWorld;
    void main(void) {
      gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
      fragTexCoord = vertTexCoord; 
	  fragColor = vertColor;
    }
  `;
  
// Fragment shader
var fragmentShaderText = `
	precision mediump float;
	varying vec2 fragTexCoord;
	uniform sampler2D sampler;
	void main(void) {
    gl_FragColor = texture2D(sampler, fragTexCoord);
	}
  `;
 // Fragment shader w/o texture
 var colorFragmentShaderText = `
	precision mediump float;
	varying vec3 fragColor;
	void main(void) {
    gl_FragColor = vec4(fragColor, 1.0);
	}
  `;
  
var gl;
var ModelIndex = 0;
var TextureIndex = 1;

var startProg = function(){
	Promise.all([
	loadObj("basic/cube_textured"),loadObj("basic/cube"),loadObj("basic/cube_indented"),loadObj("basic/level4"),loadObj("basic/monkey"),loadObj("basic/perfection"),loadObj("basic/pyramid"), loadObj("basic/tetrahedron")
	,loadObj("animals/cat"),loadObj("animals/deer"),loadObj("animals/fox"),loadObj("animals/spider"),loadObj("animals/wolf")
	,loadImg("bluestone"),loadImg("black_square"),loadImg("square_illusion")
	]).then(function(){
		//Successfully loaded
		console.log("Assets loaded.");
		startGL(loadedVertices, loadedFaces, loadedUvs, textured[ModelIndex], loadedImgs[TextureIndex]);
	}, function(){	
		//One or more failed
		console.log("Failed loading assets, please refresh or try a different browser? *shrug*");
	});
}

var refreshProg = function(){
	startGL(loadedVertices, loadedFaces, loadedUvs, textured[ModelIndex], loadedImgs[TextureIndex]);
}

var startGL = function (loadV, loadF, loadUV, textured, loadedImg){
		
var canvas = document.querySelector("#glCanvas");
gl = canvas.getContext("webgl");
		
	if (!gl) {
		console.log("WebGL Unsupported, falling back to webgl-experimental");
		gl = canvas.getContext("webgl-experimental");
		}
	if(!gl){
		alert("WebGL not supported by your browser.");
	}
	
	//GL Settings
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
	gl.cullFace(gl.BACK);

    //Create shaders
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, vertexShaderText);
	if(textured == true){gl.shaderSource(fragmentShader, fragmentShaderText);}
	else{gl.shaderSource(fragmentShader, colorFragmentShaderText);}
	
	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
	}

	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
	}

	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);

	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('ERROR linking program!', gl.getProgramInfoLog(program));
	}
	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error('ERROR validating program!', gl.getProgramInfoLog(program));
	}

	// Buffers
	//Object 1
   	var vertices = loadV[0];
    var indices = loadF[0];
	var uvs = loadUV[0];
	//Object 2
	var vertices1 = loadV[1];
    var indices1 = loadF[1];
	var uvs1 = loadUV[1];
	
	//Create buffers
	//Object1
    var VertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, VertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	var IndexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, IndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
	
		//Object 2
	var VertexBufferObject1 = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, VertexBufferObject1);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices1), gl.STATIC_DRAW);
	
	var IndexBufferObject1 = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, IndexBufferObject1);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices1), gl.STATIC_DRAW);
	

	if(textured == true){	
		var UvsBufferObject = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, UvsBufferObject);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);
	
		var UvsBufferObject1 = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, UvsBufferObject1);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs1), gl.STATIC_DRAW);


		gl.bindBuffer(gl.ARRAY_BUFFER, VertexBufferObject);
		var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
		gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT,0);
		gl.enableVertexAttribArray(positionAttribLocation);	
	
		gl.bindBuffer(gl.ARRAY_BUFFER, UvsBufferObject);
		var texCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');
		gl.vertexAttribPointer(texCoordAttribLocation, 2, gl.FLOAT, gl.FALSE, 2 * Float32Array.BYTES_PER_ELEMENT, 0 * Float32Array.BYTES_PER_ELEMENT);

		gl.enableVertexAttribArray(texCoordAttribLocation);

		// Texture
		var texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, loadedImg);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}
	else{
		var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
		var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
	
		gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, gl.FALSE, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
		gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT,gl.FALSE, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);

		gl.enableVertexAttribArray(positionAttribLocation);
		gl.enableVertexAttribArray(colorAttribLocation);
	}
  	// Use this program
	gl.useProgram(program);

	var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
	var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
	var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

	var worldMatrix = new Float32Array(16);
	var viewMatrix = new Float32Array(16);
	var projMatrix = new Float32Array(16);
	mat4.identity(worldMatrix);
	//Camera default -8 in z
	mat4.lookAt(viewMatrix, [0, 0, -6], [0, 0, 0], [0, 1, 0]);
	//Perspective matrix; FOV, Aspect, zNear, zFar, ProjMat
	mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);

	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
	gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

	//Done with GL setup, Rotation matrices
	
	var xRotationMatrix = new Float32Array(16);
	var yRotationMatrix = new Float32Array(16);
	var zRotationMatrix = new Float32Array(16);
	 
	var angle = 0;
    var identityMatrix = new Float32Array(16);
    mat4.identity(identityMatrix);
	var i = 0;
	var lookDist = 5;
	
	var xTranslationMatrix = new Float32Array(16);
	var yTranslationMatrix = new Float32Array(16);
	var zTranslationMatrix = new Float32Array(16);
	
	var rotMatrix = new Float32Array(16);
	
//Loop
var loop = function(){
	refreshControls();
	if(debugDispToggle){
		if(performance.now()%20 == 0){
		//debugDisp();
		}
	}
	else{document.getElementById("debug").innerHTML = ""}
	
	//World
	mat4.rotate(xRotationMatrix, identityMatrix, xRotVel, [0, 1, 0]);
	mat4.rotate(yRotationMatrix, identityMatrix, yRotVel, [1, 0, 0]);
	mat4.rotate(zRotationMatrix, identityMatrix, zRotVel, [0, 0, 1]);
	mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix, zRotationMatrix);
	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
	
	//Camera
	if(betaCameraRot < -1.566) betaCameraRot = -1.566;
	if(betaCameraRot > 1.566)betaCameraRot = 1.566;
	
	
	mat4.lookAt(viewMatrix, [xCameraPos, yCameraPos, zCameraPos], [Math.cos(alphaCameraRot)*Math.cos(betaCameraRot) + xCameraPos, Math.sin(betaCameraRot)  + yCameraPos, Math.sin(alphaCameraRot)*Math.cos(betaCameraRot) + zCameraPos], [0, 1, 0]);
	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
	

	// Draw scene
	gl.clearColor(backgroundColor.r, backgroundColor.g, backgroundColor.b, 1.0);  // Clear color
	gl.clearDepth(1.0);                 // Clear depth  
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear buffer
	
	// bind and draw first 
	if(textured == true){
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.activeTexture(gl.TEXTURE0);
	}
	

	//Draw1
	gl.bindBuffer(gl.ARRAY_BUFFER, VertexBufferObject);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, IndexBufferObject);
	gl.bindBuffer(gl.ARRAY_BUFFER, UvsBufferObject);
	
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
	

	//Draw2
	mat4.translate(xTranslationMatrix, viewMatrix, [5, 0, 0]);
	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, xTranslationMatrix);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, VertexBufferObject1);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, IndexBufferObject1);
	gl.bindBuffer(gl.ARRAY_BUFFER, UvsBufferObject1);
	
    gl.drawElements(gl.TRIANGLES, indices1.length, gl.UNSIGNED_SHORT, 0);

	
	
	
	
	angle = performance.now() / 1000 / 6 *2 * Math.PI;
	
	//Draw matrix of 1
	for(var z = 1; z < 4; z++){
		mat4.translate(zTranslationMatrix, viewMatrix, [0, 0, 5*z]);
		for(var y = 1; y < 4; y++){
			mat4.translate(yTranslationMatrix, zTranslationMatrix, [0, 5*y, 0]);
			for(var x = 1; x < 4; x++){
				mat4.translate(xTranslationMatrix, yTranslationMatrix, [5*x, 0, 0]);
				mat4.rotate(rotMatrix, xTranslationMatrix, angle, [1, 1, 0]);
				gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, rotMatrix);
				
				//gl.bindBuffer(gl.ARRAY_BUFFER, VertexBufferObject);
				//gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, IndexBufferObject);
				//gl.bindBuffer(gl.ARRAY_BUFFER, UvsBufferObject);
				//gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
			}
		}
	}
	
	
	
  //Loops after drawn
requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
}

















