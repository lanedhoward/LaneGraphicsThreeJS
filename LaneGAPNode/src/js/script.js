import * as THREE from "three";
import { PlaneGeometry } from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import bust from "../img/bust.png";
import match from "../img/match.png";
import skull from "../img/skull_and_roses.png";
import stage from "../img/stage.png";
import thevoid from "../img/void.png";
import wither from "../img/wither.png";


var height = window.innerHeight;
var width = window.innerWidth;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 45, width / height, 0.1, 1000 );
camera.position.set(-10, 30, 30);

const textureLoader = new THREE.CubeTextureLoader();
scene.background = textureLoader.load([
bust, match,
skull, stage,
thevoid, wither
]);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width,height);
document.body.appendChild(renderer.domElement);

renderer.shadowMap.enabled = true;

const orbit = new OrbitControls(camera, renderer.domElement);

const axes = new THREE.AxesHelper(2);
scene.add(axes);

const ringGeo = new THREE.TorusGeometry(3,1,40,40);
const ringMat = new THREE.MeshLambertMaterial({color:0xFF0000});
const ring = new THREE.Mesh(ringGeo, ringMat);
scene.add(ring);
ring.position.set(3,5,7);
ring.castShadow = true;

const planeGeo = new THREE.PlaneGeometry(30,30);
const planeMat = new THREE.MeshLambertMaterial({color: 0xFFFFFF, side:THREE.DoubleSide});
const plane = new THREE.Mesh(planeGeo, planeMat);
scene.add(plane);
plane.rotateX(-.5*Math.PI);
plane.receiveShadow = true;

const grid = new THREE.GridHelper(30);
scene.add(grid);

const sphereGeo = new THREE.ConeGeometry(5, 10, 40, 40);
const sphereMat = new THREE.MeshLambertMaterial({color: 0x0000FF});
const sphere = new THREE.Mesh(sphereGeo, sphereMat);
scene.add(sphere);
sphere.position.set(-10,10,0);
sphere.castShadow = true;

const ambientLight = new THREE.AmbientLight(0x55280a, 0.3);
scene.add(ambientLight);

/*
const dirLight = new THREE.DirectionalLight(0xFF00F0, 0.7);
scene.add(dirLight);
const dirLightHelper = new THREE.DirectionalLightHelper(dirLight);
scene.add(dirLightHelper);
dirLight.position.set(-20,20,0);
dirLight.castShadow = true;
dirLight.shadow.camera.bottom = -20;
const dirLightShadowHelper = new THREE.CameraHelper(dirLight.shadow.camera);
scene.add(dirLightShadowHelper);
*/

const spotLight = new THREE.SpotLight(0xFF00F0, 0.7);
scene.add(spotLight);
spotLight.position.set(-20,20,0);
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);
spotLight.castShadow = true;

//const fog = new THREE.Fog(0xFFFFFF, 0, 200);
const fog = new THREE.FogExp2(0xFFFFFF, 0.005);
//scene.add(fog);
scene.fog = fog;

const gui = new dat.GUI();
const guiOptions = { coneColor:'#0000FF', wireframe:false, speed:0.01, angle:0.5, penumbra:0.5, intensity:0.5, ringSpeed:1};
gui.addColor(guiOptions,'coneColor').onChange(function(e){
    sphere.material.color.set(e);
});
gui.add(guiOptions, "wireframe").onChange(function(e){
    sphere.material.wireframe = e;
});
gui.add(guiOptions, "speed", 0,.1);
gui.add(guiOptions,"angle",0,1);
gui.add(guiOptions,"penumbra",0,1);
gui.add(guiOptions,"intensity",0,1);
gui.add(guiOptions,"ringSpeed",0,10);

var angle = 0;

function animate(time) {
    ring.rotation.x = time/1000 * guiOptions.ringSpeed;
    ring.rotation.y = time/1000 * guiOptions.ringSpeed;

    angle += guiOptions.speed;
    sphere.position.y = 10*Math.abs(Math.sin(angle));

    spotLight.angle = guiOptions.angle;
    spotLight.penumbra = guiOptions.penumbra;
    spotLight.intensity = guiOptions.intensity;
    spotLightHelper.update();

    renderer.render( scene, camera );
}
renderer.setAnimationLoop(animate);

