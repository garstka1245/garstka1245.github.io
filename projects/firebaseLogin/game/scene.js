var controls;

function initScene(){
	//initializing camera and position
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
	camera.position.x = 0;
	camera.position.y = 1;
	camera.position.z = 1;


	//new blank scene
	scene = new THREE.Scene();

	//default lighting
	var skyColor = 0xFFFFFF;
	var groundColor = 0x000000;
	var intensity = 1;
	var light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
	scene.add(light);
	
	//link three.js renderer to the webgl canvas
	renderer = new THREE.WebGLRenderer(  { canvas: canvas, context: gl }  );
	
	// Camera controls
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.enableZoom = true;
	controls.enablePan = false;
	controls.mouseButtons = { 
		LEFT: 2,
		MIDDLE: null,
		RIGHT: 0
		};
	// threex interactions
	domEvents	= new THREEx.DomEvents(camera, renderer.domElement)
	
}

var player1, plane;

function debugScene(){
	//defining vertices for a cube and then making the material 
	var normalmat = new THREE.MeshNormalMaterial();
	var green_mat_plane = new THREE.MeshPhongMaterial({color: '#030', side: THREE.DoubleSide});
	var vec_plane = new THREE.PlaneGeometry( 2, 2);
	
	//mesh is a collection of points? added to one scene, in this case the cube to the blank scene made
	plane = new THREE.Mesh( vec_plane, green_mat_plane );
	plane.rotation.x += Math.PI/2;
	//
	
	scene.add(plane);
}







