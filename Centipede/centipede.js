// Ná í striga
const canvas = document.querySelector('#c');

// Skilgreina sviðsnet
const scene = new THREE.Scene();
            
// Skilgreina myndavél og staðsetja hana
const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
camera.position.set(0, 0, 10); // Adjust the distance as needed

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Adjust intensity as needed
scene.add(ambientLight);

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
function shoot() {
    const shotGeometry = new THREE.BoxGeometry(0.1, 0.5, 0.1);
    const shot = new THREE.Mesh(shotGeometry, material);

    // Set initial position of the shot in the xy-plane
    shot.position.x = player.position.x;
    shot.position.y = player.position.y + 0.2;
    shot.position.z = player.position.z;

    shotArray.push(shot);
    scene.add(shot);
}

function shotMovement() {
    shotArray.forEach(shot => {
        const speed = 0.1; // Adjust this value for the shot's speed
        const playerRotation = player.rotation.y;

        // Move the shot in the xy-plane based on the player's rotation
        shot.position.x -= Math.sin(playerRotation) * speed;
        shot.position.y += Math.cos(playerRotation) * speed;

        // You can adjust the z-axis movement if needed
        shot.position.z += 0.05;
    });
}

function keycodes(e) {
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