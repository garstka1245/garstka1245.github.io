//hold the levels and model locations


function sceneAnimalsDraw(){
	gl.clearColor(backgroundColor.r, backgroundColor.g, backgroundColor.b, 1.0);  // Clear color
	gl.clearDepth(1.0);                 // Clear depth  
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear buffer

	
	mat4.translate(zTranslationMatrix, viewMatrix, [0, 0, 750]);
	mat4.rotate(rotMatrix, zTranslationMatrix, Math.PI/2, [0, 1, 0]);
	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, rotMatrix);
	Draw1.draw(program);	
	
	
	mat4.translate(zTranslationMatrix, viewMatrix, [0, 0, 750]);
	mat4.rotate(rotMatrix, zTranslationMatrix, Math.PI, [0, 1, 0]);
	mat4.translate(xTranslationMatrix, rotMatrix, [200, 0, 0]);
	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, xTranslationMatrix);
	Draw2.draw(program);
}
