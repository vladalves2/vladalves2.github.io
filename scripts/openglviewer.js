function loadShaders(gl, shaders) {
	for (var i = 0; i < shaders.length; i++) {
		var filePath = "shaders/" + shaders[i] + ".c";
		xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET",filePath,false);
		xmlhttp.send(null); 
		var fileContent = xmlhttp.responseText;
		shaders[i] = gl.createShader(shaders[i].slice(0, 2) == "fs" ? gl.FRAGMENT_SHADER : gl.VERTEX_SHADER);
		gl.shaderSource(shaders[i], fileContent);
		gl.compileShader(shaders[i]);
	}
	return shaders;
}

var lightIntensity = 25.0;
var canvas;
var meshes = [];
var camera;

var currentPos;
var shaderProgram;
var gl;

var active = true;

function initGL(canvas) {
	try { this.gl = canvas.getContext("webgl"); }
	catch (x) { this.gl = null; }

	if (this.gl == null) {
		try { this.gl = canvas.getContext("experimental-webgl"); }
		catch (x) { this.gl = null; }
	}

	if (!this.gl) {
		alert("Could not initialise WebGL");
	} else {
		this.gl.viewportWidth = canvas.width;
		this.gl.viewportHeight = canvas.height;
	}

	this.gl.getExtension("OES_element_index_uint");
}

		

function initShaders() {
	var shaderObjects = loadShaders(this.gl, ["fs/white", "vs/simple"]);
	this.shaderProgram = this.gl.createProgram();
	this.gl.attachShader(shaderProgram, shaderObjects[1]);
	this.gl.attachShader(shaderProgram, shaderObjects[0]);
	this.gl.linkProgram(shaderProgram);
		if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
		alert("Could not initialise shaders");
	}
	this.gl.useProgram(shaderProgram);
	shaderProgram.positionLoc = this.gl.getAttribLocation(shaderProgram, "position");
	shaderProgram.normalLoc = this.gl.getAttribLocation(shaderProgram, "pointNormal");
	shaderProgram.lightPositionLoc = this.gl.getUniformLocation(shaderProgram, "lightPosition");
	shaderProgram.lightIntensityLoc = this.gl.getUniformLocation(shaderProgram, "lightIntensity");
	shaderProgram.projectionMatrixUniform = this.gl.getUniformLocation(shaderProgram, "projectionMatrix");
	shaderProgram.modelViewMatrixUniform = this.gl.getUniformLocation(shaderProgram, "modelViewMatrix");
	shaderProgram.normalMatrix = this.gl.getUniformLocation(shaderProgram, "normalMatrix");
}

function setLight(){
	gl.uniform3f(shaderProgram.lightPositionLoc, 0.0, 0.0, 0.05);
	gl.uniform1f(shaderProgram.lightIntensityLoc, this.lightIntensity);
}

function drawScene() {
	this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
	this.gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	this.camera.setUniforms(this.gl, shaderProgram.projectionMatrixUniform, shaderProgram.modelViewMatrixUniform, shaderProgram.normalMatrix);
	this.setLight();

	this.meshes[0].draw(shaderProgram.positionLoc, shaderProgram.normalLoc);
	//meshes[1].draw(shaderProgram.positionLoc, shaderProgram.normalLoc);
	//meshes[2].draw(shaderProgram.positionLoc, shaderProgram.normalLoc);		
}

function webGLStart() {
	canvas = document.getElementById("lesson01-canvas");
	initGL(canvas);
	initShaders();

	this.meshes[0] = new Mesh(3);
	//this.meshes[1] = new Mesh(1);
	//this.meshes[2] = new Mesh(2);
	this.camera = new Camera(this.gl);

	this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
	this.gl.enable(this.gl.DEPTH_TEST);

	this.currentPos = {x:-9000,y:-9000};
	drawScene();
}

function getMousePosition(event){
	var element = canvas;
	var pos = {x:0, y:0};
	while(element) {
		pos.x += (element.offsetLeft - element.scrollLeft + element.clientLeft);
		pos.y += (element.offsetTop - element.scrollTop + element.clientTop);
		element = element.offsetParent;
	}

	pos.x = event.clientX - pos.x;
    pos.y = event.clientY - pos.y;

	return pos;
}

function mouseDown(event){
	this.currentPos = getMousePosition(event);
	this.active = true;
}

function mouseUp(event){
	this.currentPos = {x:-10000,y:-10000};
	this.active = false;
}

function mouseLeave(event){
	this.active = false;
}

function mouseEnter(event){
	this.active = true;
}

function mouseMove(event){
	if (this.active) {
		var newPos = getMousePosition(event);
		var delta = {x: newPos.x - this.currentPos.x, y: newPos.y - this.currentPos.y};
		var dist = delta.x*delta.x + delta.y*delta.y;
		if ((dist > 8)&&(dist < 1000000)){
			this.currentPos = newPos;
			delta.x *= 0.01; 
			delta.y *= 0.01;
			this.camera.translate([delta.x, -delta.y, 0]);
			drawScene();
		}
	}
}

function setCameraHeight(value){
	var newPos = [this.camera.center[0], this.camera.center[1], -value];
	this.camera.moveTo(newPos);
	drawScene();
}

function setLightIntensity(value){
	this.lightIntensity = value;
	drawScene();
	drawScene();
}

function setSeed(value){
	this.meshes[0].seed = value;
	this.meshes[0].initialize(3);
	drawScene();
	drawScene();
}

function setSize(value){
	this.meshes[0].size = value;
	this.meshes[0].initialize(3);
	drawScene();
	drawScene();
}