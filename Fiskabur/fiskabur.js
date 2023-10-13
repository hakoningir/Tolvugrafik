var canvas;
var gl;

var NumVertices  = 9;
var NumBody = 6;
var NumTail = 3;

let mv;

// Hnútar fisks á xy-planinu
var vertices = [
    // líkami (spjald)
    vec4( -0.5,  0.0, 0.0, 1.0 ),
	vec4(  0.2,  0.2, 0.0, 1.0 ),
	vec4(  0.5,  0.0, 0.0, 1.0 ),
	vec4(  0.5,  0.0, 0.0, 1.0 ),
	vec4(  0.2, -0.15, 0.0, 1.0 ),
	vec4( -0.5,  0.0, 0.0, 1.0 ),
	// sporður (þríhyrningur)
    vec4( -0.5,  0.0, 0.0, 1.0 ),
    vec4( -0.65,  0.15, 0.0, 1.0 ),
    vec4( -0.65, -0.15, 0.0, 1.0 )
];


var movement = false;     // Er músarhnappur niðri?
var spinX = 0;
var spinY = 0;
var origX;
var origY;

var rotTail = 0.0;        // Snúningshorn sporðs
var incTail = 2.0;        // Breyting á snúningshorni

var zView = 2.0;          // Staðsetning áhorfanda á z-hniti

var proLoc;
var mvLoc;
var colorLoc;

var vPosition;

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
    makeFish();
    console.log(vertices)

    render();
}

function makeFish(){
    gl.bindBuffer(gl.ARRAY_BUFFER, fishBuffer);
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    for(let i = 0; i < 100; i++){
        var randX = 1-(Math.random()*2);
        var randY = 1-(Math.random()*2);
        var randZ = 1-(Math.random()*2);
        vertices += [
            vec4(       randX,      randY, randZ, 1.0 ),
            vec4(   0.7+randX,  0.2+randY, randZ, 1.0 ),
            vec4(   1.0+randX,      randY, randZ, 1.0 ),
            vec4(   1.0+randX,      randY, randZ, 1.0 ),
            vec4(   0.7+randX, -0.1+randY, randZ, 1.0 ),
            vec4(   1.0+randX,      randY, randZ, 1.0 ),
            vec4(       randX,      randY, randZ, 1.0 ),
            vec4( -0.15+randX, 0.15+randY, randZ, 1.0 ),
            vec4( -0.15+randX,-0.15+randY, randZ, 1.0 )
        ];
    }
    flatten(vertices)
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

    gl.bindBuffer(gl.ARRAY_BUFFER, fishBuffer);
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );

    rotTail += incTail;
    if( rotTail > 35.0  || rotTail < -35.0 )
        incTail *= -1;

	gl.uniform4fv( colorLoc, vec4(0.2, 0.6, 0.9, 1.0));
	// Teikna líkama fisks (án snúnings)
    gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    for(let i = 0; i < 100; i++){
        gl.drawArrays( gl.TRIANGLES, 0, NumBody );    
    }
    
    // Teikna sporð og snúa honum

    mv = mult( mv, translate ( -0.5, 0.0, 0.0 ) );
    mv = mult( mv, rotateY( rotTail ) );
    mv = mult( mv, translate ( 0.5, 0.0, 0.0 ) );
    gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    for(let i = 0; i < 100; i++){
        gl.drawArrays( gl.TRIANGLES, NumBody, NumTail );
    }
    requestAnimationFrame( render );
}
