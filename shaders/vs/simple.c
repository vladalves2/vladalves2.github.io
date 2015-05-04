attribute vec3 position;
attribute vec3 pointNormal;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 normalMatrix;

varying vec3 fragNormal;
varying vec3 fragPosition;
varying float height;

void main(void) {
	fragPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	fragNormal = normalize((normalMatrix * vec4(pointNormal, 0.0)).xyz);
	height = position.z;	
}