function doGET(path, callback) {
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

var request = false;
async function asyncCall(S,name, positions, indices, colors) {
  var result = await doGET("models/" + name + ".obj");
  //Parsing attempt
  var lines = result.toUpperCase().substr(0,result.length).split(/\r?\n/);
    //console.log(lines);
  for(var i=0;i<lines.length;i++){
	  if(lines[i].substr(0,1) == "O"){
		 //model name
	  }
	  else if(lines[i].substr(0,2) == "V "){
		 //vector
		var x = S*parseFloat(lines[i].substr(1,result.length).split(" ")[1]);
		var y = S*parseFloat(lines[i].substr(1,result.length).split(" ")[2]);
		var z = S*parseFloat(lines[i].substr(1,result.length).split(" ")[3]); 
		positions.push(x);
		positions.push(y);
		positions.push(z);
	  }
	  else if(lines[i].substr(0,1) == "F"){
		//tris		
		var A = parseInt(lines[i].substr(1,result.length).split(" ")[1]) - 1;
		var B = parseInt(lines[i].substr(1,result.length).split(" ")[2]) - 1;
		var C = parseInt(lines[i].substr(1,result.length).split(" ")[3]) - 1;
		//faces.push(new face(A,B,C,"#000000"));
		//quads
		if(!isNaN(parseInt(lines[i].substr(1,result.length).split(" ")[4]))){
		var D = parseInt(lines[i].substr(1,result.length).split(" ")[4]) - 1;
		var E = parseInt(lines[i].substr(1,result.length).split(" ")[1]) - 1;
		var F = parseInt(lines[i].substr(1,result.length).split(" ")[3]) - 1;
		//faces.push(new face(D,E,F,"#000000"));
		var Color = lines[i].substr(1,result.length).split(" ")[5];
		}
		else{
		var Color = lines[i].substr(1,result.length).split(" ")[4];
		}
	  }
	  else{
		//invalid model line
	  }
  }
	  request = true;
}
/*
basic:
cube
tetrahedron
pyramid
cube_indented
perfection
level(4-6)//spheres
bean
monkey

animals:
spider
wolf
fox
deer
*/

/*
For multiple models, i need to keep seperate arrays of vectors and faces
function shape(Vectors,Faces){
this.Vectors=Vectors;
this.Faces=Faces;
}

var object = [];
var object[i] = new shape(shape, faces);
*/









