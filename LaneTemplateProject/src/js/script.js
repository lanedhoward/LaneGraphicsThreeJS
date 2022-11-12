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
camera.position.set(0, 6, 6);

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
const mousePos = new THREE.Vector2();
const intersectPt = new THREE.Vector3();
const planeNormal = new THREE.Vector3();
const plane = new THREE.Plane();
const raycaster = new THREE.Raycaster();
const spheres = [];
const bodies = [];

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

const wallGeo = new THREE.BoxGeometry(10,5,0.1);
const wallMat = new THREE.MeshStandardMaterial({ color:0x999999});

const wallN = new THREE.Mesh(wallGeo, wallMat);
scene.add(wallN);

const wallBodyN = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: new CANNON.Box(new CANNON.Vec3(5,2.5,0.1)),
    material: planePMat,
    position: new CANNON.Vec3(0,0,5)
});
world.addBody(wallBodyN);

const wallS = new THREE.Mesh(wallGeo, wallMat);
scene.add(wallS);

const wallBodyS = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: new CANNON.Box(new CANNON.Vec3(5,2.5,0.1)),
    material: planePMat,
    position: new CANNON.Vec3(0,0,-5)
});
world.addBody(wallBodyS);

const wallE = new THREE.Mesh(wallGeo, wallMat);
scene.add(wallE);

const wallBodyE = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: new CANNON.Box(new CANNON.Vec3(5,2.5,0.1)),
    material: planePMat,
    position: new CANNON.Vec3(5,0,0),
    quaternion: new CANNON.Quaternion().setFromEuler(0, Math.PI/2, 0)
});
world.addBody(wallBodyE);

const wallW = new THREE.Mesh(wallGeo, wallMat);
scene.add(wallW);

const wallBodyW = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: new CANNON.Box(new CANNON.Vec3(5,2.5,0.1)),
    material: planePMat,
    position: new CANNON.Vec3(-5,0,0),
    quaternion: new CANNON.Quaternion().setFromEuler(0, Math.PI/2, 0)
});
world.addBody(wallBodyW);

//mouse stuff

window.addEventListener('mousemove', function(e){

    mousePos.x = (e.clientX / width) * 2 - 1;
    mousePos.y = -(e.clientY / height) * 2 + 1;
    
    planeNormal.copy(camera.position).normalize();

    plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);

    raycaster.setFromCamera(mousePos, camera);
    raycaster.ray.intersectPlane(plane, intersectPt);

});

var isSphere = true;

window.addEventListener('click', function(e){

    var clickGeo = new THREE.SphereGeometry(0.25, 30, 30);
    var clickShape = new CANNON.Sphere(0.125);
    if (isSphere)
    {
        isSphere = false;
    }
    else
    {
        clickGeo = new THREE.BoxGeometry(0.5,0.5,0.5);
        clickShape = new CANNON.Box(new CANNON.Vec3(0.25,0.25,0.25));
        
        isSphere = true;
    }
    
    const sphereMat = new THREE.MeshStandardMaterial({
        color:Math.random() * 0xFFFFFF, metalness:0, roughness:0
    });
    const sphere = new THREE.Mesh(clickGeo, sphereMat);
    scene.add(sphere);
    //sphere.position.copy(intersectPt);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    
    const spherePMat = new CANNON.Material();
    const sphereBody = new CANNON.Body({
        shape: clickShape,
        mass: 0.3,
        position: new CANNON.Vec3(intersectPt.x, intersectPt.y, intersectPt.z),
        material: spherePMat
    });
    world.addBody(sphereBody);

    const planeSphereContact = new CANNON.ContactMaterial(
        planePMat,
        spherePMat,
        {restitution: 0.4}
    );
    world.addContactMaterial(planeSphereContact);

    spheres.push(sphere);
    bodies.push(sphereBody);
});


//animattion 

const timeStep = 1/60;

function animate(time) {
    world.step(timeStep);
    
    ground.position.copy(planeBody.position);
    ground.quaternion.copy(planeBody.quaternion);
    
    wallN.position.copy(wallBodyN.position);
    wallN.quaternion.copy(wallBodyN.quaternion);

    wallS.position.copy(wallBodyS.position);
    wallS.quaternion.copy(wallBodyS.quaternion);

    wallE.position.copy(wallBodyE.position);
    wallE.quaternion.copy(wallBodyE.quaternion);

    wallW.position.copy(wallBodyW.position);
    wallW.quaternion.copy(wallBodyW.quaternion);


    for (let i = 0; i < spheres.length; i++)
    {
        spheres[i].position.copy(bodies[i].position);
        spheres[i].quaternion.copy(bodies[i].quaternion);
    }

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