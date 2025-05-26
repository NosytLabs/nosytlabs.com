import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

class ModelViewer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.model = null;
        this.mixers = [];
        this.clock = new THREE.Clock();
        this.gridHelper = null;
        this.axesHelper = null;
        this.statusBar = document.querySelector('.status-bar');

        this.init();
    }

    init() {
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupControls();
        this.setupLights();
        this.setupHelpers();
        this.setupEventListeners();
        this.animate();
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
    }

    setupCamera() {
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        this.camera.position.set(0, 2, 5);
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.container.appendChild(this.renderer.domElement);
    }

    setupControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = true;
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(2, 2, 2);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
    }

    setupHelpers() {
        this.gridHelper = new THREE.GridHelper(10, 10);
        this.scene.add(this.gridHelper);

        this.axesHelper = new THREE.AxesHelper(5);
        this.scene.add(this.axesHelper);
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize(), false);
        
        // Setup drag and drop
        this.container.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });

        this.container.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.handleFileDrop(e.dataTransfer.files);
        });
    }

    handleFileDrop(files) {
        if (files.length > 0) {
            const file = files[0];
            if (file.name.match(/\.(glb|gltf)$/)) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const arrayBuffer = event.target.result;
                    this.loadModelFromArrayBuffer(arrayBuffer);
                };
                reader.readAsArrayBuffer(file);
                this.updateStatus(`Loading ${file.name}...`);
            } else {
                this.updateStatus('Error: Please drop a .glb or .gltf file');
            }
        }
    }

    loadModelFromArrayBuffer(arrayBuffer) {
        const loader = new GLTFLoader();
        loader.parse(arrayBuffer, '', 
            (gltf) => {
                if (this.model) {
                    this.scene.remove(this.model);
                }
                this.model = gltf.scene;
                this.scene.add(this.model);

                // Center and scale model
                const box = new THREE.Box3().setFromObject(this.model);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 5 / maxDim;
                this.model.scale.setScalar(scale);
                this.model.position.sub(center.multiplyScalar(scale));

                // Handle animations
                if (gltf.animations.length > 0) {
                    const mixer = new THREE.AnimationMixer(this.model);
                    this.mixers.push(mixer);
                    const action = mixer.clipAction(gltf.animations[0]);
                    action.play();
                }

                this.updateStatus('Model loaded successfully');
            },
            (error) => {
                console.error(error);
                this.updateStatus('Error loading model');
            }
        );
    }

    toggleWireframe() {
        if (this.model) {
            this.model.traverse((child) => {
                if (child.isMesh) {
                    child.material.wireframe = !child.material.wireframe;
                }
            });
        }
    }

    toggleGrid() {
        this.gridHelper.visible = !this.gridHelper.visible;
    }

    toggleAxes() {
        this.axesHelper.visible = !this.axesHelper.visible;
    }

    toggleProjection() {
        if (this.camera.isPerspectiveCamera) {
            const aspect = this.container.clientWidth / this.container.clientHeight;
            this.camera = new THREE.OrthographicCamera(
                -5 * aspect, 5 * aspect, 5, -5, 0.1, 1000
            );
            this.camera.position.set(0, 2, 5);
        } else {
            this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
            this.camera.position.set(0, 2, 5);
        }
        this.controls.object = this.camera;
    }

    takeScreenshot() {
        this.renderer.render(this.scene, this.camera);
        const dataURL = this.renderer.domElement.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'screenshot.png';
        link.href = dataURL;
        link.click();
    }

    onWindowResize() {
        if (this.camera.isPerspectiveCamera) {
            this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        } else {
            const aspect = this.container.clientWidth / this.container.clientHeight;
            this.camera.left = -5 * aspect;
            this.camera.right = 5 * aspect;
        }
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    updateStatus(message) {
        this.statusBar.textContent = message;
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        const delta = this.clock.getDelta();
        this.mixers.forEach(mixer => mixer.update(delta));
        
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    dispose() {
        this.renderer.dispose();
        this.controls.dispose();
    }
}

export default ModelViewer;