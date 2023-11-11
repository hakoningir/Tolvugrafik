// Ná í striga
const canvas = document.querySelector('#c');

// Skilgreina sviðsnet
const scene = new THREE.Scene();
            
// Skilgreina myndavél og staðsetja hana
const camera = new THREE.PerspectiveCamera( 75, canvas.clientWidth/canvas.clientHeight, 0.1, 1000 );
camera.position.z = 4;

// Skilgreina birtingaraðferð
const renderer = new THREE.WebGLRenderer({canvas});

// Búa til tening með grunnáferð (basic material) og bæta í sviðsnetið
const playerGeometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial( { color: 0x44aa88 } );
const player = new THREE.Mesh( playerGeometry, material );
player.position.y = -1 * (window.innerHeight / 2) / 100;
player.position.z = -5;
scene.add( player );

const shotArray = []
function shoot(){
    const shotGeometry = new THREE.BoxGeometry(0.1, 0.5, 0.1)
    const shot = new THREE.Mesh( shotGeometry,material);
    const currentPosX = player.position.x/2;
    const currentPosY = (player.position.y/2)+0.2;
    shot.position.x = currentPosX;
    shot.position.y = currentPosY;
    shotArray.push(shot)
    scene.add(shot);
}

function shotMovement(){
    shotArray.forEach(shot => {
        shot.position.y +=  0.05
    });
}

function keycodes(e) {
    switch( e.code ) {
        case "ArrowUp":	
            player.position.y += 0.5;
            break;
        case "ArrowLeft":  
            player.position.x -= 0.5;
            break;
        case "ArrowDown":	
            player.position.y -= 0.5;
            break;
        case "ArrowRight":
            player.position.x += 0.5;
            break;
        case "KeyW":	
            player.position.y += 0.5;
            break;
         case "KeyA":
            player.position.x -= 0.5;
            break;
        case "KeyS":	
            player.position.y -= 0.5;
            break;
        case "KeyD":	
            player.position.x += 0.5;
            break;
        case "Space":
            shoot();
            break
    }
}

function animate() {
	requestAnimationFrame( animate );
    shotMovement();
	renderer.render( scene, camera );
}
animate();


document.addEventListener("keydown", keycodes, false);