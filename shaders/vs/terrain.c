attribute vec3 position;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 normalMatrix;

uniform float scale;
uniform int maxLvl;
uniform float random[10];

varying vec3 fragNormal;
varying vec3 fragPosition;
varying float height;

float hash(vec2 v){
	//ivec2 chao = ivec2(floor(v * 10000000.0));
	int chao = int(floor(v.x*10000.0 + v.y* 10001.0));
	float absolute;
	float hash = 0.0;
	int z, charCode;
	for (int i = 0; i < 100; i++){
		if (chao != 0){
			z = chao / 10;
			charCode = chao - 10 * z;
			if (charCode < 0) charCode = 10+charCode;
			if (charCode <= 0) hash += random[0];
			else if (charCode >= 9) hash += random[9];
			else hash += random[charCode];
			chao = z;
		}
		else break;
	}
	//for (int i = 0; i < 100; i++){
	//	if (chao.y != 0){
	//		z = chao.y / 10;
	//		charCode = chao.y - 10 * z;
	//		if (charCode < 0) charCode = 10+charCode;
	//		if (charCode <= 0) hash += random[0];
	//		else if (charCode >= 9) hash += random[9];
	//		else hash += random[charCode];
	//		chao.y = z;
	//	}
	//	else break;
	//}
	
	return fract(hash);
}

void main(void) {
	vec4 unity = vec4(1.0, 1.0, 1.0, 1.0);
	vec2 point = scale* position.xy;
	vec4 bb = vec4(floor(point), floor(point) + vec2(1.0,1.0));
	vec2 delta = vec2((point.x - bb.x) / (bb.z - bb.x), (point.y - bb.y) / (bb.w - bb.y));

	vec4 corners = 2.0 * vec4(hash(bb.xy), hash(bb.zy), hash(bb.xw), hash(bb.zw)) - 1.0;
	// SW SE NW NE	
	int lvl = 1;
	float multiplier = 0.5;

	for (int i = 0; i < 31; i++){
		if (lvl <= maxLvl){
			if (delta.x > 0.5){
				if (delta.y > 0.5){
					bb.xy = vec2((bb.z + bb.x), (bb.w + bb.y)) * 0.5;
					corners.xzy = vec3(dot(unity, corners) * 0.25 + (2.0 * hash(bb.xy) - 1.0)*multiplier, (corners.w + corners.z) * 0.5 + (2.0 * hash(bb.xw) - 1.0)*multiplier, (corners.w + corners.y) * 0.5 + (2.0 * hash(bb.zy) - 1.0)*multiplier);
				}
				else {
					bb.xw = vec2((bb.z + bb.x), (bb.w + bb.y)) * 0.5;
					corners.zwx = vec3(dot(unity, corners) * 0.25 + (2.0 * hash(bb.xw) - 1.0)*multiplier, (corners.w + corners.y) * 0.5 + (2.0 * hash(bb.zw) - 1.0)*multiplier, (corners.x + corners.y) * 0.5 + (2.0 * hash(bb.xy) - 1.0)*multiplier);
				}
			}
			else {
				if (delta.y > 0.5){
					bb.zy = vec2((bb.z + bb.x), (bb.w + bb.y)) * 0.5;
					corners.ywx = vec3(dot(unity, corners) * 0.25 + (2.0 * hash(bb.zy) - 1.0)*multiplier, (corners.w + corners.z) * 0.5 + (2.0 * hash(bb.zw) - 1.0)*multiplier, (corners.x + corners.z) * 0.5 + (2.0 * hash(bb.xy) - 1.0)*multiplier);
				}
				else {
					bb.zw = vec2((bb.z + bb.x), (bb.w + bb.y)) * 0.5;
					corners.wzy = vec3(dot(unity, corners) * 0.25 + (2.0 * hash(bb.zw) - 1.0)*multiplier, (corners.z + corners.x) * 0.5 + (2.0 * hash(bb.xw) - 1.0)*multiplier, (corners.y + corners.x) * 0.5 + (2.0 * hash(bb.zy) - 1.0)*multiplier);
				}
			}
			delta = (point - bb.xy) / (bb.zw - bb.xy);
			lvl++;
			multiplier *= 0.5;
		}
		else break;
	}

	float dt = 0.001;
	if (delta.x == 0.0) {
		if (delta.y != 0.0)
			dt = delta.y*0.001;
	} else if (delta.y == 0.0){
		dt = delta.x*0.001;
	} else {
		if (delta.x > delta.y) 
			dt = delta.y*0.001;
		else 
			dt = delta.x*0.001;
	}

	float tmpHeight = mix(mix(corners.x, corners.y, delta.x), mix(corners.z, corners.w, delta.x), delta.y);
	float dhu = mix(mix(corners.x, corners.y, delta.x + dt), mix(corners.z, corners.w, delta.x + dt), delta.y) - mix(mix(corners.x, corners.y, delta.x - dt), mix(corners.z, corners.w, delta.x - dt), delta.y);
	float dhv = mix(mix(corners.x, corners.y, delta.x), mix(corners.z, corners.w, delta.x), delta.y + dt) - mix(mix(corners.x, corners.y, delta.x), mix(corners.z, corners.w, delta.x), delta.y - dt);
	vec3 dpdu = vec3(2.0*dt / scale, 0.0, dhu);
	vec3 dpdv = vec3(0.0, 2.0*dt / scale, dhv);
	vec3 normal =  cross(normalize(dpdu), normalize(dpdv));

	fragPosition = (modelViewMatrix * vec4(position.xy, tmpHeight, 1.0)).xyz;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xy, tmpHeight, 1.0);
	fragNormal = normalize((normalMatrix * vec4(normal, 0.0)).xyz);
	height = tmpHeight;
}