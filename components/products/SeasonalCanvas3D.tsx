'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface SeasonalCanvas3DProps {
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  className?: string;
}

interface ParticleItem {
  mesh: THREE.Mesh;
  rotSpeed: THREE.Vector3;
  velocity: THREE.Vector3;
  baseY: number;
  phase: number;
  radius: number;
  angle: number;
}

export function SeasonalCanvas3D({ season, className = '' }: SeasonalCanvas3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameId = useRef<number | null>(null);
  const particlesGroupRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<ParticleItem[]>([]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    // Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 10);

    // Renderer with transparency
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.6);
    dirLight1.position.set(5, 8, 6);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight2.position.set(-5, -4, 4);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xffffff, 2, 15);
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

      // Slowly rotate the entire seasonal universe
      particlesGroup.rotation.z = elapsed * 0.04;

      // Animate individual particles
      const items = particlesRef.current;
      for (let i = 0; i < items.length; i++) {
        const p = items[i];
        p.mesh.rotation.x += p.rotSpeed.x;
        p.mesh.rotation.y += p.rotSpeed.y;
        p.mesh.rotation.z += p.rotSpeed.z;

        // Radial orbit or drift
        p.angle += p.velocity.x * 0.01;
        p.mesh.position.x = Math.cos(p.angle) * p.radius;
        p.mesh.position.y = Math.sin(p.angle) * p.radius + Math.sin(elapsed * 1.5 + p.phase) * 0.35;
        p.mesh.position.z = Math.sin(p.angle * 2) * 1.2;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Observer
    const handleResize = () => {
      if (!container || !rendererRef.current) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (newWidth === 0 || newHeight === 0) return;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
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

    // Helper to generate seasonal 3D meshes
    const newItems: ParticleItem[] = [];

    if (season === 'spring') {
      // SPRING: 3D Floating Botanical Leaves & Sakura/Jasmine Petals
      const leafShape = new THREE.Shape();
      leafShape.moveTo(0, 0);
      leafShape.quadraticCurveTo(0.35, 0.45, 0, 1.1);
      leafShape.quadraticCurveTo(-0.35, 0.45, 0, 0);
      const leafGeo = new THREE.ShapeGeometry(leafShape);

      const colors = [0x7dae77, 0x8fc289, 0xa3d99d, 0x6e9f69];

      for (let i = 0; i < 28; i++) {
        const color = colors[i % colors.length];
        const mat = new THREE.MeshStandardMaterial({
          color,
          side: THREE.DoubleSide,
          roughness: 0.35,
          metalness: 0.1,
          transparent: true,
          opacity: 0.8,
        });

        const mesh = new THREE.Mesh(leafGeo, mat);
        const scale = 0.35 + Math.random() * 0.45;
        mesh.scale.set(scale, scale, scale);

        const radius = 3.2 + Math.random() * 2.8;
        const angle = Math.random() * Math.PI * 2;

        mesh.position.set(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          (Math.random() - 0.5) * 3
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
            (Math.random() - 0.5) * 0.02,
            (Math.random() - 0.5) * 0.025,
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
      // SUMMER: 3D Radiant Sun Crystals, Lotus Petals & Solar Torus Rings
      // 1. Concentric Glowing Torus Ring
      const ringGeo = new THREE.TorusGeometry(3.8, 0.04, 16, 80);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0xe2849b,
        emissive: 0x6e1b30,
        roughness: 0.2,
        metalness: 0.5,
        transparent: true,
        opacity: 0.5,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 3;
      group.add(ringMesh);

      // 2. Floating Octahedron Sun Crystals
      const crystalGeo = new THREE.OctahedronGeometry(0.3, 0);
      const colors = [0xe2849b, 0xf4a261, 0xffb703, 0xf28482];

      for (let i = 0; i < 24; i++) {
        const mat = new THREE.MeshStandardMaterial({
          color: colors[i % colors.length],
          emissive: 0x331018,
          roughness: 0.15,
          metalness: 0.4,
          transparent: true,
          opacity: 0.85,
        });

        const mesh = new THREE.Mesh(crystalGeo, mat);
        const scale = 0.4 + Math.random() * 0.5;
        mesh.scale.set(scale, scale, scale);

        const radius = 3.3 + Math.random() * 2.6;
        const angle = Math.random() * Math.PI * 2;

        mesh.position.set(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          (Math.random() - 0.5) * 2.5
        );

        group.add(mesh);
        newItems.push({
          mesh,
          rotSpeed: new THREE.Vector3(0.015, 0.02, 0.01),
          velocity: new THREE.Vector3(0.6 + Math.random() * 0.5, 0, 0),
          baseY: mesh.position.y,
          phase: Math.random() * Math.PI * 2,
          radius,
          angle,
        });
      }
    } else if (season === 'autumn') {
      // AUTUMN: 3D Golden Amber Maple/Ginkgo Leaves
      const mapleShape = new THREE.Shape();
      mapleShape.moveTo(0, 0);
      mapleShape.lineTo(0.25, 0.4);
      mapleShape.lineTo(0.55, 0.45);
      mapleShape.lineTo(0.3, 0.85);
      mapleShape.lineTo(0, 1.2);
      mapleShape.lineTo(-0.3, 0.85);
      mapleShape.lineTo(-0.55, 0.45);
      mapleShape.lineTo(-0.25, 0.4);
      mapleShape.closePath();
      const mapleGeo = new THREE.ShapeGeometry(mapleShape);

      const colors = [0xe2aa3e, 0xd4a03b, 0xc87d20, 0xb06c15];

      for (let i = 0; i < 28; i++) {
        const mat = new THREE.MeshStandardMaterial({
          color: colors[i % colors.length],
          side: THREE.DoubleSide,
          roughness: 0.3,
          metalness: 0.15,
          transparent: true,
          opacity: 0.85,
        });

        const mesh = new THREE.Mesh(mapleGeo, mat);
        const scale = 0.38 + Math.random() * 0.45;
        mesh.scale.set(scale, scale, scale);

        const radius = 3.2 + Math.random() * 2.9;
        const angle = Math.random() * Math.PI * 2;

        mesh.position.set(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          (Math.random() - 0.5) * 3
        );

        group.add(mesh);
        newItems.push({
          mesh,
          rotSpeed: new THREE.Vector3(
            (Math.random() - 0.5) * 0.025,
            (Math.random() - 0.5) * 0.03,
            (Math.random() - 0.5) * 0.02
          ),
          velocity: new THREE.Vector3(0.45 + Math.random() * 0.45, 0, 0),
          baseY: mesh.position.y,
          phase: Math.random() * Math.PI * 2,
          radius,
          angle,
        });
      }
    } else {
      // WINTER: 3D Crystalline Ice Prisms & Frost Snowflakes
      const iceGeo = new THREE.IcosahedronGeometry(0.28, 0);
      const colors = [0x88a2b5, 0xa4c3d2, 0xbed4e0, 0x6e889b];

      for (let i = 0; i < 26; i++) {
        const mat = new THREE.MeshStandardMaterial({
          color: colors[i % colors.length],
          roughness: 0.1,
          metalness: 0.5,
          transparent: true,
          opacity: 0.8,
        });

        const mesh = new THREE.Mesh(iceGeo, mat);
        const scale = 0.4 + Math.random() * 0.5;
        mesh.scale.set(scale, scale, scale);

        const radius = 3.3 + Math.random() * 2.7;
        const angle = Math.random() * Math.PI * 2;

        mesh.position.set(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          (Math.random() - 0.5) * 2.5
        );

        group.add(mesh);
        newItems.push({
          mesh,
          rotSpeed: new THREE.Vector3(0.012, 0.018, 0.012),
          velocity: new THREE.Vector3(0.4 + Math.random() * 0.4, 0, 0),
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
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden ${className}`}
      aria-hidden="true"
    />
  );
}
