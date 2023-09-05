var canvas;
var gl;

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    var vertices = [
        vec2( 0,   -0.8 ),
        vec2(-0.1, -0.9 ),
        vec2( 0.1, -0.9 ),
    ];
    
    // var vertices = [
    //     vec2( 0,   -0.85 ),
    //     vec2( 0.1, -0.8  ),
    //     vec2( 0.1, -0.9  ),
    // ];
    
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

    var step = 0.2;

    /* var vertices = [
         vec2(  0, -0.85 ) ,
         vec2(  0.1, -0.8 ),
         vec2( 0.1, -0.9 ),
     ];
        vec2(  0,   -0.8 ) ,
        vec2(  0.1, -0.9 ),
        vec2( -0.1, -0.9 ),     
    */
    // Event listener for keyboard
    window.addEventListener("keydown", (e) => {
        if(e.code == "ArrowLeft")           // left
            for(let i = 0; i<3; i++) {
                vertices[i][0] -= step;
                vertices = turnleft(vertices);
            }
        else if(e.code == "ArrowUp")        // up
            for(let i = 0; i<3; i++) vertices[i][1] += step;
        else if(e.code == "ArrowRight")     // right
            for(let i = 0; i<3; i++) vertices[i][0] += step;
        else if(e.code == "ArrowDown")      // down
            for(let i = 0; i<3; i++) vertices[i][1] -= step;
        console.log(e.code);
        console.log(vertices);
        
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertices));
    });
    render();
}
/* var vertices = [
     vec2(  0, -0.85 ) ,
     vec2(  0.1, -0.8 ),
     vec2( 0.1, -0.9 ),
 ];
    vec2(  0,   -0.8 ) ,
    vec2(  0.1, -0.9 ),
    vec2( -0.1, -0.9 ),
*/
var theta = 0.1
function turnleft(vertices){
    var ax = vertices[0][0];
    var ay = vertices[0][1];
    var rotateX = ax*Math.cos(theta) + ay * (-Math.sin(theta)) + ax
    var bx = vertices[1][0];
    var by = vertices[1][1]+0.2;
    var cx = vertices[1][0];
    var cy = vertices[1][1];
    // var ax = bx-0.2;
    var ay = cy-0.1;
    return [ //lífið fokking sökkar ég hata þetta drasl, afh er ekki bara rotate fall
        vec2(ax, ay), 
        vec2(bx, by),
        vec2(rotateX, cy), 
    ]
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.uniform4fv(color, vec4(0,1,0,1));
    gl.drawArrays( gl.TRIANGLES, 0, 3 );

    window.requestAnimationFrame(render);
}
