'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface SeasonalCanvas3DProps {
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  className?: string;
}

interface ParticleItem {
  mesh: THREE.Object3D;
  rotSpeed: THREE.Vector3;
  velocity: THREE.Vector3;
  baseY: number;
  phase: number;
  radius: number;
  angle: number;
}

export function SeasonalCanvas3D({ season, className = '' }: SeasonalCanvas3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameId = useRef<number | null>(null);
  const particlesGroupRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<ParticleItem[]>([]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Use generous bounding box so 3D elements extend well beyond the wheel
    const width = container.clientWidth || 520;
    const height = container.clientHeight || 520;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 9);

    // Renderer with full alpha transparency
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting: Bright and vibrant so materials are clear against white background
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.8);
    dirLight1.position.set(6, 8, 8);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight2.position.set(-6, -6, 5);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xffffff, 3.5, 20);
    pointLight.position.set(0, 0, 5);
    scene.add(pointLight);

    // Group for seasonal particles
    const particlesGroup = new THREE.Group();
    scene.add(particlesGroup);
    particlesGroupRef.current = particlesGroup;

    // Animation Loop
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Gentle global rotation
      particlesGroup.rotation.z = elapsed * 0.035;

      // Animate individual particles
      const items = particlesRef.current;
      for (let i = 0; i < items.length; i++) {
        const p = items[i];
        p.mesh.rotation.x += p.rotSpeed.x;
        p.mesh.rotation.y += p.rotSpeed.y;
        p.mesh.rotation.z += p.rotSpeed.z;

        // Smooth orbital drift around the wheel
        p.angle += p.velocity.x * 0.008;
        p.mesh.position.x = Math.cos(p.angle) * p.radius;
        p.mesh.position.y = Math.sin(p.angle) * p.radius + Math.sin(elapsed * 1.4 + p.phase) * 0.35;
        p.mesh.position.z = Math.sin(p.angle * 2 + p.phase) * 0.9;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !rendererRef.current) return;
      const w = container.clientWidth || 520;
      const h = container.clientHeight || 520;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      if (rendererRef.current && rendererRef.current.domElement) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Update 3D objects when season changes
  useEffect(() => {
    const group = particlesGroupRef.current;
    if (!group) return;

    // Clear existing objects
    while (group.children.length > 0) {
      const obj = group.children[0] as THREE.Mesh;
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else {
          obj.material.dispose();
        }
      }
      group.remove(obj);
    }
    particlesRef.current = [];

    const newItems: ParticleItem[] = [];

    if (season === 'spring') {
      // SPRING: 3D Botanical Leaves & Jasmine Blossom Petals
      const leafShape = new THREE.Shape();
      leafShape.moveTo(0, 0);
      leafShape.quadraticCurveTo(0.45, 0.6, 0, 1.4);
      leafShape.quadraticCurveTo(-0.45, 0.6, 0, 0);
      const leafGeo = new THREE.ShapeGeometry(leafShape);

      const colors = [0x4e9f3d, 0x7dae77, 0x68bb59, 0xa8e6cf];

      for (let i = 0; i < 32; i++) {
        const color = colors[i % colors.length];
        const mat = new THREE.MeshStandardMaterial({
          color,
          emissive: 0x225522,
          emissiveIntensity: 0.35,
          side: THREE.DoubleSide,
          roughness: 0.3,
          metalness: 0.1,
          transparent: true,
          opacity: 0.88,
        });

        const mesh = new THREE.Mesh(leafGeo, mat);
        const scale = 0.55 + Math.random() * 0.45;
        mesh.scale.set(scale, scale, scale);

        // Position in orbit around the 400px circle (radius 2.3 to 4.8 in 3D units)
        const radius = 2.4 + Math.random() * 2.5;
        const angle = (i / 32) * Math.PI * 2 + Math.random() * 0.2;

        mesh.position.set(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          (Math.random() - 0.5) * 2.2
        );

        mesh.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        );

        group.add(mesh);
        newItems.push({
          mesh,
          rotSpeed: new THREE.Vector3(
            (Math.random() - 0.5) * 0.025,
            (Math.random() - 0.5) * 0.03,
            (Math.random() - 0.5) * 0.02
          ),
          velocity: new THREE.Vector3(0.5 + Math.random() * 0.5, 0, 0),
          baseY: mesh.position.y,
          phase: Math.random() * Math.PI * 2,
          radius,
          angle,
        });
      }
    } else if (season === 'summer') {
      // SUMMER: 3D Celestial Solar Rings & Sparkling Sun Octahedrons
      // 1. Two Concentric Radiant Torus Rings
      const ringGeo1 = new THREE.TorusGeometry(3.6, 0.05, 16, 90);
      const ringMat1 = new THREE.MeshStandardMaterial({
        color: 0xe2849b,
        emissive: 0x8a243e,
        emissiveIntensity: 0.5,
        roughness: 0.15,
        metalness: 0.5,
        transparent: true,
        opacity: 0.65,
      });
      const ringMesh1 = new THREE.Mesh(ringGeo1, ringMat1);
      ringMesh1.rotation.x = Math.PI / 4;
      group.add(ringMesh1);

      const ringGeo2 = new THREE.TorusGeometry(4.2, 0.03, 16, 90);
      const ringMat2 = new THREE.MeshStandardMaterial({
        color: 0xffb703,
        emissive: 0x8a5a00,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.6,
        transparent: true,
        opacity: 0.55,
      });
      const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
      ringMesh2.rotation.y = -Math.PI / 3;
      group.add(ringMesh2);

      // 2. Floating Octahedron Sun Crystals
      const crystalGeo = new THREE.OctahedronGeometry(0.38, 0);
      const colors = [0xe2849b, 0xff758f, 0xffb703, 0xf4a261];

      for (let i = 0; i < 26; i++) {
        const mat = new THREE.MeshStandardMaterial({
          color: colors[i % colors.length],
          emissive: 0x4a1824,
          emissiveIntensity: 0.45,
          roughness: 0.15,
          metalness: 0.4,
          transparent: true,
          opacity: 0.9,
        });

        const mesh = new THREE.Mesh(crystalGeo, mat);
        const scale = 0.5 + Math.random() * 0.45;
        mesh.scale.set(scale, scale, scale);

        const radius = 2.4 + Math.random() * 2.4;
        const angle = (i / 26) * Math.PI * 2;

        mesh.position.set(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          (Math.random() - 0.5) * 2.2
        );

        group.add(mesh);
        newItems.push({
          mesh,
          rotSpeed: new THREE.Vector3(0.02, 0.025, 0.015),
          velocity: new THREE.Vector3(0.6 + Math.random() * 0.5, 0, 0),
          baseY: mesh.position.y,
          phase: Math.random() * Math.PI * 2,
          radius,
          angle,
        });
      }
    } else if (season === 'autumn') {
      // AUTUMN: 3D Golden Amber Maple & Ginkgo Leaves
      const mapleShape = new THREE.Shape();
      mapleShape.moveTo(0, 0);
      mapleShape.lineTo(0.3, 0.45);
      mapleShape.lineTo(0.65, 0.5);
      mapleShape.lineTo(0.35, 0.95);
      mapleShape.lineTo(0, 1.35);
      mapleShape.lineTo(-0.35, 0.95);
      mapleShape.lineTo(-0.65, 0.5);
      mapleShape.lineTo(-0.3, 0.45);
      mapleShape.closePath();
      const mapleGeo = new THREE.ShapeGeometry(mapleShape);

      const colors = [0xe2aa3e, 0xf4a261, 0xbc6c25, 0xd4a03b, 0xc87d20];

      for (let i = 0; i < 32; i++) {
        const mat = new THREE.MeshStandardMaterial({
          color: colors[i % colors.length],
          emissive: 0x5a340a,
          emissiveIntensity: 0.38,
          side: THREE.DoubleSide,
          roughness: 0.25,
          metalness: 0.15,
          transparent: true,
          opacity: 0.9,
        });

        const mesh = new THREE.Mesh(mapleGeo, mat);
        const scale = 0.5 + Math.random() * 0.45;
        mesh.scale.set(scale, scale, scale);

        const radius = 2.4 + Math.random() * 2.5;
        const angle = (i / 32) * Math.PI * 2;

        mesh.position.set(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          (Math.random() - 0.5) * 2.4
        );

        group.add(mesh);
        newItems.push({
          mesh,
          rotSpeed: new THREE.Vector3(
            (Math.random() - 0.5) * 0.025,
            (Math.random() - 0.5) * 0.035,
            (Math.random() - 0.5) * 0.02
          ),
          velocity: new THREE.Vector3(0.5 + Math.random() * 0.45, 0, 0),
          baseY: mesh.position.y,
          phase: Math.random() * Math.PI * 2,
          radius,
          angle,
        });
      }
    } else {
      // WINTER: 3D Faceted Ice Prisms & Frost Crystalline Snowflakes
      const iceGeo = new THREE.IcosahedronGeometry(0.35, 0);
      const colors = [0x88a2b5, 0x48cae4, 0x90e0ef, 0xade8f4];

      for (let i = 0; i < 30; i++) {
        const mat = new THREE.MeshStandardMaterial({
          color: colors[i % colors.length],
          emissive: 0x1d4e68,
          emissiveIntensity: 0.45,
          roughness: 0.1,
          metalness: 0.45,
          transparent: true,
          opacity: 0.88,
        });

        const mesh = new THREE.Mesh(iceGeo, mat);
        const scale = 0.5 + Math.random() * 0.5;
        mesh.scale.set(scale, scale, scale);

        const radius = 2.4 + Math.random() * 2.5;
        const angle = (i / 30) * Math.PI * 2;

        mesh.position.set(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          (Math.random() - 0.5) * 2.2
        );

        group.add(mesh);
        newItems.push({
          mesh,
          rotSpeed: new THREE.Vector3(0.015, 0.02, 0.015),
          velocity: new THREE.Vector3(0.45 + Math.random() * 0.45, 0, 0),
          baseY: mesh.position.y,
          phase: Math.random() * Math.PI * 2,
          radius,
          angle,
        });
      }
    }

    particlesRef.current = newItems;
  }, [season]);

  return (
    <div
      ref={mountRef}
      className={`w-full h-full relative pointer-events-none select-none overflow-visible ${className}`}
      aria-hidden="true"
    />
  );
}
