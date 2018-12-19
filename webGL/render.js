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
	loadObj("basic/cube_textured"),loadObj("animals/cat"),loadObj("animals/deer"),loadObj("animals/fox"),loadObj("animals/spider"),loadObj("animals/wolf")
	,loadImg("bluestone"),loadImg("black_square"),loadImg("square_illusion")
	]).then(function(){
		//Successfully loaded
		console.log("Assets loaded.");
		startGL(loadedVertices, loadedFaces, loadedUvs, loadedImgs[TextureIndex]);
	}, function(){	
		//One or more failed
		console.log("Failed loading assets, please refresh or try a different browser? *shrug*");
	});
}

var refreshProg = function(){
	startGL(loadedVertices, loadedFaces, loadedUvs, loadedImgs[TextureIndex]);
}

var startGL = function (loadV, loadF, loadUV, loadedImg){
		
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
	gl.shaderSource(fragmentShader, fragmentShaderText);
	
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
	mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.clientWidth / canvas.clientHeight, 0.1, 5000.0);

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
	
	var xTranslationMatrix = new Float32Array(16);
	var yTranslationMatrix = new Float32Array(16);
	var zTranslationMatrix = new Float32Array(16);
	
	var rotMatrix = new Float32Array(16);
	
	var Draw1 = new triangle(loadV[1], loadF[1], loadUV[1], loadedImg);
	var Draw2 = new triangle(loadV[2], loadF[2], loadUV[2], loadedImg);
	var Draw3 = new triangle(loadV[5], loadF[5], loadUV[5], loadedImg);
	
	
//Loop
var loop = function(){
	refreshControls();
	if(debugDispToggle){
		if(performance.now()%20 == 0){
		//debugDisp();
		}
	}
	else{document.getElementById("debug").innerHTML = ""}
	gl.useProgram(program)
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

	
	mat4.translate(zTranslationMatrix, viewMatrix, [0, 0, 750]);
	mat4.rotate(rotMatrix, zTranslationMatrix, Math.PI/2, [0, 1, 0]);
	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, rotMatrix);
	Draw1.draw(program);	
	
	
	mat4.translate(zTranslationMatrix, viewMatrix, [0, 0, 750]);
	mat4.rotate(rotMatrix, zTranslationMatrix, Math.PI, [0, 1, 0]);
	mat4.translate(xTranslationMatrix, rotMatrix, [200, 0, 0]);
	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, xTranslationMatrix);
	Draw2.draw(program);
	
	
	mat4.translate(zTranslationMatrix, viewMatrix, [0, 0, 1200]);
	mat4.rotate(rotMatrix, zTranslationMatrix, Math.PI/2, [0, 1, 0]);
	mat4.translate(zTranslationMatrix, rotMatrix, [0, 0, 400]);
	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, zTranslationMatrix);
	Draw3.draw(program);	
	
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
				
				//Draw1.draw(program);	
			}
		}
	}
	
	
	
  //Loops after drawn
requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
}

















