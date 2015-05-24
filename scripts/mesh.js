function Vertex(){
	this.position = [0,0,0];
	this.normal = [1,0,0];
}

String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length == 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

function Mesh(type){
	this.basic = new Basic();
	this.positionVertexArrayObject = -1;
	this.positionBuffer = -1;
	//this.normalBuffer = -1;
	this.indexBuffer = -1;
	this.boundingBox = [0,0,0,0,0,0];
	this.vertices = [];
	this.normals = [];
	this.triangleVerticesIds = [];

	this.detail = 18.0;
	this.size = 1.0;
	this.resolution = 100.0;
	this.seed = 1.0;
	this.scale = 0.7;

	this.randomTable = [0,0,0,0,0,0,0,0,0,0];

	this.hashCode = function(safe) {
	  var hash = 0, i, id, len;
	  if (safe.length == 0) return hash;
	  for (i = safe.length-1; i >= 0; i--) {
		id   = safe.charCodeAt(i) % 10;
		hash  += this.randomTable[id];
	  }
	  return (hash - Math.floor(hash));
	};

	this.hash = function(input, input2){
		var safe = String(Math.floor(input*10000000)) + String(Math.floor(input2*10000000));			
		return this.hashCode(safe);
	}

	this.loadTerrainHeights = function(scale, maxLvl, hashMax){
		Math.seedrandom(this.seed);
		this.randomTable[0] = Math.random();
		for (var i = 1; i < 10; i++){
			var isEqual = 1;
			while (isEqual == 1) {
				isEqual = 0;
				this.randomTable[i] = this.randomTable[i-1] + Math.random();
				this.randomTable[i] -= Math.floor(this.randomTable[i]);
				for (var j = 0; j < i; j++) {
					if (this.randomTable[j] == this.randomTable[i]) {
						isEqual = 1;
						break;
					}
				}
			} 
		}

		var nCoords = this.vertices.length;		
		for (var p = 0; p < nCoords; p+=3){			
			var point = {x:scale*this.vertices[p], y: scale*this.vertices[p+1]};
			var min = {i: Math.floor(point.x), j: Math.floor(point.y)};
			var max = {i: min.i+1, j:min.j+1};
			var delta = [(point.x-min.i)/(max.i-min.i), (point.y-min.j)/(max.j-min.j)];
			//var hash = [this.hash(min.i)%hashMax, this.hash(min.j)%hashMax, this.hash(max.i)%hashMax, this.hash(max.j)%hashMax];

			var SW = 2*this.hash(min.i,min.j) - 1;
			var SE = 2*this.hash(max.i,min.j) - 1;
			var NW = 2*this.hash(min.i,max.j) - 1;
			var NE = 2*this.hash(max.i,max.j) - 1;

			//Math.seedrandom(min.i + "" + min.j);
			//var SW = 2*Math.random() - 1;
			//Math.seedrandom(max.i + "" + min.j);
			//var SE = 2*Math.random() - 1;
			//Math.seedrandom(min.i + "" + max.j);
			//var NW = 2*Math.random() - 1;
			//Math.seedrandom(max.i + "" + max.j);
			//var NE = 2*Math.random() - 1;
			
			//var SW = 2*((hash[0]+hash[1])%hashMax)/hashMax - 1;
			//var SE = 2*((hash[2]+hash[1])%hashMax)/hashMax - 1;
			//var NW = 2*((hash[0]+hash[3])%hashMax)/hashMax - 1;
			//var NE = 2*((hash[2]+hash[3])%hashMax)/hashMax - 1;
			
			var lvl = 1;
			var multiplier = 0.5;
			while (lvl < maxLvl){				
				if (delta[0] > 0.5) {
					if (delta[1] > 0.5){
						min.i = (max.i + min.i)/2;
						min.j = (max.j + min.j)/2;	
						//hash[0] = this.hash(min.i)%hashMax;
						//hash[1] = this.hash(min.j)%hashMax;					
						//var upHash = hash[0] + hash[3];
						//var downHash = hash[2] + hash[1];
						//var centerHash = hash[0] + hash[1];
						
						//SW = (NE+NW+SE+SW)/4 + (2*(centerHash%hashMax)/hashMax - 1)*multiplier;
						//NW = (NE+NW)/2 + (2*(upHash%hashMax)/hashMax - 1)*multiplier;
						//SE = (NE+SE)/2 + (2*(downHash%hashMax)/hashMax - 1)*multiplier;
						
						//Math.seedrandom(min.i + "" + min.j);
						//SW = (NE+NW+SE+SW)/4 + (2*Math.random() - 1)*multiplier;
						//Math.seedrandom(min.i + "" + max.j);
						//NW = (NE+NW)/2 + (2*Math.random() - 1)*multiplier;
						//Math.seedrandom(max.i + "" + min.j);
						//SE = (NE+SE)/2 + (2*Math.random() - 1)*multiplier;
						

						SW = (NE+NW+SE+SW)/4 + (2*this.hash(min.i,min.j) - 1)*multiplier;
						NW = (NE+NW)/2 + (2*this.hash(min.i,max.j) - 1)*multiplier;
						SE = (NE+SE)/2 + (2*this.hash(max.i,min.j) - 1)*multiplier;

					} else {
						min.i = (max.i + min.i)/2;
						max.j = (max.j + min.j)/2;	
						//hash[0] = this.hash(min.i)%hashMax;
						//hash[3] = this.hash(max.j)%hashMax;	
						//var upHash = hash[2] + hash[3];
						//var downHash = hash[0] + hash[1];
						//var centerHash = hash[0] + hash[3];
						//NW = (NE+NW+SE+SW)/4 + (2*(centerHash%hashMax)/hashMax - 1)*multiplier;					
						//NE = (NE+SE)/2 + (2*(upHash%hashMax)/hashMax - 1)*multiplier;
						//SW = (SW+SE)/2 + (2*(downHash%hashMax)/hashMax - 1)*multiplier;						
						
						//Math.seedrandom(min.i + "" + min.j);
						//SW = (SW+SE)/2 + (2*Math.random() - 1)*multiplier;
						//Math.seedrandom(min.i + "" + max.j);
						//NW = (NE+NW+SE+SW)/4 + (2*Math.random() - 1)*multiplier;
						//Math.seedrandom(max.i + "" + max.j);
						//NE = (NE+SE)/2 + (2*Math.random() - 1)*multiplier;
						

						NW = (NE+NW+SE+SW)/4 + (2*this.hash(min.i,max.j) - 1)*multiplier;
						NE = (NE+SE)/2 + (2*this.hash(max.i,max.j) - 1)*multiplier;
						SW = (SW+SE)/2 + (2*this.hash(min.i,min.j) - 1)*multiplier;
					}
				} else {
					if (delta[1] > 0.5){
						max.i = (max.i + min.i)/2;
						min.j = (max.j + min.j)/2;		
						//hash[2] = this.hash(max.i)%hashMax;
						//hash[1] = this.hash(min.j)%hashMax;	
						//var upHash = hash[2] + hash[3];
						//var downHash = hash[0] + hash[1];
						//var centerHash = hash[2] + hash[1];
						//SE = (NE+NW+SE+SW)/4 + (2*(centerHash%hashMax)/hashMax - 1)*multiplier;					
						//NE = (NE+NW)/2 + (2*(upHash%hashMax)/hashMax - 1)*multiplier;
						//SW = (SW+NW)/2 + (2*(downHash%hashMax)/hashMax - 1)*multiplier;				
						
						//Math.seedrandom(min.i + "" + min.j);
						//SW = (SW+NW)/2 + (2*Math.random() - 1)*multiplier;
						//Math.seedrandom(max.i + "" + min.j);
						//SE = (NE+NW+SE+SW)/4 + (2*Math.random() - 1)*multiplier;
						//Math.seedrandom(max.i + "" + max.j);
						//NE = (NE+NW)/2 + (2*Math.random() - 1)*multiplier;
						
						SE = (NE+NW+SE+SW)/4 + (2*this.hash(max.i,min.j) - 1)*multiplier;
						NE = (NE+NW)/2 + (2*this.hash(max.i,max.j)- 1)*multiplier;
						SW = (SW+NW)/2 + (2*this.hash(min.i,min.j) - 1)*multiplier;

					} else {
						max.i = (max.i + min.i)/2;
						max.j = (max.j + min.j)/2;	
						//hash[2] = this.hash(max.i)%hashMax;
						//hash[3] = this.hash(max.j)%hashMax;	
						//var upHash = hash[0] + hash[3];
						//var downHash = hash[2] + hash[1];
						//var centerHash = hash[2] + hash[3];
						//NE = (NE+NW+SE+SW)/4 + (2*(centerHash%hashMax)/hashMax - 1)*multiplier;					
						//NW = (NW+SW)/2 + (2*(upHash%hashMax)/hashMax - 1)*multiplier;
						//SE = (SE+SW)/2 + (2*(downHash%hashMax)/hashMax - 1)*multiplier;
						
						//Math.seedrandom(min.i + "" + max.j);
						//NW = (NW+SW)/2 + (2*Math.random() - 1)*multiplier;
						//Math.seedrandom(max.i + "" + min.j);
						//SE = (SE+SW)/2 + (2*Math.random() - 1)*multiplier;
						//Math.seedrandom(max.i + "" + max.j);
						//NE = (NE+NW+SE+SW)/4 + (2*Math.random() - 1)*multiplier;
						

						NE = (NE+NW+SE+SW)/4 + (2*this.hash(max.i,max.j) - 1)*multiplier;
						NW = (NW+SW)/2 + (2*this.hash(min.i,max.j) - 1)*multiplier;
						SE = (SE+SW)/2 + (2*this.hash(max.i,min.j) - 1)*multiplier;
					}
				}
				delta = [(point.x-min.i)/(max.i-min.i), (point.y-min.j)/(max.j-min.j)];
				lvl++;
				multiplier *= 0.5;
			}

			var upHeight = delta[0]*NE + (1-delta[0])*NW;
			var downHeight = delta[0]*SE + (1-delta[0])*SW;
			this.vertices[p+2] = delta[1]*upHeight  + (1-delta[1])*downHeight;			
		}
	}

	this.loadGeometry = function(type){
		if (type == 0) {
			this.vertices = [
				0.0,  1.0,  0.0,
				-1.0, -1.0,  0.0,
				1.0, -1.0,  0.0
			];	
			this.triangleVerticesIds = [0,1,2];		
		} else if (type == 1) {
			this.vertices = [
				4.0,  1.0,  0.0,
				2.0,  1.0,  0.0,
				4.0, -1.0,  0.0,
				2.0, -1.0,  0.0
			];
			this.triangleVerticesIds = [0,1,2,1,3,2];
		} else if (type == 2) {
			this.vertices = [
				0.0, 3.0, 0.0,
				0.0, 2.0, 0.0,
				1.0, 1.0, 0.0,
				2.0, 2.0, 0.0,
				2.0, 3.0, 0.0
			];
			this.triangleVerticesIds = [0,1,2,0,2,3,0,3,4];
		} else {
			this.triangleVerticesIds = [];
			this.vertices = [];
			this.normals = [];
			this.triangleVerticesIds[n*n] = 0;
			this.vertices[n*n + 2] = 0;
			this.normals[n*n + 2] = 0;

			var n = Math.floor(this.resolution);			
			var count = 0;
			var count2 = 0;			
			for (var i = 0; i < n-1; i++) {				
				var y = -this.size + 2.0*this.size*i/(n-1);
				for (var j = 0; j < n-1; j++) {
					var a = count2/3;
					this.triangleVerticesIds[count] = a;
					this.triangleVerticesIds[count+1] = a+1;
					this.triangleVerticesIds[count+2] = a+1+n;
					this.triangleVerticesIds[count+3] = a;
					this.triangleVerticesIds[count+4] = a+1+n;
					this.triangleVerticesIds[count+5] = a+n;
					count += 6;

					var x = -this.size + 2.0*this.size*j/(n-1);
					this.vertices[count2] = x;
					this.vertices[count2+1] = y;
					this.vertices[count2+2] = 0.0;
					count2 += 3;
				}
				this.vertices[count2] = this.size;
				this.vertices[count2+1] = y;
				this.vertices[count2+2] = 0.0;
				count2 += 3;
			}
			for (var j = 0; j < n-1; j++) {
				var x = -this.size + 2.0*this.size*j/(n-1);
				this.vertices[count2] = x;
				this.vertices[count2+1] = this.size;
				this.vertices[count2+2] = 0.0;
				count2 += 3;
			}
			this.vertices[count2] = this.size;
			this.vertices[count2+1] = this.size;
			this.vertices[count2+2] = 0.0;
			count2 += 3;
		}
		
		//this.loadTerrainHeights(this.scale, this.detail, this.seed);		
	};

	this.computeNormals = function(){
		for (p = 0; p < this.vertices.length; p++){
			this.normals[p] = 0;
		}

		var nTriangles = this.triangleVerticesIds.length / 3;
		for (i = 0; i < nTriangles; i++) {
			var a = this.triangleVerticesIds[3 * i] * 3;
			var b = this.triangleVerticesIds[3 * i + 1] * 3;
			var c = this.triangleVerticesIds[3 * i + 2] * 3;
			var ab = [ this.vertices[b] - this.vertices[a], this.vertices[b+1] - this.vertices[a+1], this.vertices[b+2] - this.vertices[a+2]];
			var ac = [ this.vertices[c] - this.vertices[a], this.vertices[c+1] - this.vertices[a+1], this.vertices[c+2] - this.vertices[a+2]];

			var n = this.basic.crossProduct(ab, ac);
			this.normals[a] += n[0]; this.normals[a+1] += n[1]; this.normals[a+2] += n[2];
			this.normals[b] += n[0]; this.normals[b+1] += n[1]; this.normals[b+2] += n[2];
			this.normals[c] += n[0]; this.normals[c+1] += n[1]; this.normals[c+2] += n[2];			
		}

		for (p = 0; p < this.vertices.length; p+=3){
			var normalized = this.basic.normalize([this.normals[p], this.normals[p+1], this.normals[p+2]]);	
			this.normals[p] = normalized[0];
			this.normals[p+1] = normalized[1];
			this.normals[p+2] = normalized[2];
		}
	};

	this.loadBuffers = function(){
		if (this.positionBuffer != -1)
			gl.deleteBuffer(this.positionBuffer);
		this.positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

		//if (this.normalBuffer != -1)
		//	gl.deleteBuffer(this.normalBuffer);
		//this.normalBuffer = gl.createBuffer();
		//gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
		//gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);
		
		if (this.indexBuffer != -1)
			gl.deleteBuffer(this.indexBuffer);
		this.indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(this.triangleVerticesIds), gl.STATIC_DRAW);
	};

	this.draw = function(positionLoc, normalLoc){
		gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
		gl.enableVertexAttribArray(positionLoc);
		gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, gl.FALSE, 0, 0);

		//gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
		//gl.enableVertexAttribArray(normalLoc);
		//gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, gl.FALSE, 0, 0);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		gl.drawElements(gl.TRIANGLES, this.triangleVerticesIds.length, gl.UNSIGNED_INT, 0);
	};

	this.finish = function(){
		
	};

	this.initialize = function(type){
		this.loadGeometry(type);
		this.computeNormals();
		this.loadBuffers();
	};

	this.setUniforms = function(gl, shaderProgram){
		gl.uniform1f(shaderProgram.scaleLoc, this.scale);
		gl.uniform1i(shaderProgram.maxLvlLoc, this.detail);


		Math.seedrandom(this.seed);
		this.randomTable[0] = Math.random();
		for (var i = 1; i < 10; i++){
			var isEqual = 1;
			while (isEqual == 1) {
				isEqual = 0;
				this.randomTable[i] = this.randomTable[i-1] + Math.random();
				this.randomTable[i] -= Math.floor(this.randomTable[i]);
				for (var j = 0; j < i; j++) {
					if (this.randomTable[j] == this.randomTable[i]) {
						isEqual = 1;
						break;
					}
				}
			} 
		}

		gl.uniform1fv(shaderProgram.randomLoc, this.randomTable);
	};

	this.initialize(type);
}

Mesh.prototype.updateBoundingBox = function(){
	if (this.vertices.length < 3) {
		this.boundingBox = [0,0,0,0,0,0];
	}
	else {
		this.boundingBox[0] = this.vertices[0].position[0];
		this.boundingBox[1] = this.vertices[0].position[1];
		this.boundingBox[2] = this.vertices[0].position[2];
		this.boundingBox[3] = this.boundingBox[0];
		this.boundingBox[4] = this.boundingBox[1];
		this.boundingBox[5] = this.boundingBox[2];

		var nPoints = this.vertices.length;
		for (i = 1; i < nPoints; i++){
			var x = this.vertices[i].position[0];
			if (this.boundingBox[0] > x) this.boundingBox[0] = x;
			else if (this.boundingBox[3] < x) this.boundingBox[3] = x;

			var y = this.vertices[i].position[1];
			if (this.boundingBox[1] > y) this.boundingBox[1] = y;
			else if (this.boundingBox[4] < y) this.boundingBox[4] = y;

			var z = this.vertices[i].position[2];
			if (this.boundingBox[2] > z) this.boundingBox[2] = z;
			else if (this.boundingBox[5] < z) this.boundingBox[5] = z;
		}
	}
}