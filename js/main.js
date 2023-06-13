import * as THREE from "three";
import { Game } from "./game";
window.onload = () => {
  //  Create a scene
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGL1Renderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  //    Initialize a game scene
  const gameInstance = new Game(scene, camera);

  //  Animate and render the scene
  function animate() {
    requestAnimationFrame(animate);
    gameInstance.update();
    renderer.render(scene, camera);
  }
  animate();
};
