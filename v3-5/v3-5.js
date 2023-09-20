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
var ballBuffer;
var vPosition;
// global uniform
var locColor;
// spaði
var spade = [
    vec2(0.2, -0.9),
    vec2(0.2, -0.8),
    vec2(-0.2, -0.9),
    vec2(0.2, -0.8),
    vec2(-0.2, -0.8),
    vec2(-0.2, -0.9),
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
    
    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    spadeBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, spadeBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(spade), gl.DYNAMIC_DRAW );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    
    // Load the data into the GPU
    ballBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, ballBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.DYNAMIC_DRAW );

    // Associate out shader variables with our data buffer

    locBox = gl.getUniformLocation( program, "boxPos" );
    locColor = gl.getUniformLocation( program, "fColor");

    // Meðhöndlun örvalykla
    window.addEventListener("keydown", function(e){
        if(e.code == "ArrowRight") {
            dX *= 1.1;
            dY *= 1.1;
            if(spade[1][0] < -1){
                for(let i = 0; i < spade.length; i++){
                    spade[i][0] += 0.1;
                }
            }
        }
        if(e.code == "ArrowLeft"){
            dX /= 1.1;
            dY /= 1.1;
            if(spade[5][0] > -1){
                for(let i = 0; i < spade.length; i++){
                    spade[i][0] -= 0.1;
                }
            }
        }
        gl.bindBuffer( gl.ARRAY_BUFFER, spadeBuffer);
        gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(spade));
    } );

    render();
}


function render() {
    
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.bindBuffer( gl.ARRAY_BUFFER, spadeBuffer);
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.uniform4fv(locColor, vec4(0,1,0,1));
    gl.drawArrays( gl.TRIANGLES, 3, 6);
    

    // Láta ferninginn skoppa af veggjunum
    if (Math.abs(box[0] + dX) > maxX - boxRad) dX = -dX;
    if (Math.abs(box[1] + dY) > maxY - boxRad) dY = -dY;
    
    // Uppfæra staðsetningu
    box[0] += dX;
    box[1] += dY;
    
    gl.bindBuffer(gl.ARRAY_BUFFER, ballBuffer);
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    
    //
    gl.uniform2fv( locBox, flatten(box) );
    gl.uniform4fv(locColor, vec4(1,0,0,1));
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );

    
    window.requestAnimationFrame(render);
}
