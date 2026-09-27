// Three.js particle background for sidebar
// Call initParticles(canvas) after THREE is loaded globally

function initParticles(canvas) {
  if (typeof THREE === 'undefined' || !canvas) {
    console.warn('THREE not loaded or canvas not found');
    return;
  }

  var PARTICLE_COUNT = 2000;
  var PARTICLE_SIZE = 0.3;
  var MOUSE_RADIUS = 5;
  var MOUSE_FORCE = 0.08;
  var RETURN_SPEED = 0.03;

  var parent = canvas.parentElement;
  var rect = parent.getBoundingClientRect();

  var scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050510, 0.03);

  var camera = new THREE.PerspectiveCamera(75, rect.width / rect.height, 0.1, 100);
  camera.position.z = 25;

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setSize(rect.width, rect.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Star sprite
  var spriteCanvas = document.createElement('canvas');
  spriteCanvas.width = 32;
  spriteCanvas.height = 32;
  var ctx = spriteCanvas.getContext('2d');
  var grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.2, 'rgba(200, 240, 255, 0.8)');
  grad.addColorStop(0.5, 'rgba(0, 100, 255, 0.2)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 32, 32);
  var spriteTexture = new THREE.CanvasTexture(spriteCanvas);

  // Particles
  var geometry = new THREE.BufferGeometry();
  var positions = new Float32Array(PARTICLE_COUNT * 3);
  var originalPositions = new Float32Array(PARTICLE_COUNT * 3);
  var colors = new Float32Array(PARTICLE_COUNT * 3);

  var color1 = new THREE.Color(0x00f3ff);
  var color2 = new THREE.Color(0xffffff);
  var color3 = new THREE.Color(0xbc13fe);

  for (var i = 0; i < PARTICLE_COUNT; i++) {
    var i3 = i * 3;
    var x = (Math.random() - 0.5) * 50;
    var y = (Math.random() - 0.5) * 50;
    var z = (Math.random() - 0.5) * 50;

    positions[i3] = x;
    positions[i3 + 1] = y;
    positions[i3 + 2] = z;
    originalPositions[i3] = x;
    originalPositions[i3 + 1] = y;
    originalPositions[i3 + 2] = z;

    var rand = Math.random();
    var mc;
    if (rand < 0.7) mc = color1.clone().lerp(color2, Math.random());
    else mc = color3.clone();
    colors[i3] = mc.r;
    colors[i3 + 1] = mc.g;
    colors[i3 + 2] = mc.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  var material = new THREE.PointsMaterial({
    size: PARTICLE_SIZE,
    map: spriteTexture,
    transparent: true,
    opacity: 0.9,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  var particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // Mouse interaction scoped to sidebar
  var mouse = new THREE.Vector2(9999, 9999);
  var raycaster = new THREE.Raycaster();

  parent.addEventListener('mousemove', function (e) {
    var r = parent.getBoundingClientRect();
    mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;
  });

  parent.addEventListener('mouseleave', function () {
    mouse.set(9999, 9999);
  });

  window.addEventListener('resize', function () {
    var r = parent.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    camera.aspect = r.width / r.height;
    camera.updateProjectionMatrix();
    renderer.setSize(r.width, r.height);
  });

  // Animate
  var clock = new THREE.Clock();
  var vector = new THREE.Vector3();
  var closest = new THREE.Vector3();
  var push = new THREE.Vector3();
  var worldToLocal = new THREE.Quaternion();

  function animate() {
    requestAnimationFrame(animate);
    var time = clock.getElapsedTime();

    particles.rotation.y = time * 0.02;
    particles.rotation.x = Math.sin(time * 0.1) * 0.05;
    particles.updateMatrixWorld();
    worldToLocal.setFromRotationMatrix(particles.matrixWorld).invert();

    raycaster.setFromCamera(mouse, camera);
    var ray = raycaster.ray;
    var posAttr = geometry.attributes.position;

    for (var i = 0; i < PARTICLE_COUNT; i++) {
      var i3 = i * 3;
      var px = posAttr.array[i3];
      var py = posAttr.array[i3 + 1];
      var pz = posAttr.array[i3 + 2];

      vector.set(px, py, pz).applyMatrix4(particles.matrixWorld);
      var distToRay = ray.distanceToPoint(vector);

      if (distToRay < MOUSE_RADIUS) {
        var force = (1 - distToRay / MOUSE_RADIUS) * MOUSE_FORCE;
        ray.closestPointToPoint(vector, closest);
        // Push is computed in world space; rotate it into the particles' local frame
        push.subVectors(vector, closest).applyQuaternion(worldToLocal).multiplyScalar(force * 8);
        posAttr.array[i3]     += push.x;
        posAttr.array[i3 + 1] += push.y;
        posAttr.array[i3 + 2] += push.z;
      }

      posAttr.array[i3]     += (originalPositions[i3] - px) * RETURN_SPEED;
      posAttr.array[i3 + 1] += (originalPositions[i3 + 1] - py) * RETURN_SPEED;
      posAttr.array[i3 + 2] += (originalPositions[i3 + 2] - pz) * RETURN_SPEED;
      posAttr.array[i3]     += Math.sin(time * 0.5 + px) * 0.005;
      posAttr.array[i3 + 1] += Math.cos(time * 0.3 + py) * 0.005;
    }

    posAttr.needsUpdate = true;
    renderer.render(scene, camera);
  }

  animate();
}
