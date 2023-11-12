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

const allTeemoShrooms = [];
function teemoShrooms(){
    const shroomGeometry = new THREE.SphereGeometry(0.2, 64, 32);
    const material = new THREE.MeshBasicMaterial({color: 0xffff00});
    const teemo = new THREE.Mesh( shroomGeometry, material);
    allTeemoShrooms.push(teemo);
    scene.add(teemo);
}

function collisionDetection(){
    shotArray.forEach(shots => {
        allTeemoShrooms.forEach(teemo => {
            if( shots.position.y - 0.1 <= teemo.position.y + 0.1 &&
                shots.position.y + 0.1 >= teemo.position.y - 0.1 &&
                shots.position.x - 0.1 <= teemo.position.x + 0.1 &&
                shots.position.x + 0.1 >= teemo.position.x - 0.1 ){
                scene.remove(shots)
                return true; //þarf að laga þetta
            }
        });
    });
    return false;
}

function keycodes(e) {
    switch( e.code ) {
        case "ArrowUp":	
            player.position.y += 0.4;
            break;
        case "ArrowLeft":  
            player.position.x -= 0.4;
            break;
        case "ArrowDown":	
            player.position.y -= 0.4;
            break;
        case "ArrowRight":
            player.position.x += 0.4;
            break;
        case "KeyW":	
            player.position.y += 0.4;
            break;
         case "KeyA":
            player.position.x -= 0.4;
            break;
        case "KeyS":	
            player.position.y -= 0.4;
            break;
        case "KeyD":	
            player.position.x += 0.4;
            break;
        case "Space":
            shoot();
            break
    }
}
teemoShrooms()
function animate() {
    requestAnimationFrame( animate );
    shotMovement();
    collisionDetection();
    renderer.render( scene, camera );
}
animate();


document.addEventListener("keydown", keycodes, false);