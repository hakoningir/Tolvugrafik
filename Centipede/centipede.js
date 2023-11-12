const canvas = document.querySelector("#c");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  canvas.clientWidth / canvas.clientHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 10);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const renderer = new THREE.WebGLRenderer({ canvas });

const playerGeometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x44aa88 });
const shotMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const player = new THREE.Mesh(playerGeometry, material);
player.position.y = -5;
player.position.z = -5;
scene.add(player);

const shotArray = [];
const mushroomArray = [];

function createMushroom(x, z) {
    const mushroomGeometry = new THREE.SphereGeometry(0.3, 32, 16);
    const mushroomMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
    });
    const mushroom = new THREE.Mesh(mushroomGeometry, mushroomMaterial);
  
    mushroom.position.x = x;
    mushroom.position.y = -4.8;
    mushroom.position.z = z;
  
    scene.add(mushroom);
    mushroomArray.push(mushroom);
}
  
function initMushrooms() {
    for (let i = 0; i < 14; i++) {
        const randX = Math.random() * 10 - 5;
        const randZ = Math.random() * 10 - 5;
        createMushroom(randX, randZ);
    }
}
initMushrooms();  

function shoot() {
    const shotGeometry = new THREE.BoxGeometry(0.1, 0.5, 0.1);
    const shot = new THREE.Mesh(shotGeometry, shotMaterial);
  
    shot.position.x = player.position.x;
    shot.position.y = player.position.y + 0.2;
    shot.position.z = player.position.z + 2;
  
    shot.rotation.set(Math.PI / 2, 0, 0);
  
    scene.add(shot);
    shotArray.push(shot);
}
  
function shotMovement() {
    const speed = 0.2;
  
    shotArray.forEach((shot) => {
      shot.position.z += speed;
    });
}

function collisionDetection() {
    shotArray.forEach((shot) => {
        mushroomArray.forEach((mushroom) => {
            const shotRadius = 0.1;
            const mushroomRadius = 0.3;
  
            const dx = shot.position.x - mushroom.position.x;
            const dz = shot.position.z - mushroom.position.z;
            const distanceSquared = dx * dx + dz * dz;
  
            if (distanceSquared < (shotRadius + mushroomRadius) ** 2) {
                scene.remove(shot);
                scene.remove(mushroom);
  
                const shotIndex = shotArray.indexOf(shot);
                const mushroomIndex = mushroomArray.indexOf(mushroom);
                
                if (shotIndex !== -1) shotArray.splice(shotIndex, 1);
                if (mushroomIndex !== -1) mushroomArray.splice(mushroomIndex, 1);
  
                respawnMushroom();
            }
        });
    });
}

function respawnMushroom() {
    const randX = Math.random() * 10 - 5;
    const randZ = Math.random() * 10 - 5;
  
    createMushroom(randX, randZ);
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

function moveCentipede() {
    let dir = 1;
    centiArray.forEach(centiElement => {
        const speed = 0.05;
        centiElement.position.x += speed * dir;

        if (centiElement.position.x >= 8 ) {
            centiElement.position.x -= 0.05;
            dir *= -1;
        }
        if(centiElement.position.x <= -8){
            centiElement.position.x += 0.05;
            dir *= -1;
        }
    });
}

function keycodes(e){
    switch( e.code ) {
        case "ArrowUp":	
            player.position.z += 0.2;
            break;
        case "ArrowLeft":  
            player.position.x += 0.2;
            break;
        case "ArrowDown":	
            player.position.z -= 0.2;
            break;
        case "ArrowRight":
            player.position.x -= 0.2;
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
    collisionDetection();
    shotMovement();
    renderer.render(scene, camera);
}

document.addEventListener("keydown", keycodes, false);
animate();