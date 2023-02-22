
// Reads in Obj as string
// and returns a model, w array of vertices and faces

function parseObj(obj) {
	const split = obj.split("\n");

	var vertices = [];
	var faces = [];

	// Parse line by line
	for (line of split) {

		// Vertices
		if(line.substr(0, 1) == "v") {
			const coords = line.substr(2).split(" ");
			const x = parseFloat(coords[0]);
			const y = parseFloat(coords[1]);
			const z = parseFloat(coords[2]);

			vertices.push({x: x, y: y, z: z});
		}
		// Faces
		else if(line.substr(0, 1) == "f") {
			const indices = line.substr(2).split(" ");
			const v1 = parseFloat(indices[0]);
			const v2 = parseFloat(indices[1]);
			const v3 = parseFloat(indices[2]);

			faces.push({v1: v1, v2: v2, v3: v3});
		}
	}

	return { vertices: vertices, faces: faces };
}
