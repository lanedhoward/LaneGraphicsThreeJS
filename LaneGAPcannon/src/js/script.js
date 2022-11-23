import * as THREE from "three";
import { MeshBasicMaterial, PlaneGeometry, TetrahedronGeometry } from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import * as CANNON from "cannon-es";
import { Vec3 } from "cannon-es";

//setup 

var height = window.innerHeight;
var width = window.innerWidth;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 45, width / height, 0.1, 1000 );
camera.position.set(0, 50, 30);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width,height);
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;

const orbit = new OrbitControls(camera, renderer.domElement);

const ambientLight = new THREE.AmbientLight(0x333333, 0.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
scene.add(directionalLight);
directionalLight.position.set(25,50,0);
directionalLight.castShadow = true;

const axes = new THREE.AxesHelper(20);
scene.add(axes);

//variables

// physics
const world = new CANNON.World({
    gravity: new CANNON.Vec3(0,-10,0)
});

const planeGeo = new THREE.PlaneGeometry(10,10);
const planeMat = new THREE.MeshStandardMaterial({
    color: 0x999999, side:THREE.DoubleSide
});
const ground = new THREE.Mesh(planeGeo, planeMat);
scene.add(ground);
ground.receiveShadow = true;

const planePMat = new CANNON.Material();
const planeBody = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: new CANNON.Box(new CANNON.Vec3(5,5,0.1)),
    material: planePMat
});
planeBody.quaternion.setFromEuler(-Math.PI/2,0,0);
world.addBody(planeBody);


const boxGeo = new THREE.BoxGeometry(2,2,2);
const boxMat = new THREE.MeshStandardMaterial({
    color:0x993366
});
const boxMesh = new THREE.Mesh(boxGeo, boxMat);
boxMesh.castShadow = true;
scene.add(boxMesh);

const boxPMat = new CANNON.Material();
const boxBody = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(1,1,1)),
    mass: 1,
    position: new CANNON.Vec3(1, 30, 1),
    material: boxPMat
});
world.addBody(boxBody);

boxBody.angularVelocity.set(0,10,0);
boxBody.angularDamping = 0.35;

const ballGeo = new THREE.SphereGeometry(1,30,30);
const ballMat = new THREE.MeshStandardMaterial({
    color:0x113399
});
const ballMesh = new THREE.Mesh(ballGeo, ballMat);
ballMesh.castShadow = true;
scene.add(ballMesh);

const ballPMat = new CANNON.Material();
const ballBody = new CANNON.Body({
    shape: new CANNON.Sphere(0.5),
    mass: 1,
    position: new CANNON.Vec3(2, 20, 1),
    material: ballPMat
});
world.addBody(ballBody);

//mouse stuff

//animattion 

const timeStep = 1/60;

function animate(time) {
    world.step(timeStep);
    
    ground.position.copy(planeBody.position);
    ground.quaternion.copy(planeBody.quaternion);
    
    boxMesh.position.copy(boxBody.position);
    boxMesh.quaternion.copy(boxBody.quaternion);

    ballMesh.position.copy(ballBody.position);
    ballMesh.quaternion.copy(ballBody.quaternion);
    
    renderer.render( scene, camera );
}
renderer.setAnimationLoop(animate);

window.addEventListener('resize', function () {
    width = window.innerWidth;
    height = window.innerHeight;

    camera.aspect = width/height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
} );