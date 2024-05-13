var canvas = document.querySelectorAll(".glcanvas");

var startTime, elapsed;
if (canvas) {
  canvas.forEach((c) => {
    var title = c.getAttribute('value');
    var path = '/assets/glsl/'+title+'.vert.js';
    try{
      import(path).then((e)=>{
        setup(e.vertex, e.fragment,c);
      });
    } catch(err){
      console.log(err.message);
    }
  })
}

function setup(v,f, canvas) {
  //context WebGL
  var gl = canvas.getContext("webgl");
  //Verifie si WebGL est supporté
  if (gl === null) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }
  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  var shaderProgram = initShaderProgram(gl, v, f);
  // Collect all the info needed to use the shader program.
  // Look up which attribute our shader program is using
  // for aVertexPosition and look up uniform locations.
  var programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, "a_position"),
    },
    uniformLocations: {
      resolutionLocation: gl.getUniformLocation(shaderProgram, "u_resolution"),
      timeLocation: gl.getUniformLocation(shaderProgram, "u_time"),
    },
  };
  //Initialise le buffer
  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.useProgram(shaderProgram);

  startTime = Date.now();
  draw(gl, programInfo);
  setInterval(() => {
    draw(gl, programInfo);    
  }, 10);
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
  var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program
  var shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert(
      `Unable to initialize the shader program: ${gl.getProgramInfoLog(
        shaderProgram
      )}`
    );
    return null;
  }
  return shaderProgram;
}

function draw(gl, programInfo) {
  elapsed = Date.now() - startTime;
  resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

  var x1 = 0;
  var x2 = gl.canvas.width;
  var y1 = 0;
  var y2 = gl.canvas.height;
  gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array([
          x1, y1,
          x2, y1,
          x1, y2,
          x1, y2,
          x2, y1,
          x2, y2,
      ]),
      gl.STATIC_DRAW);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 2;          // 2 components per iteration
  var type = gl.FLOAT;   // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, size, type, normalize, stride, offset);

  // Tell WebGL to use our program when drawing
  gl.useProgram(programInfo.program);
  // set the resolution
  gl.uniform2f(programInfo.uniformLocations.resolutionLocation, gl.canvas.width, gl.canvas.height);
  gl.uniform1f(programInfo.uniformLocations.timeLocation, elapsed);    
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6);
}

function resizeCanvasToDisplaySize(canvas) {
  // Lookup the size the browser is displaying the canvas in CSS pixels.
  var displayWidth  = canvas.clientWidth;
  var displayHeight = canvas.clientHeight;

  // Check if the canvas is not the same size.
  var needResize = canvas.width  !== displayWidth || canvas.height !== displayHeight;

  if (needResize) {
    // Make the canvas the same size
    canvas.width  = displayWidth;
    canvas.height = displayHeight;
  }
  return needResize;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  var shader = gl.createShader(type);

  // Send the source to the shader object
  gl.shaderSource(shader, source);

  // Compile the shader program
  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`
    );
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}