function Vertex(){
	this.position = [0,0,0];
	this.normal = [1,0,0];
}

function Mesh(type){
	this.basic = new Basic();
	this.positionVertexArrayObject = -1;
	this.positionBuffer = -1;
	this.normalBuffer = -1;
	this.indexBuffer = -1;
	this.boundingBox = [0,0,0,0,0,0];
	this.vertices = [];
	this.normals = [];
	this.triangleVerticesIds = [];

	this.seed = 0;
	this.size = 2.0;

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
			var rands = [];
			Math.seedrandom(this.seed+'');
			var n = 100;
			for (var i = 0; i < n*n; i++) rands[i] = Math.random()*2.0 - 1.0;
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
		
		var index = 0;
		var squares = [0,0,n-1,n-1,1.0];
		this.vertices[2] = rands[0];
		this.vertices[(n-1)*3 + 2] = rands[n-1];
		this.vertices[(n-1)*n*3 + 2] = rands[(n-1)*n];
		this.vertices[(n-1)*(n+1)*3 + 2] = rands[(n-1)*(n+1)];
		while (index < squares.length){
			var iMin = squares[index];
			var jMin = squares[index+1];
			var iMax = squares[index+2];
			var jMax = squares[index+3];
			var lvl = squares[index+4]/2.0;

			var SW = jMin*n + iMin;
			var SE = jMin*n + iMax;
			var NW = jMax*n + iMin;
			var NE = jMax*n + iMax;
			

			if ((iMax - iMin > 1)&&(jMax - jMin > 1)) {
				var jHalf = Math.floor((jMin+jMax)/2.0);
				var iHalf = Math.floor((iMin+iMax)/2.0);
								
				var N = jMax*n + iHalf;
				var S = jMin*n + iHalf;
				var W = jHalf*n + iMin;
				var E = jHalf*n + iMax;
				var C = jHalf*n + iHalf;

				var Sheight = (this.vertices[SE*3+2] + this.vertices[SW*3+2])/2.0;
				var Nheight = (this.vertices[NE*3+2] + this.vertices[NW*3+2])/2.0;
				var Wheight = (this.vertices[SW*3+2] + this.vertices[NW*3+2])/2.0;
				var Eheight = (this.vertices[SE*3+2] + this.vertices[NE*3+2])/2.0;
				var Cheight = (Sheight + Nheight + Wheight + Eheight)/4.0;
				
				this.vertices[N*3+2] = Nheight + rands[N]*lvl;
				this.vertices[S*3+2] = Sheight + rands[S]*lvl;
				this.vertices[W*3+2] = Wheight + rands[W]*lvl;
				this.vertices[E*3+2] = Eheight + rands[E]*lvl;
				this.vertices[C*3+2] = Cheight + rands[C]*lvl;

				if ((jMax - jHalf > 1)||(iHalf - iMin > 1)) {
					squares[squares.length] = iMin;
					squares[squares.length] = jHalf;
					squares[squares.length] = iHalf;
					squares[squares.length] = jMax;
					squares[squares.length] = lvl;
				} 
				
				if ((jMax - jHalf > 1)||(iMax - iHalf > 1)) {
					squares[squares.length] = iHalf;
					squares[squares.length] = jHalf;
					squares[squares.length] = iMax;
					squares[squares.length] = jMax;
					squares[squares.length] = lvl;
				}
				
				if ((jHalf - jMin > 1)||(iHalf - iMin > 1)) {
					squares[squares.length] = iMin;
					squares[squares.length] = jMin;
					squares[squares.length] = iHalf;
					squares[squares.length] = jHalf;
					squares[squares.length] = lvl;
				}

				if ((jHalf - jMin > 1)||(iMax - iHalf > 1)) {
					squares[squares.length] = iHalf;
					squares[squares.length] = jMin;
					squares[squares.length] = iMax;
					squares[squares.length] = jHalf;
					squares[squares.length] = lvl;
				}				
			} else if ((iMax - iMin == 1)&&(jMax - jMin > 1)) {
				var jHalf = Math.floor((jMin+jMax)/2.0);

				var W = jHalf*n + iMin;
				var E = jHalf*n + iMax;
				
				var Wheight = (this.vertices[SW*3+2] + this.vertices[NW*3+2])/2.0;
				var Eheight = (this.vertices[SE*3+2] + this.vertices[NE*3+2])/2.0;

				this.vertices[W*3+2] = Wheight + rands[W]*lvl;
				this.vertices[E*3+2] = Eheight + rands[E]*lvl;				

				if (jMax - jHalf > 1) {
					squares[squares.length] = imin;
					squares[squares.length] = jHalf;
					squares[squares.length] = iMax;
					squares[squares.length] = jMax;
					squares[squares.length] = lvl;
				}

				if (jHalf - jMin > 1) {
					squares[squares.length] = iMin;
					squares[squares.length] = jMin;
					squares[squares.length] = iMax;
					squares[squares.length] = jHalf;
					squares[squares.length] = lvl;
				}
				
			} else if ((iMax - iMin > 1)&&(jMax - jMin == 1)) {
				var iHalf = Math.floor((iMin+iMax)/2.0);

				var N = jMax*n + iHalf;
				var S = jMin*n + iHalf;
				
				var Sheight = (this.vertices[SE*3+2] + this.vertices[SW*3+2])/2.0;
				var Nheight = (this.vertices[NE*3+2] + this.vertices[NW*3+2])/2.0;

				this.vertices[N*3+2] = Nheight + rands[N]*lvl;
				this.vertices[S*3+2] = Sheight + rands[S]*lvl;

				if (iHalf - iMin > 1) {
					squares[squares.length] = iMin;
					squares[squares.length] = jMin;
					squares[squares.length] = iHalf;
					squares[squares.length] = jMax;
					squares[squares.length] = lvl;
				}

				if (iMax - iHalf > 1) {
					squares[squares.length] = iHalf;
					squares[squares.length] = jMin;
					squares[squares.length] = iMax;
					squares[squares.length] = jMax;
					squares[squares.length] = lvl;				
				}
			}				
			index += 5;
		}
		
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
		this.positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

		this.normalBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);
		
		this.indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(this.triangleVerticesIds), gl.STATIC_DRAW);
	};

	this.draw = function(positionLoc, normalLoc){
		gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
		gl.enableVertexAttribArray(positionLoc);
		gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, gl.FALSE, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
		gl.enableVertexAttribArray(normalLoc);
		gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, gl.FALSE, 0, 0);

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