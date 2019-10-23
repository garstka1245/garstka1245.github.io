
var loadedVertices = [];

var loadedFaces = []; 

var loadedUvs = [];
 
var loadedImgs = [];
 
function getObj(path) {
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

var a,x,y,A,B,C,D,E,F,Color,U,V,r,g,b;
var textured = [];

async function loadObj(name) {
  var result = await getObj("webgl/models/" + name + ".obj");
  //Parsing attempt
  var lines = result.toUpperCase().substr(0,result.length).split(/\r?\n/);
  loadedVertices[a] = new Array();
  loadedFaces[a] = new Array();
  loadedUvs[a] = new Array();
  textured[a] = false;
	console.log("ModelIndex: " + a);
    console.log(lines);
  for(var i=0;i<lines.length;i++){
   if(lines[i].includes("VT ")){
	  console.log("textured");
	  textured[a] = true;
   }
  }
  for(var i=0;i<lines.length;i++){
	  if(lines[i].substr(0,1) == "O"){
		 //model name
	  }
	  else if(lines[i].substr(0,2) == "V "){
		 //vector
		 x = parseFloat(lines[i].substr(1,result.length).split(" ")[1]);
		 y = parseFloat(lines[i].substr(1,result.length).split(" ")[2]);
		 z = parseFloat(lines[i].substr(1,result.length).split(" ")[3]); 
		loadedVertices[a].push(x);
		loadedVertices[a].push(y);
		loadedVertices[a].push(z);
		//vertexcolor
		if(!isNaN(parseInt(lines[i].substr(1,result.length).split(" ")[4]))){
		 r = parseFloat(lines[i].substr(1,result.length).split(" ")[4]);
		 g = parseFloat(lines[i].substr(1,result.length).split(" ")[5]);
		 b = parseFloat(lines[i].substr(1,result.length).split(" ")[6]); 
		loadedVertices[a].push(r);
		loadedVertices[a].push(g);
		loadedVertices[a].push(b);
		}
		else if(textured[a] == false){
		loadedVertices[a].push(1.0);
		loadedVertices[a].push(1.0);
		loadedVertices[a].push(1.0);
		}
	  }
	  else if(lines[i].substr(0,2) == "F "){
		//tris		
		 A = parseInt(lines[i].substr(1,result.length).split(" ")[1]) - 1;
		 B = parseInt(lines[i].substr(1,result.length).split(" ")[2]) - 1;
		 C = parseInt(lines[i].substr(1,result.length).split(" ")[3]) - 1;
		loadedFaces[a].push(A);
		loadedFaces[a].push(B);
		loadedFaces[a].push(C);
		//quads
		if(!isNaN(parseInt(lines[i].substr(1,result.length).split(" ")[4]))){
		 D = parseInt(lines[i].substr(1,result.length).split(" ")[4]);
		 E = parseInt(lines[i].substr(1,result.length).split(" ")[1]);
		 F = parseInt(lines[i].substr(1,result.length).split(" ")[3]);
		loadedFaces[a].push(D);
		loadedFaces[a].push(E);
		loadedFaces[a].push(F);
		}
	  }
	  else if(lines[i].substr(0,3) == "VT "){
		   U = parseFloat(lines[i].substr(1,result.length).split(" ")[1]);
		   V = parseFloat(lines[i].substr(1,result.length).split(" ")[2]);
		   loadedUvs[a].push(U);
		   loadedUvs[a].push(V);
	  }
	  else{
		//invalid model line
	  }
  }
  a++;
}


function getPng(path) {
    return new Promise(function(resolve, reject) {
        var image = new Image();
        image.onload = function() {
			resolve(image.src);//work
        };
        img.src = src;
    });
}


async function loadImg(name) {
	var result = await getPng("textures/" + name + ".png");
	
}






