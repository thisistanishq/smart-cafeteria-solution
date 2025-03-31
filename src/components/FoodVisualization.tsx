
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface FoodVisualizationProps {
  className?: string;
}

// Food item that floats and rotates
const FloatingFood = ({ position, scale, rotation, textureUrl, name }: any) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const textureMap = useTexture(textureUrl);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Floating animation
      meshRef.current.position.y += Math.sin(clock.getElapsedTime() * 2) * 0.005;
      
      // Slow rotation
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.x += 0.002;
    }
  });
  
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          map={textureMap} 
          roughness={0.5} 
          metalness={0.2}
        />
      </mesh>
      <Text
        position={[0, -0.7, 0]}
        fontSize={0.15}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
    </group>
  );
};

// Steam particle system
const SteamParticles = ({ position }: any) => {
  const particlesRef = useRef<THREE.Points>(null);
  const particlesGeometryRef = useRef<THREE.BufferGeometry>(new THREE.BufferGeometry());
  
  React.useEffect(() => {
    if (particlesGeometryRef.current) {
      const particleCount = 50;
      const positions = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 0.5;
        positions[i3 + 1] = (Math.random()) * 0.5;
        positions[i3 + 2] = (Math.random() - 0.5) * 0.5;
        sizes[i] = Math.random() * 0.1 + 0.05;
      }
      
      particlesGeometryRef.current.setAttribute(
        'position', 
        new THREE.BufferAttribute(positions, 3)
      );
      particlesGeometryRef.current.setAttribute(
        'size', 
        new THREE.BufferAttribute(sizes, 1)
      );
    }
  }, []);
  
  useFrame(({ clock }) => {
    if (particlesRef.current && particlesGeometryRef.current) {
      const positions = particlesGeometryRef.current.attributes.position.array as Float32Array;
      const time = clock.getElapsedTime();
      
      for (let i = 0; i < positions.length; i += 3) {
        // Move particles upward slowly
        positions[i + 1] += 0.01;
        
        // Add some sideways movement
        positions[i] += Math.sin(time + i) * 0.002;
        positions[i + 2] += Math.cos(time + i) * 0.002;
        
        // Reset particles that go too high
        if (positions[i + 1] > 1.5) {
          positions[i] = (Math.random() - 0.5) * 0.5;
          positions[i + 1] = 0;
          positions[i + 2] = (Math.random() - 0.5) * 0.5;
        }
      }
      
      particlesGeometryRef.current.attributes.position.needsUpdate = true;
    }
  });
  
  return (
    <points ref={particlesRef} position={position}>
      <bufferGeometry ref={particlesGeometryRef} />
      <pointsMaterial
        color="#ffffff"
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0.6}
        fog={true}
      />
    </points>
  );
};

// Plate with food
const Plate = () => {
  const plateRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (plateRef.current) {
      // Gentle rotation for the plate
      plateRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.3;
    }
  });
  
  return (
    <group position={[0, -0.5, 0]}>
      {/* Plate */}
      <mesh ref={plateRef} receiveShadow position={[0, -0.1, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.1, 32]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.3} metalness={0.2} />
      </mesh>
      
      {/* Food items */}
      <FloatingFood 
        position={[-0.6, 0.2, 0.3]} 
        scale={[0.4, 0.2, 0.4]} 
        rotation={[0, 0, 0]} 
        textureUrl="/lovable-uploads/d23f9918-aa8f-4001-bfd2-86661da535f5.png"
        name="Dosa"
      />
      <FloatingFood 
        position={[0.6, 0.15, -0.3]} 
        scale={[0.3, 0.3, 0.3]} 
        rotation={[0, Math.PI / 4, 0]} 
        textureUrl="/lovable-uploads/d23f9918-aa8f-4001-bfd2-86661da535f5.png"
        name="Idli"
      />
      <FloatingFood 
        position={[0, 0.4, 0]} 
        scale={[0.4, 0.4, 0.4]} 
        rotation={[0, Math.PI / 6, 0]} 
        textureUrl="/lovable-uploads/d23f9918-aa8f-4001-bfd2-86661da535f5.png"
        name="Biryani"
      />
      
      {/* Steam from the food */}
      <SteamParticles position={[0, 0.5, 0]} />
    </group>
  );
};

// Animation for cooking implements
const CookingAnimation = () => {
  const spatulaRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (spatulaRef.current) {
      // Cooking animation - moving the spatula
      const t = clock.getElapsedTime();
      spatulaRef.current.rotation.z = Math.sin(t * 2) * 0.2;
      spatulaRef.current.position.x = Math.sin(t * 2) * 0.3;
    }
  });
  
  return (
    <group position={[2, 0, 0]}>
      {/* Pan */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1, 0.8, 0.3, 32]} />
        <meshStandardMaterial color="#444" roughness={0.5} metalness={0.8} />
      </mesh>
      
      {/* Spatula */}
      <mesh ref={spatulaRef} position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.1, 0.6, 0.05]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} metalness={0.2} />
      </mesh>
    </group>
  );
};

// Light rays for ambiance
const LightRays = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003;
    }
  });
  
  return (
    <group ref={groupRef}>
      {[...Array(8)].map((_, i) => (
        <mesh 
          key={i} 
          position={[0, 2, 0]} 
          rotation={[0, (i / 8) * Math.PI * 2, 0]}
        >
          <planeGeometry args={[0.1, 3]} />
          <meshBasicMaterial 
            color="#FFD700"
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
};

// Main scene setup
const Scene = () => {
  const { camera } = useThree();
  
  React.useEffect(() => {
    camera.position.set(0, 1, 5);
  }, [camera]);
  
  return (
    <>
      <OrbitControls 
        enableZoom={true} 
        enablePan={true} 
        rotateSpeed={0.5}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2}
      />
      
      {/* Ambient light for base illumination */}
      <ambientLight intensity={0.4} />
      
      {/* Directional light for shadows */}
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={1} 
        castShadow 
        shadow-mapSize-width={1024} 
        shadow-mapSize-height={1024}
      />
      
      {/* Spotlight for dramatic highlighting */}
      <spotLight 
        position={[0, 8, 0]} 
        intensity={1.5} 
        angle={0.3} 
        penumbra={0.8}
        castShadow
      />
      
      {/* Scene elements */}
      <Plate />
      <CookingAnimation />
      <LightRays />
      
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#222" roughness={0.8} metalness={0.2} />
      </mesh>
    </>
  );
};

// Main component export
export const FoodVisualization: React.FC<FoodVisualizationProps> = ({ className }) => {
  return (
    <div className={className}>
      <Canvas shadows>
        <Scene />
      </Canvas>
    </div>
  );
};
