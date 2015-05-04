var Basic = function(){

	this.dot = function(a,b){
		return (a[0] * b[0] + a[1] * b[1] + a[2] * b[2]);
	};
	
	this.crossProduct = function(a, b) {
		var res = [a[1] * b[2] - b[1] * a[2],
			a[2] * b[0] - b[2] * a[0],
			a[0] * b[1] - b[0] * a[1]];
		return res;
	};

	this.normalize = function(a) {
		var mag = a[0] * a[0] + a[1] * a[1] + a[2] * a[2];
		var b = [0,1,0];
		if (mag >= 0.00000001) {
			b[0] = a[0] / mag;
			b[1] = a[1] / mag;
			b[2] = a[2] / mag;		
		}
		return b;
	};
	
	this.scale = function(a, scale){
		return [a[0]*scale, a[1]*scale, a[2]*scale];
	};

	this.getSignedDot3D = function(vector1, vector2, up){
		var dot = this.dot(vector1, vector2);
		var cross = this.crossProduct(vector2, vector1);
		var signal = this.dot(cross, up);
		if (signal < 0) return -dot;
		return dot;
	};

	this.triangulate = function(positions, perimeter){
		var triangulation = [];
		if (perimeter.length > 3){
			var up = [0,1,0];
			var angles = [];
			var a = perimeter[perimeter.length - 1];
			for (i = 0; i < perimeter.length; i++){
				var b = perimeter[i];
				var c = perimeter[(i+1)%perimeter.length];
				var ab = [positions[a].position[0] - positions[b].position[0], positions[a].position[1] - positions[b].position[1], positions[a].position[2] - positions[b].position[2]];
				var ac = [positions[c].position[0] - positions[b].position[0], positions[c].position[1] - positions[b].position[1], positions[c].position[2] - positions[b].position[2]];
				if (i == 0) {
					up = Basic.crossProduct(ac,ab);
				}
				angles[i] = Basic.getSignedDot3D(ab,ac,up);
				a=b;
			}

			while(perimeter.length > 3) {
				//perimeter.splice(index,1);
			}
		} 
		
		if (perimeter.length == 3) {
			triangulation[triangulation.length] = perimeter[0];
			triangulation[triangulation.length] = perimeter[1];
			triangulation[triangulation.length] = perimeter[2];
		}

		return triangulation;
	};
	
}