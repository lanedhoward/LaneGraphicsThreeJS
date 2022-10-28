import * as THREE from "three";
import { PlaneGeometry } from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";


var height = window.innerHeight;
var width = window.innerWidth;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 45, width / height, 0.1, 1000 );
camera.position.set(-10, 30, 30);


const renderer = new THREE.WebGLRenderer();
renderer.setSize(width,height);
document.body.appendChild(renderer.domElement);

renderer.shadowMap.enabled = false;

const orbit = new OrbitControls(camera, renderer.domElement);

const uniforms = {
    u_time: {type:"f", value:0.0},
    u_res: {type:"v2", value:new THREE.Vector2(width,height)}
}

const ringGeo = new THREE.TorusGeometry(3,1,40,40);
///const ringMat = new THREE.MeshBasicMaterial({color:0xFF0000});
const ringMat = new THREE.ShaderMaterial({
    vertexShader: document.getElementById("vertexShader").textContent,
    fragmentShader: document.getElementById("fragmentShader").textContent,
    wireframe: true,
    uniforms
});
const ring = new THREE.Mesh(ringGeo, ringMat);
scene.add(ring);
ring.position.set(0,0,0);

const knotGeo = new THREE.TorusKnotGeometry(10, 1, 100, 40);
const knotMat = new THREE.ShaderMaterial({
    vertexShader: document.getElementById("vertexShader2").textContent,
    fragmentShader: document.getElementById("fragmentShader2").textContent,
    wireframe: false,
    uniforms
});
const knot = new THREE.Mesh(knotGeo, knotMat);
scene.add(knot);
knot.position.set(0,0,0);


const clock = new THREE.Clock();

function animate(time) {
    uniforms.u_time.value = clock.getElapsedTime();
    /*
    knot.rotation.x += 0.001;
    knot.rotation.y += 0.001;

    ring.rotation.x -= 0.002;
    ring.rotation.y -= 0.002;
    */
    renderer.render( scene, camera );
}
renderer.setAnimationLoop(animate);

