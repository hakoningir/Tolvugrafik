const canvas = document.querySelector('#c');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
camera.position.set(0, 0, 10);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const renderer = new THREE.WebGLRenderer({ canvas });

const playerGeometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x44aa88 });
const shotMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const player = new THREE.Mesh(playerGeometry, material);
player.position.y = -1 * (window.innerHeight / 2) / 100;
player.position.z = -5;
scene.add(player);

const shotArray = [];


function shoot() {
    const shotGeometry = new THREE.BoxGeometry(0.1, 0.5, 0.1);
    const shot = new THREE.Mesh(shotGeometry, shotMaterial);

    // Set initial position of the shot in the xy-plane and away from the player
    shot.position.x = player.position.x;
    shot.position.y = player.position.y + 0.2;
    shot.position.z = player.position.z + 2; // Adjust th e initial distance away from the player

    // Set the rotation of the shot to be horizontal
    shot.rotation.set(Math.PI/2, 0, 0 );

    shotArray.push(shot);
    scene.add(shot);
}


function shotMovement() {
    shotArray.forEach(shot => {
        const speed = 0.2;

        // Move the shot straight ahead in the positive z-axis direction
        shot.position.z += speed;
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
            if( shots.position.z - 0.1 <= teemo.position.z + 0.1 &&
                shots.position.z + 0.1 >= teemo.position.z - 0.1 &&
                shots.position.x - 0.1 <= teemo.position.x + 0.1 &&
                shots.position.x + 0.1 >= teemo.position.x - 0.1 ){
                scene.remove(shots)
                return true;
            }
        });
    });
    return false;
}

let centiArray = []
function centipede(){
    const centigeo = new THREE.SphereGeometry(0.2, 64, 32);
    const material = new THREE.MeshBasicMaterial({color: 0xffff});
    for(let i = 0; i < 6; i++){
        const centipede = new THREE.Mesh( centigeo, material);
        centipede.position.x -= 2.5 - i*0.4;
        centipede.position.y += -4.5; 
        centipede.position.z += 2.5; 
        centiArray.push(centipede)
        scene.add(centipede);
    }
}
centipede();

function moveCentipede(){
    centiArray.forEach(centiElement => {
        centiElement.x += 0.2;
    });
}

function keycodes(e){
    switch( e.code ) {
        case "ArrowUp":	
            player.position.z += 0.2;
            break;
        case "ArrowLeft":  
            player.position.x -= 0.2;
            break;
        case "ArrowDown":	
            player.position.z -= 0.2;
            break;
        case "ArrowRight":
            player.position.x += 0.2;
            break;
        case "KeyW":	
            player.position.z += 0.2;
            break;
         case "KeyA":
            player.position.x += 0.2;
            break;
        case "KeyS":	
            player.position.z -= 0.2;
            break;
        case "KeyD":	
            player.position.x -= 0.2;
            break;
        case "Space":
            shoot();
            break
    }
}
function animate() {
    requestAnimationFrame(animate);
    
    const distance = 5;
    const playerRotation = player.rotation.y; 
    const offsetX = Math.sin(playerRotation) * distance;
    const offsetZ = Math.cos(playerRotation) * distance;
    
    camera.position.x = player.position.x - offsetX;
    camera.position.y = player.position.y + 1;
    camera.position.z = player.position.z - offsetZ;
    
    camera.lookAt(player.position );
    moveCentipede();
    shotMovement();
    renderer.render(scene, camera);
}
animate();
teemoShrooms()

document.addEventListener("keydown", keycodes, false);