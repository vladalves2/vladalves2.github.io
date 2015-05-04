function Camera(gl){
	
	this.center = [0,0,0];
	this.aim = [0,0,0];
	this.modelViewMatrix = mat4.create();
	this.projectionMatrix = mat4.create();

	this.setMatrices = function(){
		mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, this.projectionMatrix);
		mat4.identity(this.modelViewMatrix);
		mat4.translate(this.modelViewMatrix, this.center);
		
		mat4.rotate(this.modelViewMatrix, Math.PI/3, [-1, 0, 0]);
	};

	this.reset = function(gl){
		this.center = [0.0, 0.0, -7.0];
		this.setMatrices();
	};

	this.setUniforms = function(gl, projLoc, modelLoc, normalMatLoc){
		gl.uniformMatrix4fv(projLoc, false, this.projectionMatrix);
		gl.uniformMatrix4fv(modelLoc, false, this.modelViewMatrix);

		var normalMatrix = mat4.transpose(mat4.inverse(this.modelViewMatrix));
		gl.uniformMatrix4fv(normalMatLoc, false, normalMatrix);
	};

	this.translate = function(translation){
		this.center[0] += translation[0];
		this.center[1] += translation[1];
		this.center[2] += translation[2];
		this.setMatrices();
	};

	this.moveTo = function(pos){
		this.center = pos;
		this.setMatrices();
	};

	this.reset(gl);
}