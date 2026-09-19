import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeCanvas({ pointerPos = { x: 0, y: 0 }, theme = 'mauve' }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = container.clientWidth;
    const height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Dynamic Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff5f8, 1.8);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // Interactive pointer light for glossy shine
    const pointLight = new THREE.PointLight(0xffaacc, 3.5, 15);
    pointLight.position.set(0, 0, 4);
    scene.add(pointLight);

    // Create 3D Heart Shape
    const heartShape = new THREE.Shape();
    const x = 0, y = 0;
    heartShape.moveTo(x + 0.25, y + 0.25);
    heartShape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y);
    heartShape.bezierCurveTo(x - 0.3, y, x - 0.3, y + 0.35, x - 0.3, y + 0.35);
    heartShape.bezierCurveTo(x - 0.3, y + 0.55, x - 0.1, y + 0.77, x + 0.25, y + 0.95);
    heartShape.bezierCurveTo(x + 0.6, y + 0.77, x + 0.8, y + 0.55, x + 0.8, y + 0.35);
    heartShape.bezierCurveTo(x + 0.8, y + 0.35, x + 0.8, y, x + 0.5, y);
    heartShape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);

    const extrudeSettings = {
      depth: 0.15,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 2,
      bevelSize: 0.08,
      bevelThickness: 0.08
    };

    const heartGeo = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    heartGeo.center();

    // Create 3D 5-pointed Star Shape
    const starShape = new THREE.Shape();
    const points = 5;
    const outerRadius = 0.45;
    const innerRadius = 0.22;
    for (let i = 0; i < points * 2; i++) {
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const px = Math.cos(angle) * radius;
      const py = Math.sin(angle) * radius;
      if (i === 0) starShape.moveTo(px, py);
      else starShape.lineTo(px, py);
    }
    starShape.closePath();

    const starGeo = new THREE.ExtrudeGeometry(starShape, {
      depth: 0.12,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.05,
      bevelThickness: 0.05
    });
    starGeo.center();

    // Materials - Cute pastel pearlescent look
    const pinkMat = new THREE.MeshStandardMaterial({
      color: 0xffa8bb,
      roughness: 0.18,
      metalness: 0.3,
      emissive: 0xff7090,
      emissiveIntensity: 0.08,
    });

    const whiteMat = new THREE.MeshStandardMaterial({
      color: 0xfdfbfd,
      roughness: 0.22,
      metalness: 0.15,
      emissive: 0xf0e6ff,
      emissiveIntensity: 0.05,
    });

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xffe28a,
      roughness: 0.15,
      metalness: 0.65,
    });

    // Spawn floating 3D elements in phone background
    const floatingObjects = [];

    // Helper to add floating mesh
    const addMesh = (geo, mat, scale, pos, rotSpeed) => {
      const mesh = new THREE.Mesh(geo, mat);
      mesh.scale.setScalar(scale);
      mesh.position.set(pos.x, pos.y, pos.z);
      scene.add(mesh);
      floatingObjects.push({
        mesh,
        initialY: pos.y,
        initialX: pos.x,
        speed: 0.8 + Math.random() * 0.7,
        offset: Math.random() * Math.PI * 2,
        rotSpeed: rotSpeed
      });
    };

    // Add cute hearts & stars matching phone aesthetic
    addMesh(heartGeo, pinkMat, 0.8, { x: 1.6, y: 3.2, z: -1 }, { x: 0.008, y: 0.012, z: 0.004 });
    addMesh(starGeo, goldMat, 0.7, { x: 1.7, y: 1.2, z: -0.5 }, { x: 0.005, y: -0.015, z: 0.006 });
    addMesh(starGeo, whiteMat, 0.65, { x: -1.7, y: -0.8, z: -0.8 }, { x: -0.01, y: 0.008, z: 0.003 });
    addMesh(heartGeo, pinkMat, 0.75, { x: 1.5, y: -2.8, z: -1.2 }, { x: 0.01, y: 0.01, z: -0.005 });
    addMesh(starGeo, goldMat, 0.5, { x: -0.2, y: 3.5, z: -1.5 }, { x: 0.006, y: 0.012, z: 0 });

    // Floating Pearls / Pastel Orbs
    const sphereGeo = new THREE.SphereGeometry(0.25, 32, 32);
    for (let i = 0; i < 6; i++) {
      const pMat = (i % 2 === 0) ? whiteMat : pinkMat;
      const px = (Math.random() - 0.5) * 4;
      const py = (Math.random() - 0.5) * 7;
      const pz = -1 - Math.random() * 2;
      addMesh(sphereGeo, pMat, 0.6 + Math.random() * 0.5, { x: px, y: py, z: pz }, { x: 0.01, y: 0.01, z: 0 });
    }

    // Sparkling 3D Particle Field
    const particleCount = 45;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 6;
      particlePos[i + 1] = (Math.random() - 0.5) * 10;
      particlePos[i + 2] = (Math.random() - 0.5) * 4;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));

    // Particle sprite using canvas texture
    const starCanvas = document.createElement('canvas');
    starCanvas.width = 64;
    starCanvas.height = 64;
    const sCtx = starCanvas.getContext('2d');
    const grad = sCtx.createRadialGradient(32, 32, 0, 32, 32, 30);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(255, 215, 235, 0.8)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    sCtx.fillStyle = grad;
    sCtx.beginPath();
    sCtx.arc(32, 32, 30, 0, Math.PI * 2);
    sCtx.fill();

    const starTexture = new THREE.CanvasTexture(starCanvas);
    const particleMat = new THREE.PointsMaterial({
      size: 0.28,
      map: starTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Float and rotate objects
      floatingObjects.forEach((item) => {
        item.mesh.position.y = item.initialY + Math.sin(elapsedTime * item.speed + item.offset) * 0.25;
        item.mesh.position.x = item.initialX + Math.cos(elapsedTime * (item.speed * 0.7) + item.offset) * 0.1;
        item.mesh.rotation.x += item.rotSpeed.x;
        item.mesh.rotation.y += item.rotSpeed.y;
        item.mesh.rotation.z += item.rotSpeed.z;
      });

      // Slowly rotate particle field
      particles.rotation.y = elapsedTime * 0.04;
      particles.rotation.z = elapsedTime * 0.02;

      // Dynamic light follows pointer with damping
      pointLight.position.x += ((pointerPos.x * 3) - pointLight.position.x) * 0.1;
      pointLight.position.y += ((-pointerPos.y * 5) - pointLight.position.y) * 0.1;

      // Subtle parallax camera tilt
      camera.position.x += ((pointerPos.x * 0.8) - camera.position.x) * 0.05;
      camera.position.y += ((-pointerPos.y * 0.8) - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      // Dispose geometries and materials
      heartGeo.dispose();
      starGeo.dispose();
      sphereGeo.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      pinkMat.dispose();
      whiteMat.dispose();
      goldMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
}
