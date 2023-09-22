var canvas;
var gl;

// teikna manually inn kassann, sorry Hjálmtýr hitt skemmdi lógíkina mína
var box = [
    vec2(-0.05, 0.05),
    vec2(-0.05, -0.05),
    vec2(0.05, -0.05),
    vec2(0.05, 0.05),
]
// Stefna (og hraði) fernings
var dX;
var dY;

// Svæðið er frá -maxX til maxX og -maxY til maxY
var maxX = 1.0;
var maxY = 1.0;

// buffers and such
var spadeBuffer;
var ballBuffer;
var vPosition;

// global uniform
var locColor;

// spaði til að lemja bolta með
var spade = [
    vec2(-0.2, -0.9),
    vec2(0.2, -0.9),
    vec2(0.2, -0.8),
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
    
    var speed = 0.02;

    const randomAngle = Math.random() * 2 * Math.PI;

    // Gefa ferningnum slembistefnu í upphafi
    dX = Math.cos(randomAngle) * speed;
    dY = Math.sin(randomAngle) * speed;

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU
    ballBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, ballBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(box), gl.DYNAMIC_DRAW );
    
    spadeBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, spadeBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(spade), gl.DYNAMIC_DRAW );
    
    // Associate out shader variables with our data buffer
    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.enableVertexAttribArray( vPosition );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );

    //uniform breytur
    locColor = gl.getUniformLocation( program, "fColor");

    // Meðhöndlun örvalykla
    window.addEventListener("keydown", function(e){
        if(e.code == "ArrowRight" && spade[0][0] < 1) {
            for(let i = 0; i < spade.length; i++){
                spade[i][0] += 0.1;
            } 
        }
        if(e.code == "ArrowLeft" && spade[5][0] > -1){
            for(let i = 0; i < spade.length; i++){
                spade[i][0] -= 0.1;
            }
        }
        gl.bindBuffer( gl.ARRAY_BUFFER, spadeBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(spade));
    } );

    render();
}
/*
var spade = [
    vec2(-0.2, -0.9),
    vec2(0.2, -0.9),
    vec2(0.2, -0.8),
    vec2(0.2, -0.8),
    vec2(-0.2, -0.8),
    vec2(-0.2, -0.9),
];
var box = [
     vec2(-0.05, 0.05),
     vec2(-0.05, -0.05),
     vec2(0.05, -0.05),
     vec2(0.05, 0.05),
 ]
*/
function moveBall(){
    var spadeMidX = spade[0][0] + 0.2;
    var spadeMidY = spade[0][1] + 0.05;
    if(box[3][0]  >= maxX || box[1][0] <= -maxX)dX = -dX;
    if(box[3][1]  >= maxY || box[1][1] <= -maxY)dY = -dY;
    if(
        box[0][0] <= spadeMidX + 0.2 && 
        box[3][0] >= spadeMidX - 0.2 && 
        box[1][1] <= spadeMidY +0.05 && 
        box[3][1] >= spadeMidY -0.05) dY = -dY;
    for(let i = 0; i < box.length; i++){
        box[i][0] += dX;
        box[i][1] += dY;
    }
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(box));
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.bindBuffer( gl.ARRAY_BUFFER, spadeBuffer);
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.uniform4fv(locColor, vec4(0,1,0,1));
    gl.drawArrays( gl.TRIANGLES, 0, 6);


    gl.bindBuffer(gl.ARRAY_BUFFER, ballBuffer);
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    moveBall();
    gl.uniform4fv(locColor, vec4(1,0,0,1));
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );

    
    window.requestAnimationFrame(render);
}
