import * as THREE from "three";

export class Game {
  constructor(scene, camera) {
    //  Initialize variables
    //  Prepare 3D scene
    this._initializeScene(scene, camera);

    //  Bind event callbacks
    document.addEventListener("keydown", this._keydown.bind(this));
    document.addEventListener("keyup    ", this._keyup.bind(this));
  }

  update() {
    //  Recompute the game state
    this._updateGrid();
    this._checkCollisions();
    this._updateInfoPanel();
  }

  _keydown(event) {
    //  check for the key to move the ship accordingly
  }

  _keyup(event) {
    //  reset to "idle" mode
  }

  //    The Grid will move continuously and not the ship
  _updateGrid() {}

  //    Increase or decrease points depending on the collisions
  _checkCollisions() {
    //  obstacles
    //  bonuses
  }

  //    Update the score, distance data on the info panel.
  _updateInfoPanel() {}

  _gameOver() {
    //  prepare end state
    //  (show ui)
    //  (reset variables)
  }

  _createShip(scene) {
    //  prepare 3D scene
    const geometry = new THREE.TetrahedronBufferGeometry(0.4);
    const material = new THREE.MeshBasicMaterial({ color: 0xbbccdd });
    const shipBody = new THREE.Mesh(geometry, material);

    shipBody.rotateX((45 * Math.PI) / 180);
    shipBody.rotateY((45 * Math.PI) / 180);

    this.ship = new THREE.Group();
    this.ship.add(shipBody);

    scene.add(this.ship);

    //  Reactor Geometry
    const reactorSocketGeometry = new THREE.CylinderBufferGeometry(
      0.08,
      0.08,
      0.1,
      16
    );
    const reactorSocketMaterial = new THREE.MeshBasicMaterial({
      color: 0x99aacc,
    });

    const reactorSocket1 = new THREE.Mesh(
      reactorSocketGeometry,
      reactorSocketMaterial
    );
    const reactorSocket2 = new THREE.Mesh(
      reactorSocketGeometry,
      reactorSocketMaterial
    );
    const reactorSocket3 = new THREE.Mesh(
      reactorSocketGeometry,
      reactorSocketMaterial
    );
    this.ship.add(reactorSocket1);
    this.ship.add(reactorSocket2);
    this.ship.add(reactorSocket3);

    reactorSocket1.rotateX((90 * Math.PI) / 180);
    reactorSocket1.position.set(-0.15, 0, 0.1);
    reactorSocket2.rotateX((90 * Math.PI) / 180);
    reactorSocket2.position.set(0.15, 0, 0.1);
    reactorSocket3.rotateX((90 * Math.PI) / 180);
    reactorSocket3.position.set(0, -0.15, 0.1);

    //    Reactor Light Geometry
    const reactorLightGeometry = new THREE.CylinderBufferGeometry(
      0.055,
      0.055,
      0.1,
      16
    );
    const reactorLightMaterial = new THREE.MeshBasicMaterial({
      color: 0xaadeff,
    });

    const reactorLight1 = new THREE.Mesh(
      reactorLightGeometry,
      reactorLightMaterial
    );
    const reactorLight2 = new THREE.Mesh(
      reactorLightGeometry,
      reactorLightMaterial
    );
    const reactorLight3 = new THREE.Mesh(
      reactorLightGeometry,
      reactorLightMaterial
    );
    this.ship.add(reactorLight1);
    this.ship.add(reactorLight2);
    this.ship.add(reactorLight3);

    reactorLight1.rotateX((90 * Math.PI) / 180);
    reactorLight1.position.set(-0.15, 0, 0.11);
    reactorLight2.rotateX((90 * Math.PI) / 180);
    reactorLight2.position.set(0.15, 0, 0.11);
    reactorLight3.rotateX((90 * Math.PI) / 180);
    reactorLight3.position.set(0, -0.15, 0.11);
  }

  _createGrid(scene) {
    this.speedZ = 5;

    let divisions = 30;
    let gridLimit = 200;
    this.grid = new THREE.GridHelper(
      gridLimit * 2,
      divisions,
      0xccddee,
      0xccddee
    );

    const moveableZ = [];
    for (let i = 0; i <= divisions; i++) {
      moveableZ.push(1, 1, 0, 0); // move horizontal lines only (1 - point is moveable)
    }
    this.grid.geometry.setAttribute(
      "moveableZ",
      new THREE.BufferAttribute(new Uint8Array(moveableZ), 1)
    );

    this.grid.material = new THREE.ShaderMaterial({
      uniforms: {
        speedZ: {
          value: this.speedZ,
        },
        gridLimits: {
          value: new THREE.Vector2(-gridLimit, gridLimit),
        },
        time: {
          value: 0,
        },
      },
      vertexShader: `
        uniform float time;
        uniform vec2 gridLimits;
        uniform float speedZ;
        
        attribute float moveableZ;
        
        varying vec3 vColor;
      
        void main() {
          vColor = color;
          float limLen = gridLimits.y - gridLimits.x;
          vec3 pos = position;
          if (floor(moveableZ + 0.5) > 0.5) { // if a point has "moveableZ" attribute = 1 
            float zDist = speedZ * time;
            float curZPos = mod((pos.z + zDist) - gridLimits.x, limLen) + gridLimits.x;
            pos.z = curZPos;
          }
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
      
        void main() {
          gl_FragColor = vec4(vColor, 1.); // r, g, b channels + alpha (transparency)
        }
      `,
      vertexColors: THREE.VertexColors,
    });

    scene.add(this.grid);
  }

  _initializeScene(scene, camera) {
    this._createShip(scene);
    this._createGrid(scene);
    camera.rotateX((-20 * Math.PI) / 180);
    camera.position.set(0, 1.5, 2);
  }
}
