var gl;
// var triangle;
let vertices = [];
var colorLoc;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    for(let i = 0; i <= 100; i++){
        vertices.push(vec2(-0.1, 0),
                      vec2(0.1, 0),
                      vec2(0, 0.1));
    }
    
    // var u = add( vertices[0], vertices[1]);
    // var v = add( vertices[0], vertices[2]);
    // var t = scale(Math.random(), add(u,v));

    // triangle = [t]

    for (let i = 0; i <= vertices.length; i += 6){
        var x = Math.random()
        var y = Math.random()
        vertices[i]+=x, vertices[i+2]+=x, vertices[i+4]+=x;
        vertices[i+1]+=y, vertices[i+3]+=y, vertices[i+5]+=y;
        //færa alla punkta um randomtölu á bilinu -1 og 1
    }
    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate shader variables with our data buffer
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    // Find the location of the variable fColor in the shader program
    colorLoc = gl.getUniformLocation( program, "uni" );
    
    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    for(let i = 0; i < 100; i++){
        gl.uniform4fv( colorLoc, vec4(Math.random(), Math.random(), Math.random(), Math.random()) );
        gl.drawArrays( gl.TRIANGLES, 0, vertices.length );   
    }
}
