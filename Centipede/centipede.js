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

function collisionDetection(){
    shotArray.forEach(shots => {
        allTeemoShrooms.forEach(teemo => {
            if( shots.position.y - 0.1 <= teemo.position.y + 0.1 &&
                shots.position.y + 0.1 >= teemo.position.y - 0.1 &&
                shots.position.x - 0.1 <= teemo.position.x + 0.1 &&
                shots.position.x + 0.1 >= teemo.position.x - 0.1 ){
                scene.remove(shots)
                return true;
            }
        });
    });
}

function centipedeHead(){
    const centigeo = new THREE.SphereGeometry(0.2, 64, 32);
    const material = new THREE.MeshBasicMaterial({color: 0xffff});
    const centihead = new THREE.Mesh( centigeo, material);
    centihead.position.x -= 2.5
    centihead.position.y += 2.5 
    scene.add(centihead);
}
centipedeHead();

function centipedeBody(){
    const centigeo = new THREE.SphereGeometry(0.2, 64, 32);
    const material = new THREE.MeshBasicMaterial({color: 0xffff});
    for(let i = 0; i < 5; i++){
        const centibody = new THREE.Mesh( centigeo, material);
        centibody.position.x -= 2.5 - i*0.4;
        centibody.position.y += 2.5; 
        scene.add(centibody);
    }
}
centipedeBody();

function keycodes(e){
    switch( e.code ) {
        case "ArrowUp":	
            player.position.y += 0.2;
            break;
        case "ArrowLeft":  
            player.position.x += 0.2;
            break;
        case "ArrowDown":	
            player.position.y -= 0.2;
            break;
        case "ArrowRight":
            player.position.x -= 0.2;
            break;
        case "Space":
            shoot();
            break
    }
}


function animate() {
    requestAnimationFrame(animate);

    // Update camera position based on player's position
    const distance = 5;
    const playerRotation = player.rotation.y; // Assuming player's rotation controls the direction
    const offsetX = Math.sin(playerRotation) * distance;
    const offsetZ = Math.cos(playerRotation) * distance;

    camera.position.x = player.position.x - offsetX;
    camera.position.y = player.position.y + 1; // Adjust the height of the camera
    camera.position.z = player.position.z - offsetZ;

    // Look at the player
    camera.lookAt(player.position);

    shotMovement();
    renderer.render(scene, camera);
}

animate();

document.addEventListener("keydown", keycodes, false);