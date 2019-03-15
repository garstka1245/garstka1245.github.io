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
	
	uniform sampler2D img;

	varying vec2 fragTexCoord;
	
	void main(void) {
	vec4 color = texture2D(img, fragTexCoord);
    gl_FragColor = color;
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
	loadObj("basic/cube_textured"),loadObj("animals/cat"),loadObj("animals/deer"),loadObj("maps/beavercreek/beavercreek")//,loadObj("animals/spider")//,loadObj("animals/fox"),loadObj("animals/wolf"),loadObj("maps/beavercreek/beavercreek")
	,loadImg("black_square"),loadImg("square_illusion"),loadImg("fur"),loadImg("chillout_metal_flat")
	]).then(function(){
		//Successfully loaded
		console.log("Assets loaded.");
		startGL(loadedVertices, loadedFaces, loadedUvs, loadedImgs);
	}, function(){	
		//One or more failed
		console.log("Failed loading assets, please refresh or try a different browser? *shrug*");
	});
}

var refreshProg = function(){
	startGL(loadedVertices, loadedFaces, loadedUvs, loadedImgs);
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

	//Done with GL setup, Matrices

	var angle = 0;
	
	var ModelData = {
		program: program,
		viewMatrix: viewMatrix,
		scaleMatrix: new Float32Array(16),
		translationMatrix: new Float32Array(16),
		rotMatrix: new Float32Array(16),
		drawMatrix: new Float32Array(16)
		};
		
	var Material = [loadedImg[0],loadedImg[1],loadedImg[2]];
	
	var Cube = new model(loadV[0], loadF[0], loadUV[0], Material);//1
	//var Draw2 = new model(loadV[2], loadF[2], loadUV[2], loadedImg[0]);//0
	//var Draw3 = new model(loadV[5], loadF[5], loadUV[5], Material);//0
	//var HaloMap = new model(loadV[6], loadF[6], loadUV[6], Material);//3
	
	
//Loop
var loop = function(){
	refreshControls();
	if(!debugDispToggle){
		if(performance.now()%20 == 0){
		   //debugDisp();
		}
	}
	else{document.getElementById("debug").innerHTML = ""}
	gl.useProgram(program)
	
	//Camera
	if(betaCameraRot < -1.566) betaCameraRot = -1.566;
	if(betaCameraRot > 1.566)betaCameraRot = 1.566;
	
	mat4.lookAt(viewMatrix, [xCameraPos, yCameraPos, zCameraPos], [Math.cos(alphaCameraRot)*Math.cos(betaCameraRot) + xCameraPos, Math.sin(betaCameraRot)  + yCameraPos, Math.sin(alphaCameraRot)*Math.cos(betaCameraRot) + zCameraPos], [0, 1, 0]);
	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
	

	// Draw scene
	gl.clearColor(backgroundColor.r, backgroundColor.g, backgroundColor.b, 1.0);  // Clear color
	gl.clearDepth(1.0);                 // Clear depth  
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear buffer

	angle = performance.now() / 20;
	
	draw(Cube, ModelData, 1, 2, 2, 0, 0, 0);
	
	//draw(Draw2, ModelData, 0.015, -3, 0, 20, 180, 0);
	
	//draw(Draw3, ModelData, 0.005, 25, -3, -3, 180, 0);
	
	//gridFull(Cube, ModelData, .3, 0, 0, 30, 10, 10, 10, angle, angle, Math.sin(angle/100)/10);

	//draw(HaloMap, ModelData, .01, 0, -5, 10, 0, -90);
	
	//light(x,y,z,rad) // spot lighting?
	
	
  //Loops after drawn
requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
}

















