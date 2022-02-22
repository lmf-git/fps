import * as THREE from 'three';
import { FirstPersonControls } from './controls/FirstPersonControls';

import engine from './engine';

const canvas = document.querySelector('#canvas');
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);

// Global state/access.
window.WORLD = {
    renderer: new THREE.WebGLRenderer({ canvas: canvas }),
    scene: new THREE.Scene,
    controls: new FirstPersonControls(camera, canvas),
    camera
};

// Configure and add camera.
camera.position.set(0, 0, 0);
WORLD.scene.add(WORLD.camera);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
const cube = new THREE.Mesh(geometry, material);
WORLD.scene.add(cube);

function resizer() {
    // Update camera
    WORLD.camera.aspect = window.innerWidth / window.innerHeight;
    WORLD.camera.updateProjectionMatrix();
  
    // Update renderer
    WORLD.renderer.setSize(window.innerWidth, window.innerHeight);
    WORLD.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};
window.addEventListener('resize', resizer);
resizer();

engine();