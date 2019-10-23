
var loadedVertices = [];

var loadedFaces = []; 

var loadedUvs = [];
 
var loadedImgs = [];

var loadedMtls = [];
 
function getTxt(path) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
		xhr.overrideMimeType("text/plain")
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    resolve(xhr.responseText);//work
                } else {
                    reject(xhr);//bork
                }
             }
        };
        xhr.open("GET", path);
        xhr.send();
    });
}

var modelIndex,mtlIndex,x,y,A,B,C,D,E,F,Color,U,V,r,g,b,MTL,DIR;
var textured = [];
var MTLname = [];
var MTLdir = [];
  modelIndex = 0;
  mtlIndex = 0;

async function loadObj(name) {
  var obj = await getTxt("models/" + name + ".obj");
  var mtl = await getTxt("models/" + name + ".mtl");
  //Parsing attempt
  var lines = obj.toUpperCase().substr(0,obj.length).split(/\r?\n/);
  var mtllines = mtl.toUpperCase().substr(0,mtl.length).split(/\r?\n/);

  loadedVertices[modelIndex] = new Array();
  loadedFaces[modelIndex] = new Array();
  loadedFaces[modelIndex][mtlIndex] = new Array();
  loadedUvs[modelIndex] = new Array();
  textured[modelIndex] = false;
	//console.log("ModelIndex: " + modelIndex);
    //console.log(lines);
  for(var i=0;i<lines.length;i++){
   if(lines[i].includes("VT ")){
	  textured[modelIndex] = true;
   }
  }
  for(var i=0;i<lines.length;i++){
	  if(lines[i].substr(0,1) == "O"){
		 //model name
	  }
	  else if(lines[i].substr(0,2) == "V "){
		 //vector
		 x = parseFloat(lines[i].substr(1,obj.length).split(" ")[1]);
		 y = parseFloat(lines[i].substr(1,obj.length).split(" ")[2]);
		 z = parseFloat(lines[i].substr(1,obj.length).split(" ")[3]); 
		loadedVertices[modelIndex].push(x);
		loadedVertices[modelIndex].push(y);
		loadedVertices[modelIndex].push(z);
		//vertexcolor
		if(!isNaN(parseInt(lines[i].substr(1,obj.length).split(" ")[4]))){
		 r = parseFloat(lines[i].substr(1,obj.length).split(" ")[4]);
		 g = parseFloat(lines[i].substr(1,obj.length).split(" ")[5]);
		 b = parseFloat(lines[i].substr(1,obj.length).split(" ")[6]); 
		loadedVertices[modelIndex].push(r);
		loadedVertices[modelIndex].push(g);
		loadedVertices[modelIndex].push(b);
		}
		else if(textured[modelIndex] == false){
		loadedVertices[modelIndex][mtlIndex].push(Math.random()*0.5 + 0.5);
		loadedVertices[modelIndex][mtlIndex].push(Math.random()*0.5 + 0.5);
		loadedVertices[modelIndex][mtlIndex].push(Math.random()*0.5 + 0.5);
		}
	  }
	  else if(lines[i].substr(0,2) == "F "){
		//tris		
		 A = parseInt(lines[i].substr(1,obj.length).split(" ")[1]) - 1;
		 B = parseInt(lines[i].substr(1,obj.length).split(" ")[2]) - 1;
		 C = parseInt(lines[i].substr(1,obj.length).split(" ")[3]) - 1;
		loadedFaces[modelIndex][mtlIndex].push(A);
		loadedFaces[modelIndex][mtlIndex].push(B);
		loadedFaces[modelIndex][mtlIndex].push(C);
		//quads
		if(!isNaN(parseInt(lines[i].substr(1,obj.length).split(" ")[4]))){
		 D = parseInt(lines[i].substr(1,obj.length).split(" ")[4]);
		 E = parseInt(lines[i].substr(1,obj.length).split(" ")[1]);
		 F = parseInt(lines[i].substr(1,obj.length).split(" ")[3]);
		loadedFaces[modelIndex][mtlIndex].push(D);
		loadedFaces[modelIndex][mtlIndex].push(E);
		loadedFaces[modelIndex][mtlIndex].push(F);
		}
	  }
	  else if(lines[i].substr(0,3) == "VT "){
		  //vertex texture(?)
		   U = parseFloat(lines[i].substr(2,obj.length).split(" ")[1]);
		   V = parseFloat(lines[i].substr(2,obj.length).split(" ")[2]);
		   loadedUvs[modelIndex].push(U);
		   loadedUvs[modelIndex].push(V);
	  }
	  else if(lines[i].substr(0,3) == "VN "){
		   //vertex normals
	  }
	  else if(lines[i].substr(0,7) == "USEMTL "){
			if(lines[i].substr(0,8) == 'USEMTL "'){
		   //materials
		   mtlIndex++;
		   MTL = lines[i].substr(6,obj.length).split('"')[1];
		   //order matters, the faces after the material are put together
		   loadedFaces[modelIndex][mtlIndex] = new Array();
		   loadedMtls.push(MTL);
			 console.log(MTL);
		   //console.log(loadedMtls[mtlIndex-1]);
		   //console.log(loadedFaces[modelIndex][mtlIndex]);
			}
			else{
				mtlIndex++;
				MTL = lines[i].substr(7,obj.length);
				console.log(MTL);
				loadedFaces[modelIndex][mtlIndex] = new Array();
				loadedMtls.push(MTL);
			}
	  }
	  else{
		//invalid model line
	  }
  }
  modelIndex++;
  if(mtl != null){
  for(var i=0;i<mtllines.length;i++){
	  if(mtllines[i].substr(0,7) == "NEWMTL "){
		  //new material
		  MTL = mtllines[i].substr(6,mtl.mtllines).split('"')[1];
		  MTLname.push(MTL);
	  }  //these two arrays should allign if mtl file done correctly, which we can assume is
	  else if(mtllines[i].substr(0,7) == "MAP_KD "){
		  //mapping texture
		  DIR = mtllines[i].substr(6,mtl.mtllines).split('"')[1];
		  MTLdir.push(DIR);
			
	  }
	  //decode material names to textures when loading model, so i don't have to include a texture constant
  }
  }
}

function getPng(path) {
    return new Promise(function(resolve, reject) {
        var image = new Image();
        image.onload = function() {
			resolve(image);//work
        };
        image.src = path;
    });
}


async function loadImg(name) {
	var result = await getPng("textures/" + name + ".png");
	loadedImgs.push(result);
}







