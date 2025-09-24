//Modified from the starter example on thre.js's site
let lantern;

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

window.addEventListener("resize", resizeLanternRenderer);

const lanternShell = document.getElementById('lanternModelProj');
let lanternBounds = lanternShell.getBoundingClientRect();
const scene = new THREE.Scene();
const backgroundGray = new THREE.Color(0x222a30);
//const backgroundGray = new THREE.Color(0x222000);

scene.background = backgroundGray;
//const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const camera = new THREE.OrthographicCamera( lanternBounds.width * -.5, lanternBounds.width * .5, lanternBounds.height * -.5, lanternBounds.height * .5, 0.1, 1000000);

//const camera = new THREE.PerspectiveCamera( 75, lanternBounds.width / lanternBounds.height, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
//renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setSize( lanternBounds.width, lanternBounds.height);
renderer.setAnimationLoop( animate );

//document.body.appendChild( renderer.domElement );
lanternShell.appendChild(renderer.domElement);
//const controls = new OrbitControls( camera, renderer.domElement );
//controls.enablePan = false;
//controls.update();
/*const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );*/

var light = new THREE.AmbientLight(0xffffff);
scene.add(light);

const loader = new GLTFLoader();

loader.load( 'Media/lantern.glb', function ( gltf ) {
    //car = gltf.scene.children[0];
    //car.scale.set(0.1, 0.1, 0.1);
    console.log(gltf.scene.children.length);
    //lantern = gltf.scene;
    let lanternModel = gltf.scene.children[0].geometry;

    const lanternMat = new THREE.MeshBasicMaterial( { color: 0xed215b } );
    lantern = new THREE.Mesh(lanternModel, lanternMat);
    //lantern.rotateZ(4.27606); //for perspective
    lantern.translateZ(-300); 
    lantern.translateY(10);
    //lantern.scale.set(3, 3, 3); //for perspective camera
    lantern.scale.set(120, 120, 120); //for ortho camera
    lantern.rotateZ(1.13446);
    //controls.target = getCenterPoint(lantern)
    //controls.update();
	scene.add( lantern );

},
// called while loading is progressing
function ( xhr ) {

    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

}, function ( error ) {
    console.log("model load failed");
	console.error( error );

} );

camera.position.z = 5;

function animate() {

	//cube.rotation.x += 0.01;
	//cube.rotation.y += 0.01;
    if (lantern) {
        lantern.rotation.y += 0.003;
    }

	renderer.render( scene, camera );

}

function resizeLanternRenderer() {
    lanternBounds = lanternShell.getBoundingClientRect();
    renderer.setSize( lanternBounds.width, lanternBounds.height);
}

function getCenterPoint(mesh) {
    //from https://stackoverflow.com/questions/38305408/threejs-get-center-of-object
    var geometry = mesh.geometry;
    geometry.computeBoundingBox();
    var center = new THREE.Vector3();
    geometry.boundingBox.getCenter( center );
    mesh.localToWorld( center );
    return center;
}