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
camera.position.set(10, 15, -22);

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

const highlightMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1,1),
    new THREE.MeshBasicMaterial({color:0x999999, side:THREE.DoubleSide})
);
highlightMesh.rotateX(Math.PI /2);
highlightMesh.position.set(0.5,0,0.5);
scene.add(highlightMesh);

const sphereGeo = new THREE.SphereGeometry(.5,8,8);
const cubeGeo = new THREE.BoxGeometry(.8,.8,.8);
const coneGeo = new THREE.ConeGeometry(.5,0.8,8,8);
const ringGeo = new THREE.TorusGeometry(.5,.3,8,8);
const capsuleGeo = new THREE.CapsuleGeometry(.5,.8,8,8);

const geometriesArray = new Array();
geometriesArray.push(sphereGeo);
geometriesArray.push(cubeGeo);
geometriesArray.push(coneGeo)
geometriesArray.push(ringGeo);
geometriesArray.push(capsuleGeo);


//mouse stuff

window.addEventListener('mousemove', function(e){

    mousePos.x = (e.clientX / width) * 2 - 1;
    mousePos.y = -(e.clientY / height) * 2 + 1;
    
    raycaster.setFromCamera(mousePos, camera);
    //raycaster.ray.intersectPlane(plane, intersectPt);

    intersects = raycaster.intersectObjects(scene.children);

    intersects.forEach(function(intersect){
        if (intersect.object.name === "ground") 
        {
            const highlightPos = new THREE.Vector3().copy(intersect.point).floor().addScalar(0.5);
            highlightMesh.position.set(highlightPos.x, 0, highlightPos.z);
        }
    });

    const exists = objects.find(function(o) {
        return (o.position.x === highlightMesh.position.x) && (o.position.z === highlightMesh.position.z);
    });
    if (exists)
    {
        highlightMesh.material.color.setHex(0x990000);
    }
    else
    {
        highlightMesh.material.color.setHex(0x999999);
    }

});

window.addEventListener('mousedown', function(e){

    const exists = objects.find(function(o) {
        return (o.position.x === highlightMesh.position.x) && (o.position.z === highlightMesh.position.z);
    });

    if (!exists)
    {
        var currentGeo;

        var i = Math.floor(Math.random() * (geometriesArray.length));
        if (i == geometriesArray.length) i--;

        currentGeo = geometriesArray[i];

        const sphereClone = new THREE.Mesh(
            currentGeo,
            new THREE.MeshBasicMaterial({color:Math.random() * 0xFFFFFF, wireframe:false})
        );
        sphereClone.position.copy(highlightMesh.position);
        
        scene.add(sphereClone);
        objects.push(sphereClone);
        
        highlightMesh.material.color.setHex(0x990000);
        
    }

    //console.log(scene.children.length);
    console.log(objects.length);
});


//animattion 

const timeStep = 1/60;

function animate(time) {
    
    objects.forEach(function(o){
        // idk how to make the objects store their own random value
        // so rFactor is an arbitrary function to make a "pseudo" "random" number for each object via its coordinates
        // secretly it isn't random at all. but nobody would know that if they don't read the code

        // really this is all arbitrary magic number stuff to make it seem like there is real random bouncing and rotating
        var rFactor = Math.cos((o.position.x * 3) + (o.position.z * 5))/2; 
        o.position.y = Math.sin((time)/(750 + 750*rFactor))/2 + 1 + rFactor;
        o.rotateX(rFactor/100);
        o.rotateZ(-rFactor/125);
    });

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