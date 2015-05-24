precision mediump float;

uniform float lightIntensity;
uniform vec3 lightDirection;
varying vec3 fragNormal;
varying vec3 fragPosition;
varying float height;

void main(void) {
	
	vec3 viewDirection = normalize(-fragPosition);
	float VdotN = dot(viewDirection, fragNormal);
	if (VdotN <= 0.0) {
		gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
	} else {
		//vec3 lightDirection = lightPosition - fragPosition;
		//float distance = length(lightDirection);
		vec3 lightDirection2 = normalize(lightDirection);
		float lambertian = max(abs(dot(lightDirection2, fragNormal)), 0.0);
	
		//vec3 halfDirection = normalize(lightDirection2 + viewDirection);
		//float NdotH = max(dot(fragNormal, halfDirection), 0.0);
		//float specular = pow(NdotH, 7.0);
	
		//float intensity = min(lightIntensity * (lambertian + specular), 1.0);// / (distance*distance), 1.0);
		float intensity = max(min(lightIntensity * lambertian, 1.0), 0.0);// / (distance*distance), 1.0);

		vec3 iceColor = vec3(0.95, 0.98, 0.97);
		vec3 grassColor = vec3(0.23, 0.76, 0.31);
		vec3 dirtyColor = vec3(0.56, 0.43, 0.32);

		vec3 finalColor;
		if (height > 0.7) finalColor = iceColor;
		else if (height > 0.1) finalColor = mix(grassColor, iceColor, (height - 0.1) / 0.6) ;
		else if (height > -0.5) finalColor = mix(dirtyColor, grassColor, (height + 0.5) / 0.6);
		else finalColor = dirtyColor;
		gl_FragColor = vec4((finalColor * intensity).xyz, 1.0);
	}	
}