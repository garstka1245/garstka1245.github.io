//A point in space, an object with x,y,z 
//Methods execute functions with the point at hand.
/*
X=(1,0,0)
Y=(0,1,0)
Z=(0,0,1)
*/
//Tutorial used 
//https://gamedevelopment.tutsplus.com/tutorials/lets-build-a-3d-graphics-engine-linear-transformations--gamedev-7716
//Ocd small decimals
function sin(Degrees){
	return parseFloat(Math.sin(Degrees).toFixed(10));
}
function cos(Degrees){
	return parseFloat(Math.cos(Degrees).toFixed(10));
}
function shadeColor(color, percent) {
//Color adjustment from hex, by a percentage.
  color = color.substr(1);
  var num = parseInt(color, 16),
    val = Math.round(2.55 * percent),
    R = (num >> 16) + val,
    G = (num >> 8 & 0x00FF) + val,
    B = (num & 0x0000FF) + val;
	
	
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);

  
  }
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
function rgb(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}



//Point in space. Contrary, not used but math is there./ Can be used to get vectors.
function point(x,y,z){
	this.x=x;
	this.y=y;
	this.z=z;
}	
point.prototype.drawPoint = function() {
	//Later used to actually draw
    return this.x + " " + this.y + " " + this.z;
};
point.prototype.subtractPointFromPoint = function(Point) {
	var x = this.x - Point.x; 
	var y = this.y - Point.y;
	var z = this.z - Point.z;
    return new vector(x,y,z);
};
point.prototype.addVectorToPoint = function(Vector) {
	this.x += Vector.x; 
	this.y += Vector.y;
	this.z += Vector.z;
};
point.prototype.subtractVectorFromPoint = function(Vector) {
	this.x -= Vector.x; 
	this.y -= Vector.y;
	this.z -= Vector.z;
};
point.prototype.setPointToPoint = function(Point) {
	this.x = Point.x; 
	this.y = Point.y;
	this.z = Point.z;
};

//Line from relative 0,0,0 to x,y,z
function vector(x,y,z){
	this.x=x;
	this.y=y;
	this.z=z;
}
vector.prototype.addVectorToVector = function(Vector) {
	var x = this.x + Vector.x; 
	var y = this.y + Vector.y;
	var z = this.z + Vector.z;
    return new vector(x,y,z);
};
vector.prototype.subtractVectorFromVector = function(Vector) {
	var x = this.x - Vector.x; 
	var y = this.y - Vector.y;
	var z = this.z - Vector.z;
    return new vector(x,y,z);
};
vector.prototype.rotateX = function(Degrees) {
	var x = this.x;
	var y = this.y;
	
	this.x = x*cos(Degrees) + y*-sin(Degrees); 
	this.y = x*sin(Degrees) + y*cos(Degrees);
};
vector.prototype.rotateY = function(Degrees) {
	var x = this.x;
	var z = this.z;
	
	this.x = x*cos(Degrees) + z*sin(Degrees); 
	this.z = x*-sin(Degrees) + z*cos(Degrees);
};
vector.prototype.rotateZ = function(Degrees) {
	var y = this.y;
	var z = this.z;
	
	this.y = y*cos(Degrees) + z*-sin(Degrees);
	this.z = y*sin(Degrees) + z*cos(Degrees);
};
vector.prototype.scale = function(Sx,Sy,Sz) {
	this.x *= Sx;
	this.y *= Sy;
	this.z *= Sz;
};
vector.prototype.x1 = function() {
return this.x/this.z;
};
vector.prototype.y1 = function() {
return this.y/this.z;
};
vector.prototype.multiplyVector = function(Vector) {
	var x = (this.y * Vector.z)-(this.z * Vector.y); 
	var y = (this.z * Vector.x)-(this.x * Vector.z);
	var z = (this.x * Vector.y)-(this.y * Vector.x);
return new vector(x,y,z);
};
vector.prototype.dotVector = function(Vector) {
	var D = (this.x * Vector.x)+(this.y * Vector.y)+(this.z * Vector.z); 
return new vector(x,y,z);
};




