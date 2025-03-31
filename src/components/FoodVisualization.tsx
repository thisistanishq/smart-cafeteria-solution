
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface FoodVisualizationProps {
  className?: string;
}

export const FoodVisualization: React.FC<FoodVisualizationProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Setup scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x001a4a); // Dark navy
    
    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      75, 
      containerRef.current.clientWidth / containerRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.z = 20;
    
    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0x002b91, 1, 100);
    pointLight.position.set(0, 10, 5);
    scene.add(pointLight);
    
    // Create a group to hold all objects
    const foodGroup = new THREE.Group();
    scene.add(foodGroup);
    
    // Create plate
    const plateGeometry = new THREE.CylinderGeometry(10, 10, 1, 32);
    const plateMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const plate = new THREE.Mesh(plateGeometry, plateMaterial);
    plate.position.y = -2;
    foodGroup.add(plate);
    
    // Function to create random food items
    const createFoodItem = (type: string, x: number, y: number, z: number) => {
      let geometry, material;
      
      switch(type) {
        case 'dosa':
          // Create a cone for dosa
          geometry = new THREE.ConeGeometry(2, 7, 32);
          material = new THREE.MeshPhongMaterial({ 
            color: 0xf0e68c,
            flatShading: true
          });
          break;
        case 'rice':
          // Create a sphere for rice
          geometry = new THREE.SphereGeometry(2, 32, 32);
          material = new THREE.MeshPhongMaterial({ 
            color: 0xffffff,
            flatShading: true 
          });
          break;
        case 'curry':
          // Create a small cylinder for curry
          geometry = new THREE.CylinderGeometry(1.5, 1.5, 1, 32);
          material = new THREE.MeshPhongMaterial({ 
            color: 0xff9933,
            flatShading: true 
          });
          break;
        case 'samosa':
          // Create a tetrahedron for samosa
          geometry = new THREE.TetrahedronGeometry(1.5);
          material = new THREE.MeshPhongMaterial({ 
            color: 0xcd853f,
            flatShading: true 
          });
          break;
        default:
          // Default is a box
          geometry = new THREE.BoxGeometry(1, 1, 1);
          material = new THREE.MeshPhongMaterial({ 
            color: 0x00ff00,
            flatShading: true 
          });
      }
      
      const foodItem = new THREE.Mesh(geometry, material);
      foodItem.position.set(x, y, z);
      foodItem.rotation.set(
        Math.random() * Math.PI, 
        Math.random() * Math.PI, 
        Math.random() * Math.PI
      );
      foodItem.userData = { type, floatSpeed: 0.005 + Math.random() * 0.01 };
      
      return foodItem;
    };
    
    // Add food items to the plate
    const foodItems = [
      createFoodItem('dosa', -5, 0, 0),
      createFoodItem('rice', 0, 0, 0),
      createFoodItem('curry', 5, 0, 0),
      createFoodItem('samosa', 3, 0, 5),
      createFoodItem('curry', -3, 0, -5),
      createFoodItem('dosa', 6, 0, -2),
      createFoodItem('samosa', -6, 0, 2),
    ];
    
    foodItems.forEach(item => foodGroup.add(item));
    
    // Add steam particles
    const steamParticles: THREE.Mesh[] = [];
    const steamGeometry = new THREE.SphereGeometry(0.2, 8, 8);
    const steamMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xffffff,
      transparent: true,
      opacity: 0.6
    });
    
    for (let i = 0; i < 30; i++) {
      const particle = new THREE.Mesh(steamGeometry, steamMaterial);
      const x = (Math.random() - 0.5) * 15;
      const z = (Math.random() - 0.5) * 15;
      particle.position.set(x, 0, z);
      particle.userData = {
        speed: 0.03 + Math.random() * 0.03,
        offset: Math.random() * Math.PI * 2
      };
      steamParticles.push(particle);
      scene.add(particle);
    }
    
    // Setup orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      
      time += 0.01;
      
      // Animate food items
      foodItems.forEach(item => {
        const floatSpeed = item.userData.floatSpeed;
        item.position.y = Math.sin(time + item.position.x) * 0.5 + 1;
        item.rotation.y += 0.01;
      });
      
      // Animate steam particles
      steamParticles.forEach(particle => {
        particle.position.y += particle.userData.speed;
        particle.position.x += Math.sin(time + particle.userData.offset) * 0.01;
        particle.position.z += Math.cos(time + particle.userData.offset) * 0.01;
        particle.material.opacity -= 0.002;
        
        if (particle.position.y > 10 || particle.material.opacity <= 0) {
          particle.position.y = 0;
          particle.position.x = (Math.random() - 0.5) * 15;
          particle.position.z = (Math.random() - 0.5) * 15;
          particle.material.opacity = 0.6;
        }
      });
      
      foodGroup.rotation.y += 0.003;
      
      controls.update();
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Cleanup
    return () => {
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
      
      // Dispose of resources
      foodItems.forEach(item => {
        item.geometry.dispose();
        (item.material as THREE.Material).dispose();
      });
      
      steamParticles.forEach(particle => {
        particle.geometry.dispose();
        (particle.material as THREE.Material).dispose();
      });
      
      plateGeometry.dispose();
      plateMaterial.dispose();
      
      renderer.dispose();
    };
  }, []);
  
  return (
    <div ref={containerRef} className={`w-full h-full min-h-[400px] ${className}`} />
  );
};
