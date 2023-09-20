var canvas;
var gl;

// Núverandi staðsetning miðju ferningsins
var box = vec2( 0.0, 0.0 );

// Stefna (og hraði) fernings
var dX;
var dY;

// Svæðið er frá -maxX til maxX og -maxY til maxY
var maxX = 1.0;
var maxY = 1.0;

// Hálf breidd/hæð ferningsins
var boxRad = 0.05;

// Ferningurinn er upphaflega í miðjunni
var vertices = new Float32Array([-0.05, -0.05, 0.05, -0.05, 0.05, 0.05, -0.05, 0.05]);

// buffers
var spadeBuffer;
var bufferId;

// spaði
var spade = [
    vec2(-0.9, 0.1),
    vec2(-0.9, -0.1),
    vec2(-0.8, -0.1),
    vec2(-0.8, -0.1),
    vec2(-0.8, 0.1),
    vec2(-0.9, 0.1),
];

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );
    
    // Gefa ferningnum slembistefnu í upphafi
    dX = Math.random()*0.1-0.05;
    dY = Math.random()*0.1-0.05;

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    spadeBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, spadeBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(spade), gl.DYNAMIC_DRAW );
    
    // Load the data into the GPU
    bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.DYNAMIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    locBox = gl.getUniformLocation( program, "boxPos" );

    // Meðhöndlun örvalykla
    window.addEventListener("keydown", function(e){
        switch( e.code ) {
            case "ArrowUp":	// upp ör
                dX *= 1.1;
                dY *= 1.1;
                for(let i = 0; i < spade.length; i++){
                    spade[i][1] += 0.1;
                }
                break;
            case "ArrowDown":	// niður ör
                dX /= 1.1;
                dY /= 1.1;
                for(let i = 0; i < spade.length; i++){
                    spade[i][1] -= 0.1;
                }
                break;
        }
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(spade));
    } );

    render();
}


function render() {
    gl.bindBuffer( gl.ARRAY_BUFFER, spadeBuffer);

    gl.drawArrays( gl.TRIANGLES, 0, spade.length);
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);

    // Láta ferninginn skoppa af veggjunum
    if (Math.abs(box[0] + dX) > maxX - boxRad) dX = -dX;
    if (Math.abs(box[1] + dY) > maxY - boxRad) dY = -dY;
    
    // Uppfæra staðsetningu
    box[0] += dX;
    box[1] += dY;
    
    gl.clear( gl.COLOR_BUFFER_BIT );
    
    //
    gl.uniform2fv( locBox, flatten(box) );

    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );

    
    window.requestAnimationFrame(render);
}
