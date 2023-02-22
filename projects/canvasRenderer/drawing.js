
// Functions for the drawing process

// Clear screen to black
function clearScreen() {
	ctx.fillStyle = "#000000";
	// 720 x 480 px
	ctx.fillRect(0,0, canvas.width, canvas.height);
}

// Draw one triangle
function drawTriangle(x1, y1, x2, y2, x3, y3, color) {
	ctx.fillStyle = color;
	ctx.strokeStyle = color;
	ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  // Loop back so stroke draws correctly
  ctx.lineTo(x1, y1);
  // Fill if we are not wireframing
  wireframe = document.getElementById("wireframe").checked;
  if(!wireframe)
  	ctx.fill();
  ctx.stroke();
}

// Draw a model in a solid color, directional shading
// very hacky draw with no actual camera / proper math
function drawModel(model, transform, color) {
	// Sort faces in order of Z (approximate since a triangle can overlap in two different position, we just use the centroid)
	sortFacesByAverageZ(model);

	const light_angle = Math.PI; // Lighting "angle"
	const S = transform.scale;

	for(face of model.faces) {
		const v1 = model.vertices[face.v1 - 1];
		const v2 = model.vertices[face.v2 - 1];
		const v3 = model.vertices[face.v3 - 1];
		const normal = getNorm(v1, v2, v3);
		// Cull triangles not facing the camera
		if(normal.z > 0) {
			const angle = Math.atan(normal.x / normal.z);
			const shaded_color = shadeColor( color, ( angle + light_angle ) * ( 40 / Math.PI ));
			
			// Cheating rendering, just ignoring z value and no camera at all
			const x1 = (v1.x * S) + transform.x;
			const y1 = (v1.y * S) + transform.y;
			const x2 = (v2.x * S) + transform.x;
			const y2 = (v2.y * S) + transform.y;
			const x3 = (v3.x * S) + transform.x;
			const y3 = (v3.y * S) + transform.y;
			drawTriangle(x1, y1, x2, y2, x3, y3, shaded_color);
		}
	}
}



