var canvas;
var gl;

var NumVertices  = 9;
var NumBody = 6;
var NumTail = 3;
var NumFish = 300;
var fishColor = [];
let mv;

var moveFishX = [];
var moveFishY = [];
var moveFishZ = [];

var vertices = [
    vec4( -0.5,  0.0, 0.0, 1.0 ),
	vec4(  0.2,  0.2, 0.0, 1.0 ),
	vec4(  0.5,  0.0, 0.0, 1.0 ),
	vec4(  0.5,  0.0, 0.0, 1.0 ),
	vec4(  0.2, -0.15, 0.0, 1.0 ),
	vec4( -0.5,  0.0, 0.0, 1.0 ),
    vec4( -0.5,  0.0, 0.0, 1.0 ),
    vec4( -0.65,  0.15, 0.0, 1.0 ),
    vec4( -0.65, -0.15, 0.0, 1.0 ),
];


var movement = false;     // Er músarhnappur niðri?
var spinX = 0;
var spinY = 0;
var origX;
var origY;

var rotTail = [];        // Snúningshorn sporðs
var incTail = [];        // Breyting á snúningshorni

var zView = 2.0;          // Staðsetning áhorfanda á z-hniti

var proLoc;
var mvLoc;
var colorLoc;

var vPosition;

var boxSize = 10;
var boxVertices = [
    vec4(-10, 10, -10, 1.0),
    vec4(-10, -10, -10, 1.0),
    vec4(10, -10, -10, 1.0),
    vec4(10, 10, -10, 1.0),
    vec4(-10, 10, -10, 1.0),
    vec4(-10, 10, 10, 1.0),
    vec4(-10, -10, 10, 1.0),
    vec4(10, -10, 10, 1.0),
    vec4(10, 10, 10, 1.0),
    vec4(-10, 10, 10, 1.0),
    vec4(-10, -10, 10, 1.0),
    vec4(-10, -10, -10, 1.0),
    vec4(10, -10, -10, 1.0),
    vec4(10, -10, 10, 1.0),
    vec4(10, 10, 10, 1.0),
    vec4(10, 10, -10, 1.0),
];

// buffers
var fishBuffer;
var boxBuffer;

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.95, 1.0, 1.0, 1.0 );
 
    gl.enable(gl.DEPTH_TEST);
 
    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    boxBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, boxBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(boxVertices), gl.STATIC_DRAW );

    fishBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, fishBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    colorLoc = gl.getUniformLocation( program, "fColor" );

    proLoc = gl.getUniformLocation( program, "projection" );
    mvLoc = gl.getUniformLocation( program, "modelview" );

    // Setjum ofanvarpsfylki hér í upphafi
    var proj = perspective( 90.0, 1.0, 0.1, 100.0 );
    gl.uniformMatrix4fv(proLoc, false, flatten(proj));

    // Atburðaföll fyrir mús
    canvas.addEventListener("mousedown", function(e){
        movement = true;
        origX = e.offsetX;
        origY = e.offsetY;
        e.preventDefault();         // Disable drag and drop
    });

    canvas.addEventListener("mouseup", function(e){
        movement = false;
    });

    canvas.addEventListener("mousemove", function(e){
        if(movement) {
    	    spinY += (e.offsetX - origX) % 360;
            spinX += (e.offsetY - origY) % 360;
            origX = e.offsetX;
            origY = e.offsetY;
        }
    });

    window.addEventListener("keydown", function(e){
        if( e.code == "ArrowUp" ) {
             zView -= 0.2;
        } 
        if(e.code == "ArrowDown") {
             zView += 0.2;
        }
    });

    generateCoords();
    getFishColor();
    render();
}

function insideBox(fishCoord){
    if(fishCoord > boxSize){
        return -boxSize + 0.1;
    }
    if(fishCoord < boxSize){
        return boxSize + 0.1;
    }
    return fishCoord;
}

function generateCoords(){
    for(let i = 0; i < NumFish; i++){
        var randX = (Math.random()*20)-10;
        var randY = (Math.random()*20)-10;
        var randZ = (Math.random()*20)-10;
        moveFishX += [
                  randX,
              0.7+randX,
              1.0+randX,
              1.0+randX,
              0.7+randX,
              1.0+randX,
                  randX,
            -0.15+randX,
            -0.15+randX,
        ];
        moveFishY += [
                  randY,
              0.2+randY,
                  randY,
                  randY,
             -0.1+randY,
                  randY,
                  randY,
             0.15+randY,
            -0.15+randY,
        ];
        moveFishZ += [
                  randZ,
                  randZ,
                  randZ,
                  randZ,
                  randZ,
                  randZ,
                  randZ,
                  randZ,
                  randZ,
        ];
    }
}
function getFishColor(){
    for(let i = 0; i < NumFish; i++){
        let r = Math.random();
        let g = Math.random();
        let b = Math.random();
        fishColor[i] = vec4(r,g,b,1);
    }
    return fishColor;
}

function makeAndMoveFish(mv, i){
    gl.uniform4fv(colorLoc, fishColor[i]);
    gl.bindBuffer(gl.ARRAY_BUFFER, fishBuffer);
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0);
    
    if(boxSize + 0.2 < Math.abs(moveFishX[i])){
        moveFishX[i] = insideBox(moveFishX[i]);
    }
    if(boxSize + 0.2 < Math.abs(moveFishY[i])){
        moveFishY[i] = insideBox(moveFishY[i])
    }
    if(boxSize + 0.2 < Math.abs(moveFishZ[i])){
        moveFishZ[i] = insideBox(moveFishZ[i])
    }
  
    moveFishX[i] += 0.01;
    moveFishY[i] += 0.01;
    moveFishZ[i] += 0.01;
  
    mv = mult(mv, translate(moveFishX[i], moveFishY[i], moveFishZ[i]));

    gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays( gl.TRIANGLES, 0, NumBody );
     
    rotTail[i] += incTail[i];
    if( rotTail[i] > 35.0  || rotTail[i] < -35.0 )
        incTail[i] *= -1;
    mv = mult( mv, translate ( -0.5, 0.0, 0.0 ) );
    mv = mult( mv, rotateY( rotTail[i] ) );
    mv = mult( mv, translate ( 0.5, 0.0, 0.0 ) );

    gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays( gl.TRIANGLES, NumBody, NumTail );    
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    mv = lookAt( 
        vec3(0.0, 0.0, zView), 
        vec3(0.0, 0.0, 0.0), 
        vec3(0.0, 1.0, 0.0)
    );
    
    mv = mult( mv, rotateX(spinX) );
    mv = mult( mv, rotateY(spinY) );

    gl.bindBuffer(gl.ARRAY_BUFFER, boxBuffer);
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.uniform4fv( colorLoc, vec4(0,0,0,1));
    gl.uniformMatrix4fv(mvLoc, false, flatten(mv))
    gl.drawArrays( gl.LINE_STRIP, 0, boxVertices.length );

    for(let i = 0; i < NumFish; i++){
        makeAndMoveFish(mv,i);
    }
    requestAnimationFrame( render );
}
