import * as THREE from "three";
import { MeshBasicMaterial, PlaneGeometry } from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import * as CANNON from "cannon-es";


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

const world = new CANNON.World({
    gravity: new CANNON.Vec3(0,-1,0)
});

const planeGeo = new THREE.PlaneGeometry(30,30);
const planeMat = new THREE.MeshBasicMaterial({color: 0x333333, side:THREE.DoubleSide});
const plane = new THREE.Mesh(planeGeo, planeMat);
scene.add(plane);



const groundBody = new CANNON.Body({
    shape:new CANNON.Plane(),
    type:CANNON.Body.STATIC
});
world.addBody(groundBody);
groundBody.quaternion.setFromEuler(Math.PI/2,0,0);

const boxGeo = new THREE.BoxGeometry(2,2);
const boxMat = new THREE.MeshBasicMaterial({color:0xFFFFFF});
const box = new THREE.Mesh(boxGeo,boxMat);
scene.add(box);

const boxBody = new CANNON.Body({
    shape:new CANNON.Box(new CANNON.Vec3(1,1,1)),
    mass:0.5,
    position:new CANNON.Vec3(1,30,0),
    type:CANNON.Body.DYNAMIC
});
world.addBody(boxBody);

const timeStep = 1/60;

function animate(time) {
    world.step(timeStep);
    plane.position.copy(groundBody.position);
    plane.quaternion.copy(groundBody.quaternion);

    box.position.copy(boxBody.position);
    box.quaternion.copy(boxBody.quaternion);
    

    renderer.render( scene, camera );
}
renderer.setAnimationLoop(animate);

