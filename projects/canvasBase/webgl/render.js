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
var ModelIndex = 1;

var startProg = function(){
	Promise.all([loadObj("basic/triangle"),loadObj("basic/cube")]).then(function(){
		//Successfully loaded
		console.log("Assets loaded.");
		startGL(loadedVertices, loadedFaces, loadedUvs, textured);
	}, function(){	
		//One or more failed
		console.log("Failed loading assets, please refresh or try a different browser? *shrug*");
	});
}

var refreshProg = function(){
	startGL(loadedVertices[ModelIndex], loadedFaces[ModelIndex], loadedUvs[ModelIndex], textured[ModelIndex]);
}

var startGL = function (loadV, loadF, loadUV, textured){
		
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
	//gl.enable(gl.CULL_FACE);
	//gl.frontFace(gl.CCW);
	//gl.cullFace(gl.BACK);

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

	// Manually fill buffer
   	var vertices = []; 
	for(var i = 0; i < loadV.length; i++){
	vertices[i] = loadV[i];
	}

    var indices = [];
	for(var i = 0; i < loadV.length; i++){
	indices[i] = loadF[i];
	}

	var uvs = [];
	for(var i = 0; i < loadV.length; i++){
	uvs[i] = loadUV[i];
	}

	
	//Create buffers
    var VertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, VertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices[0]), gl.STATIC_DRAW);
	//bind multiple things? how to render multiple things
	var VertexBufferObject2 = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, VertexBufferObject2);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices[0]), gl.STATIC_DRAW);
	

	var IndexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, IndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices[0]), gl.STATIC_DRAW);		
	
	
	if(textured == true){
	var UvsBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, UvsBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs[0]), gl.STATIC_DRAW);

	
	gl.bindBuffer(gl.ARRAY_BUFFER, VertexBufferObject);
	gl.bindBuffer(gl.ARRAY_BUFFER, VertexBufferObject2);
	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	gl.vertexAttribPointer(
		positionAttribLocation, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 // Offset from the beginning of a single vertex to this attribute
	);
	gl.enableVertexAttribArray(positionAttribLocation);
	

	gl.bindBuffer(gl.ARRAY_BUFFER, UvsBufferObject);
	var texCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');
	gl.vertexAttribPointer(
		texCoordAttribLocation, // Attribute location
		2, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		2 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 * Float32Array.BYTES_PER_ELEMENT  // Offset from the beginning of a single vertex to this attribute
	);

	gl.enableVertexAttribArray(texCoordAttribLocation);

	 // Texture
	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE,document.getElementById('black_square'));
	gl.bindTexture(gl.TEXTURE_2D, null);
	}
	else{
	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
	gl.vertexAttribPointer(
		positionAttribLocation, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 // Offset from the beginning of a single vertex to this attribute
	);
	gl.vertexAttribPointer(
		colorAttribLocation, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
	);

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
	  
	var angle = 0;
    var identityMatrix = new Float32Array(16);
    mat4.identity(identityMatrix);
	
//Loop
var loop = function(){
	//console.log("work damn it");
	
	mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]);
	mat4.rotate(xRotationMatrix, identityMatrix, angle / 4, [1, 0, 0]);
	mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix);
	//gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
	
	
	// Draw scene
	gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear color
	//gl.clearDepth(1.0);                 // Clear depth  
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear buffer

	angle = performance.now() / 1000 / 6 *2 * Math.PI;
	
		
	if(textured == true){
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.activeTexture(gl.TEXTURE0);
	}
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  //Loops after drawn
requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
}

















