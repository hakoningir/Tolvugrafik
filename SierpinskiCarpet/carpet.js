var gl;
var colorLoc;
var offsetLoc;
var box = [];
var vertices = [];

function divide( a, b, c, d, count){
    if(count == 0) return;
    
    // count til að fara úr endurkvæmni
    count--;
    
    // Margfalda x y location með 1/3 til þess að fá vinstri hlið, leggja 1/3 af því við til að fá hægri hlið
    // Er með hnit a=topleft, b=bottomleft, c=topright, d=bottomleft
    let x = c[0]-a[0]; 
    let y = a[1]-b[1];

    // pusha miðjunni 5
    vertices.push(
        [a[0]+x/3, a[1]-y/3], 
        [b[0]+x/3, b[1]+y/3], 
        [c[0]-x/3, c[1]-y/3], 
        [d[0]-x/3, d[1]+y/3], 
        );
    // topleft 1
    divide(
        [a[0],a[1]],
        [a[0],a[1]-y/3],
        [a[0]+x/3,a[1]],
        [a[0]+x/3,a[1]-y/3], 
        count);
        
    // middleleft 4
    divide(
        [a[0], a[1]-y/3],
        [b[0], b[1]+y/3], 
        [a[0]+x/3,a[1]-y/3],
        [b[0]+x/3,b[1]+y/3], 
        count);
        
    // bottomleft 7
    divide(
        [b[0], b[1]+y/3], 
        [b[0], b[1]], 
        [b[0]+x/3, b[1]+y/3], 
        [b[0]+x/3, b[1]], 
        count);
        
    // middletop 2
    divide(
        [a[0]+x/3,a[1]], 
        [a[0]+x/3,a[1]-y/3], 
        [c[0]-x/3,c[1]], 
        [c[0]-x/3, c[1]-y/3], 
        count);
        
    // middlebottom 8
    divide(
        [b[0]+x/3,b[1]+y/3], 
        [b[0]+x/3,b[1]], 
        [d[0]-x/3,d[1]+y/3], 
        [d[0]-x/3, d[1]], 
        count);
        
    // topright 3
    divide(
        [c[0]-x/3, c[1]], 
        [c[0]-x/3, c[1]-y/3], 
        [c[0],c[1]], 
        [c[0], c[1]-y/3], 
        count);
    
    // middleright 6
    divide(
        [c[0]-x/3, [c[1]-y/3]], 
        [d[0]-x/3,d[1]+y/3], 
        [c[0], c[1]-y/3], 
        [d[0], d[1]+y/3], 
        count);
        
    // bottomright 9
    divide(
        [d[0]-x/3,d[1]+y/3], 
        [d[0]-x/3,d[1]], 
        [d[0], d[1]+y/3], 
        [d[0], d[1]], 
        count);
    }
    
    window.onload = function init()
    {
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the Sierpinski Carpet
    //
    //  Create a red rectangle that will later be painted over with white rectangles

    box = [
        vec2( -1,  1 ),
        vec2( -1, -1 ),
        vec2(  1, -1 ),
        vec2(  1,  1 ),
    ];
    divide(box[0], box[1], box[3], box[2], 4);


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

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    colorLoc = gl.getUniformLocation( program, "colors" );
    offsetLoc = gl.getUniformLocation( program, "offset");
    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.uniform2fv(offsetLoc, box);
    console.log(box);
    gl.uniform4fv( colorLoc, vec4(1, 0, 0, 1));
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
    console.log(vertices);
    for(let i = 4; i < vertices.length; i+=4){
        gl.uniform4fv( colorLoc, vec4(0, 0, 0, 1));
        gl.uniform2fv( offsetLoc, vertices[i]);
        gl.drawArrays(gl.TRIANGLE_FAN, i, 4);
    }
}