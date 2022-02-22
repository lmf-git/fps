import * as THREE from 'three';

let time = 0;
export default function engine() {
    const delta = 0.01;
    time = time + delta;


    WORLD.controls.update(delta);
    WORLD.renderer.render(WORLD.scene, WORLD.camera);
    window.requestAnimationFrame(engine);
}