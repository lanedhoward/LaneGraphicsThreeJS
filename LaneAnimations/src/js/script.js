import * as THREE from "three";
import { BoxGeometry, MeshBasicMaterial, PlaneGeometry, TetrahedronGeometry } from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import * as CANNON from "cannon-es";
import { Vec3 } from "cannon-es";
import gsap from "gsap";

//setup 

var height = window.innerHeight;
var width = window.innerWidth;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 45, width / height, 0.1, 1000 );
camera.position.set(5, 5, -5);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width,height);
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;

const orbit = new OrbitControls(camera, renderer.domElement);

const axes = new THREE.AxesHelper(20);
scene.add(axes);


//variables
const mousePos = new THREE.Vector2();
const intersectPt = new THREE.Vector3();
const planeNormal = new THREE.Vector3();
const plane = new THREE.Plane();
const raycaster = new THREE.Raycaster();
let intersects;
const objects = [];

const groundGeo = new THREE.PlaneGeometry(20,20);
const groundMat = new THREE.MeshBasicMaterial({color:0x111111, side:THREE.DoubleSide});
const ground = new THREE.Mesh(groundGeo,groundMat);
ground.rotateX(Math.PI /2);
scene.add(ground);
ground.visible = false;
ground.name = "ground";

const grid = new THREE.GridHelper(20,20);
scene.add(grid);

const box = new THREE.Mesh(
    new BoxGeometry(1,1),
    new THREE.MeshBasicMaterial({color:0xFF3377})
);
box.position.set(0,0.5,0);
scene.add(box);

//mouse stuff

window.addEventListener('mousemove', function(e){

    mousePos.x = (e.clientX / width) * 2 - 1;
    mousePos.y = -(e.clientY / height) * 2 + 1;
    
    raycaster.setFromCamera(mousePos, camera);
    //raycaster.ray.intersectPlane(plane, intersectPt);

    intersects = raycaster.intersectObjects(scene.children);

});


const tl = gsap.timeline();
window.addEventListener('mousedown', function(e){
    let targetPos = new THREE.Vector3(
        Math.random()*50,
        Math.random()*20,
        Math.random()*50
    );

    tl.to(camera.position, {
        x:targetPos.x,
        y:targetPos.y,
        z:targetPos.z,
        duration:2,
        onUpdate: function () { camera.lookAt(0,0,0) }
    }).to(camera.position, {
        x:targetPos.x * (Math.random() * 3),
        y:targetPos.y / (Math.random() * 2),
        z:targetPos.z / (Math.random() * -3),
        duration:2,
        onUpdate: function () { camera.lookAt(0,0,0) }
    }).to(camera.position, {
        x:targetPos.x / (Math.random() * -5),
        y:targetPos.y * (Math.random() * 1.5),
        z:targetPos.z * (Math.random() * -1.5),
        duration:2,
        onUpdate: function () { camera.lookAt(0,0,0) }
    });
});


//animattion 

const timeStep = 1/60;

function animate(time) {
    
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