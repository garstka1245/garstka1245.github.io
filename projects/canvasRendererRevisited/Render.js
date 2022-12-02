//Rendering faces, sorting
var x=[];
var y=[];
var shape = [];
var faces = [];


setInterval(function() {
 ctx.fillStyle = "black";
 ctx.fillRect(0,0,Canvas.width,Canvas.height);
 //rotate();


for(i=0;i<faces.length;i++){
faces[i].z = (shape[faces[i].vA].z + shape[faces[i].vB].z + shape[faces[i].vC].z)/3;
}

faces.sort(function(a, b){
  var zofa = a.z; 
  var zofb = b.z; 
  if (zofa < zofb) {
    return -1;
  }
  if (zofa > zofb) {
    return 1;
  }
  return 0;
});
faces.reverse();

getIsoPoints();
//getPerspectivePoints(100);

for(i=0;i<faces.length;i++){
	renderTri(faces[i].vA,faces[i].vB,faces[i].vC,faces[i].C);
}
},20);



function face(vA,vB,vC,C,z){
	this.vA=vA;
	this.vB=vB;
	this.vC=vC;
	this.C=C;
	this.z=0;
}
face.z = function () {
    return (shape[this.vA].z + shape[this.vB].z + shape[this.vC].z)/3;
};

function getCentroid(vA,vB,vC) {
	var x = (shape[vA].x + shape[vB].x + shape[vC].x)/3;
	var y = (shape[vA].y + shape[vB].y + shape[vC].y)/3;
	var z = (shape[vA].z + shape[vB].z + shape[vC].z)/3;
	return new vector(x,y,z);
};

function getIsoPoints() {
for(var i = 0; i < shape.length; i++){
//Change each XYZ to XY
//Bigger the z is, smaller the x should be
x[i] = xC + shape[i].x;
y[i] = yC + Canvas.height - shape[i].y;
}
}
//this is just making it bigger the further out though?
function getPerspectivePoints(fov) {
var Scale = 1/(Math.tan(fov*0.5*Math.PI/180));
for(var i = 0; i < shape.length; i++){
if(shape[i].z < 0){
//x[i] = xC + (shape[i].x + Canvas.width/3)* Scale;
//y[i] = yC + (Canvas.height - (shape[i].y + Canvas.height/3))* Scale;
//z[i] = shape[i].z * (-far / (far - near)) + (-far * near / (far - near));
var d = 500;
var r = d/shape[i].z;
x[i] = xC + (shape[i].x*r);
y[i] = -yC + (shape[i].y*r);

}
}
}

//Projection matrix
//scale = 1 / tan(angleOfView * 0.5 * M_PI / 180);
//M[0][0] = scale; // scale the x coordinates of the projected point
//M[1][1] = scale; // scale the y coordinates of the projected point
//M[2][2] = -far / (far - near); // used to remap z to [0,1]
//M[3][2] = -far * near / (far - near); // used to remap z [0,1]
//M[2][3] = -1; // set w = -z
//M[3][3] = 0;


function getNorm(vA,vB,vC){
var U = shape[vA].subtractVectorFromVector(shape[vB]);
var V = shape[vC].subtractVectorFromVector(shape[vB]);

return U.multiplyVector(V);
}

function renderTri(vA,vB,vC,color){
if(getNorm(vA,vB,vC).z > 0){
ctx.beginPath();
ctx.moveTo(x[vA],y[vA]);
ctx.lineTo(x[vB],y[vB]);
ctx.lineTo(x[vC],y[vC]);
ctx.closePath();
var lightA = Math.PI; //change this to move lighting around
var angle = Math.atan((getNorm(vA,vB,vC).x)/(getNorm(vA,vB,vC).z));
ctx.fillStyle = shadeColor(color, (angle+lightA)*(40/Math.PI));
ctx.strokeStyle = shadeColor(color,(angle+lightA)*(40/Math.PI));;
ctx.stroke();
ctx.fill();
}
}

function renderQuad(vA,vB,vC,vD,color){
renderTri(vA,vB,vC,color);
renderTri(vD,vA,vC,color);
} 








