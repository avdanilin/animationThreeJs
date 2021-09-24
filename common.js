// import * as THREE from '../build/three.module.js';

// import Stats from './jsm/libs/stats.module.js';

let container, stats;

let camera, scene, renderer;

let group;

let targetRotation = 0;
let targetRotationOnPointerDown = 0;

let pointerX = 0;
let pointerXOnPointerDown = 0;

let windowHalfX = window.innerWidth / 2;

init();
animate();

function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    camera = new THREE.PerspectiveCamera(102, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(150, 150, 150);
    scene.add(camera);

    const light = new THREE.PointLight(0xffffff, 1);
    camera.add(light);

    group = new THREE.Group();
    group.position.y = 50;
    scene.add(group);

    // const loader = new THREE.TextureLoader();
    // const texture = loader.load("https://thumbs.dreamstime.com/b/%D0%BA%D1%80%D0%B0%D1%81%D0%BD%D1%8B%D0%B9-%D0%BA%D0%B2%D0%B0%D0%B4%D1%80%D0%B0%D1%82-%D1%82%D0%B5%D0%BA%D1%81%D1%82%D1%83%D1%80%D1%8B-%D1%82%D0%BA%D0%B0%D0%BD%D0%B8-%D1%85%D0%BE%D0%BB%D1%81%D1%82%D0%B0-109192765.jpg");

    // it's necessary to apply these settings in order to correctly display the texture on a shape geometry

    // texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    // texture.repeat.set(0.008, 0.008);

    function addShape(shape, extrudeSettings, color, x, y, z, rx, ry, rz, s) {

        geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

        addLineShape(shape, color, x, y, z, rx, ry, rz, s);
        // addLineShape(shape, 0x00ff00, x + 4, y + 20, z, rx, ry, rz, 1.2);
    }

    function addLineShape(shape, color, x, y, z, rx, ry, rz, s) {

        // lines

        shape.autoClose = true;

        const points = shape.getPoints();

        const geometryPoints = new THREE.BufferGeometry().setFromPoints(points);

        // let geometry = new THREE.ShapeGeometry(shape);

        // let mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { side: THREE.DoubleSide, map: texture } ) );
        // mesh.position.set( x, y, z - 175 );
        // mesh.rotation.set( rx, ry, rz );
        // mesh.scale.set( s, s, s );
        // group.add( mesh );

        // solid line

        for (let i = 1; i < 10; i++) {
            let line = new THREE.Line(geometryPoints, new THREE.LineBasicMaterial({color: color}));
            line.position.set(x + i * 10, y + i * 10, z + i * 0.5);
            line.rotation.set(rx, ry, rz);
            line.scale.set(s , s , s);
            // line.rotation.set(0, 0, Math.PI / 2)
            // line.rotation.set(0, 0, Math.PI / -1.3)
            group.add(line);
        }
    }

    const roundedRectShape = new THREE.Shape();

    function roundedRect(ctx, x, y, width, height, radius) {

        ctx.moveTo(x, y + radius);
        ctx.lineTo(x, y + height - radius);
        ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
        ctx.lineTo(x + width - radius, y + height);
        ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
        ctx.lineTo(x + width, y + radius);
        ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
        ctx.lineTo(x + radius, y);
        ctx.quadraticCurveTo(x, y, x, y + radius);
    }

    roundedRect(roundedRectShape, 0, 0, 120, 120, 20)

    const extrudeSettings = {depth: 8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1};

    addShape(roundedRectShape, extrudeSettings, 0xff0000, 60, -10, 0, 0, 0, 0, 2);

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    stats = new Stats();
    container.appendChild(stats.dom);

    container.style.touchAction = 'none';
    document.addEventListener('pointermove', onPointerMove);

    window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}


function onPointerMove(event) {

    if (event.isPrimary === false) return;

    pointerX = event.clientX - windowHalfX;

    targetRotation = targetRotationOnPointerDown + (pointerX - pointerXOnPointerDown) * 0.001;

}

function animate() {

    requestAnimationFrame(animate);

    render();
    stats.update();

}

function render() {
    group.rotation.x += (targetRotation - group.rotation.x) * 0.005;
    group.rotation.y += (targetRotation - group.rotation.y) * 0.03;
    renderer.render(scene, camera);
}


// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);
//
// const geometry = new THREE.BoxGeometry(3, 2, 2);
//
// const material = new THREE.MeshBasicMaterial({
//     color: 0xff0000,
//     wireframe: true
// });
//
// const cube = new THREE.Mesh(geometry, material);
//
//
// scene.add(cube);
//
// camera.position.z = 3;
//
// const animate = function () {
//     requestAnimationFrame(animate);
//
//     // cube.rotation.x += 0.01;
//     // cube.rotation.y += 0.01;
//
//     renderer.render(scene, camera);
// };
//
// animate();