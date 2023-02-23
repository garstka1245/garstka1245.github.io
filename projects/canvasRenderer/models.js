
// Load from this link so it can work locally w/out CORS error, should work online too?
const source_link = "https://raw.githubusercontent.com/garstka1245/garstka1245.github.io/master/projects/canvasRenderer/models/";
var LOADED_MODELS = [];


Promise.all([
  fetch(source_link + "basic/bean.obj").then(t => t.text()),
  fetch(source_link + "basic/cube.obj").then(t => t.text()),
  fetch(source_link + "basic/cube_indented.obj").then(t => t.text()),
  fetch(source_link + "basic/level4.obj").then(t => t.text()),
  fetch(source_link + "basic/level5.obj").then(t => t.text()),
  fetch(source_link + "basic/level6.obj").then(t => t.text()),
  fetch(source_link + "basic/monkey.obj").then(t => t.text()),
  fetch(source_link + "basic/perfection.obj").then(t => t.text()),
  fetch(source_link + "basic/pyramid.obj").then(t => t.text()),
  fetch(source_link + "basic/tetrahedron.obj").then(t => t.text()),

  fetch(source_link + "animals/bulbasaur.obj").then(t => t.text()),
  fetch(source_link + "animals/cat.obj").then(t => t.text()),
  fetch(source_link + "animals/deer.obj").then(t => t.text()),
  fetch(source_link + "animals/fox.obj").then(t => t.text()),
  fetch(source_link + "animals/spider.obj").then(t => t.text()),
  fetch(source_link + "animals/wolf.obj").then(t => t.text()),
]).then((t) => {
	// Order not guaranteed possibly?
	// t is an array already? Not quite sure on the logic
	LOADED_MODELS = t;
	startRenderer();
});



