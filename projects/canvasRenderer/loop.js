
// Main render loop variables
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
	
// LOADED_MODELS is assumed created as an array with the models as strings
var model = null;

// Parses a selected model from the LOADED_MODELS array and sets it to the currently rendering model
function setModel(m) {
	model = parseObj(LOADED_MODELS[m]);
}

// Loop to draw one model
function mainLoop() {
	clearScreen();

	if(model != null) {
		// Rotate about Y & Z axis
		for(v_index in model.vertices) {
			model.vertices[v_index] = rotateY(model.vertices[v_index], 0.01);
			model.vertices[v_index] = rotateZ(model.vertices[v_index], 0.01);
		}
	
		// Draw model
		const color = document.getElementById("colorpicker").value;
		const scale = document.getElementById("scale").value;
		drawModel(model, {scale: scale, x: canvas.width / 2, y: canvas.height / 2}, color);
	}
}

// Called after models are loaded
function startRenderer() {
	setModel(1);
	setInterval(mainLoop, 20);
}
