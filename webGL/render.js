  	var canvas = document.querySelector("#glCanvas");
	var gl = canvas.getContext("webgl");
	
	// Array for pos for cube 
   var positions = [// x, y, z
-1, -1, -1,
 1, -1, -1,
-1, 1, -1,
1, 1, -1,

-1, -1, 1,
1, -1, 1,
-1, 1, 1,
1, 1, 1,
  ];
   var indices = [
 6, 7, 5,
 6, 5, 4,

 2, 3, 7,
 2, 7, 6,

 4, 5, 1,
 4, 1, 0,

 0, 1, 3,
 0, 3, 2, 

 5, 7, 3,
 5, 3, 1,

 0, 2, 6, 
 0, 6, 4,
  ];
    var colors = [
    1.0,  0.0,  0.0,  0.5,    // red
	1.0,  1.0,  0.0,  0.5,    // yellow
	1.0,  0.0,  1.0,  0.5,    // megenta
	1.0,  0.0,  0.0,  0.5,    // red
	
	1.0,  0.0,  0.0,  0.5,    // red
	1.0,  1.0,  0.0,  0.5,    // yellow
	1.0,  0.0,  1.0,  0.5,    // megenta
	1.0,  0.0,  0.0,  0.5,    // red
  ];  
  
start(gl);
function start(gl){

	if (!gl) {
		console.log("WebGL Unsupported, falling back to webgl-experimental");
		const gl = canvas.getContext("webgl-experimental");
		}
	if(!gl){
		alert("WebGL not supported by your browser.");
	}
	
// Vertex shader
  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
	uniform mat4 uWorldMatrix;
    varying lowp vec4 vColor;
    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix  * uWorldMatrix * aVertexPosition;
      vColor = aVertexColor; 
    }
  `;
  
// Fragment shader
const fsSource = `
  varying lowp vec4 vColor;
  void main(void) {
    gl_FragColor = vColor;
  }
`;
    //init
  var shaderProgram = initShaderProgram(gl, vsSource, fsSource);
  var programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
	  vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
	  worldMatrix: gl.getUniformLocation(shaderProgram, 'uWorldMatrix'),
    },
  };

  
    var buffers = initBuffers(gl, positions, indices, colors);
/* 
Create perspective matrix,
FOV 45 deg
Aspect ratio
Nearest possible z value
Farest possible z value
*/
  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 1000.0;
  const projectionMatrix = mat4.create();

  // perspective marix
  mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);

  // Set the drawing pos to center
  const modelViewMatrix = mat4.create();

  // Move the drawing pos

  mat4.translate(modelViewMatrix,     // output matrix
                 modelViewMatrix,     // input matrix
                 [-0.0, 0.0, -6.0]);  // camera pos

  // Pulling out positions from pos buffer
  {
    const numComponents = 3;  // pull out 2 values per loop
    const type = gl.FLOAT;    // the data in the buffer is 32bit floats
    const normalize = false;  // don't normalize
    const stride = 0;         // how many bytes to get from one set of values to the next
                              // 0 = use type and numComponents above
    const offset = 0;         // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition);
  }
  {
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexColor,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexColor);
  }
  
   const worldMatrix = mat4.create();	
	
	//use this program
  gl.useProgram(programInfo.program);

  gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix);
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix);
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.worldMatrix,
      false,
      worldMatrix);
	  
	var angle = 0;
    var identityMatrix = new Float32Array(16);
    mat4.identity(identityMatrix);
	
	gl.enable(gl.DEPTH_TEST);           // Enable depth test
    gl.depthFunc(gl.LEQUAL);            // Near things cover up far things

//Loop
var loop = function(){
  // Draws scene
  drawScene(gl, programInfo, buffers, worldMatrix, identityMatrix);
  //Loops after drawn
  requestAnimationFrame(loop);
}
  requestAnimationFrame(loop);
  
}



  //Buffers
function initBuffers(gl) {


  // Create buffers
  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  
  var indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    color: colorBuffer,
	indices: indexBuffer,
  };
}
//Shaders
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  // Create shader program
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Can\'t init shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }
  return shaderProgram;
}
//Compile shaders
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  // Send source to shader object
  gl.shaderSource(shader, source);
  // Compile
  gl.compileShader(shader);
  // IfError
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}


function drawScene(gl, programInfo, buffers, worldMatrix, identityMatrix) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear color
  gl.clearDepth(1.0);                 // Clear depth  
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear buffer

	angle = performance.now() / 1000 / 6 *2 * Math.PI;
	
	mat4.rotate(worldMatrix, identityMatrix, angle, [1, 1, 0]);
	gl.uniformMatrix4fv(programInfo.uniformLocations.worldMatrix, false, worldMatrix);
	
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
}


















