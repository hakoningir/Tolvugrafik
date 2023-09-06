var canvas;
var gl;

var a = vec2( 0,   -0.8 );
var b = vec2(-0.1, -0.9 );
var c = vec2( 0.1, -0.9 );
var vertices = [a,b,c];
var theta = 1.5708;
var x0 = (a[0]+b[0]+c[0])/3;
var y0 = (a[1]+b[1]+c[1])/3;

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.DYNAMIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    // uniform breytur
    frogLoc = gl.getUniformLocation( program, "frog" );
    color = gl.getUniformLocation(program, "colorFrog");

    const step = 0.1;
    var dir = 1;
    // Event listener for keyboard
    window.addEventListener("keydown", (e) => {
        if(e.code == "ArrowUp"){
            if(dir == 2){// var að benda hægri
                vertices[2][0] = vertices[1][0]+0.2
                vertices[2][1] = vertices[1][1]
            }
            else if(dir == 3){// var að benda niður
                vertices[0][1] += 0.1;
                vertices[1][1] -= 0.1;
                vertices[2][1] -= 0.1;
            }
            else if(dir == 4){// var að benda vinstri
                vertices[1][0] = vertices[2][0]-0.2
                vertices[1][1] = vertices[2][1]
            }
            for(let i = 0; i<3; i++) {
                vertices[i][1] += step
            }
            dir = 1
        }
        else if(e.code == "ArrowRight") {
            if(dir == 1){// var að benda upp
                vertices[2][0] = vertices[1][0]
                vertices[2][1] = vertices[1][1]+0.2
            }
            else if (dir == 3){// var að benda niður
                vertices[2][0] = vertices[1][0]
                vertices[2][1] = vertices[1][1]-0.2
            }
            else if(dir == 4){// var að benda vinstri
                vertices[0][0] += 0.1;
                vertices[1][0] -= 0.1;
                vertices[2][0] -= 0.1;
            }
            for(let i = 0; i<3; i++) {
                vertices[i][0] += step 
            }
            dir = 2
        }
        else if(e.code == "ArrowDown"){
            if(dir == 1){// var að benda upp
                vertices[0][1] -= 0.1;
                vertices[1][1] += 0.1;
                vertices[2][1] += 0.1;
            }
            else if(dir == 2){// var að benda hægri
                vertices[1][0] = vertices[2][0]+0.2
                vertices[1][1] = vertices[2][1]
            }
            else if(dir == 4){// var að benda vinstri
                vertices[2][0] = vertices[1][0]-0.2
                vertices[2][1] = vertices[1][1]
            }
            for(let i = 0; i<3; i++) {
                vertices[i][1] -= step
            }
            dir = 3
        }
        else if(e.code == "ArrowLeft"){
            if (dir == 1){ // var að benda upp
                vertices[1][0] = vertices[2][0]
                vertices[1][1] = vertices[2][1]+0.2
            }
            else if(dir == 2){// var að benda hægri
                vertices[0][0] -= 0.1;
                vertices[1][0] += 0.1;
                vertices[2][0] += 0.1;
            }
            else if(dir == 3){// var að benda niður
                vertices[2][0] = vertices[1][0]
                vertices[2][1] = vertices[1][1]-0.2
            }
            for(let i = 0; i<3; i++) {
                vertices[i][0] -= step;
            }
            dir = 4
        }
        console.log(dir)
        console.log(vertices);
        
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertices));
    });
    render();
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.uniform4fv(color, vec4(0,1,0,1));
    gl.drawArrays( gl.TRIANGLES, 0, 3 );

    window.requestAnimationFrame(render);
}
