
// Math functions usefull for rendering

// Vector Math
function vectorSub(v1, v2) {
	return {x: v1.x - v2.x, y: v1.y - v2.y, z: v1.z - v2.z};
}

function vectorMult(v1, v2) {
	const x = (v1.y * v2.z) - (v1.z * v2.y);
	const y = (v1.z * v2.x) - (v1.x * v2.z);
	const z = (v1.x * v2.y) - (v1.y * v2.x);
	return {x: x, y: y, z: z};
}

function getNorm(vA,vB,vC){
	const U = vectorSub(vA, vB);
	const V = vectorSub(vC, vB);

	return vectorMult(U, V);
}

// Color adjustment from hex, by a percentage.
function shadeColor(color, percent) {
  const num = parseInt(color.substr(1), 16);
  const val = Math.round(2.55 * percent);
  const R = (num >> 16) + val;
  const G = (num >> 8 & 0x00FF) + val;
  const B = (num & 0x0000FF) + val;
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);  
}

// Rotate vector about the Y axis 
function rotateY(vector, degrees) {
	const x = vector.x;
	const z = vector.z;
	const x_new = x * Math.cos(degrees) + z * Math.sin(degrees);
	const z_new = x * - Math.sin(degrees) + z * Math.cos(degrees);

	return { x: x_new , y: vector.y, z: z_new };
};

// Rotate vector about the Z axis 
function rotateZ(vector, degrees) {
	const y = vector.y;
	const z = vector.z;
	const y_new = y * Math.cos(degrees) + z * - Math.sin(degrees);
	const z_new = y * Math.sin(degrees) + z * Math.cos(degrees);
	
	return { x: vector.x, y: y_new, z: z_new };
};

// Given assumed model format, sort faces by the average of the 3 vertices z's
function sortFacesByAverageZ(model) {
	model.faces.sort((a,b) => {
		const averageZ_A = ( model.vertices[a.v1 - 1].z + model.vertices[a.v2 - 1].z + model.vertices[a.v3 - 1].z ) / 3;
		const averageZ_B = ( model.vertices[b.v1 - 1].z + model.vertices[b.v2 - 1].z + model.vertices[b.v3 - 1].z ) / 3;
		return averageZ_B - averageZ_A;
	});
}

