import React, { useState, useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Shadow } from '@react-three/drei';
import * as THREE from 'three';
import stores from '../stores'; // Import the store data
import StoreModel from './StoreModel'; // Import the StoreModel component

function Mall({ selectedStore, onStoreClick }) {
  const groupRef = useRef();
  const { camera } = useThree();
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (selectedStore !== null && selectedStore >= 0 && selectedStore < stores.length) {
      const store = stores[selectedStore];
      const angle = (selectedStore / stores.length) * Math.PI * 2;
      const x = Math.sin(angle) * 8;
      const z = Math.cos(angle) * 8;
      const targetPosition = new THREE.Vector3(x * 1.5, 2, z * 1.5);

      const distance = 10; 
      const cameraPosition = new THREE.Vector3(
        targetPosition.x + Math.sin(angle) * distance / 1.2,
        targetPosition.y + distance / 15,
        targetPosition.z + Math.cos(angle) * distance / 1.2
      );

      const duration = 1000; 
      const startPosition = camera.position.clone();
      const endPosition = cameraPosition;

      const startRotation = camera.rotation.clone();
      const endRotation = new THREE.Euler(
        Math.atan2(targetPosition.y - camera.position.y, targetPosition.z - camera.position.z),
        Math.atan2(targetPosition.x - camera.position.x, targetPosition.z - camera.position.z),
        0
      );

      let startTime = performance.now();

      const animate = (time) => {
        let elapsed = time - startTime;
        let progress = Math.min(elapsed / duration, 1);

        camera.position.lerpVectors(startPosition, endPosition, progress);
        camera.rotation.set(
          THREE.MathUtils.lerp(startRotation.x, endRotation.x, progress),
          THREE.MathUtils.lerp(startRotation.y, endRotation.y, progress),
          0
        );
        camera.lookAt(targetPosition);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [selectedStore, camera]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = rotation;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh rotation={[-Math.PI / 1, 0, 0]} receiveShadow>
        <cylinderGeometry args={[100, 10, 0.5, 64]} />
        <meshStandardMaterial color="#ffcad4" />

      </mesh>

      <mesh rotation={[Math.PI / 1, 0, 0]} position={[0, 6, 0]}>
        <cylinderGeometry args={[100, 10, 0.5, 64]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>

      {stores.map((store, index) => {
        const angle = (index / stores.length) * Math.PI * 2;
        const x = Math.sin(angle) * 8;
        const z = Math.cos(angle) * 8;
        return (
          <group key={index}>
            <StoreModel
              position={[x * 1.5, 1, z * 1.5]}
              rotation={[0, angle + Math.PI*2, 0]}
              color={store.color}
              name={store.name}
              modelUrl={store.modelUrl} // Pass the model URL to the StoreModel component
              onClick={() => onStoreClick(index)}
            />
            <pointLight position={[x*2, 5, z*2]} intensity={10.5} distance={100} castShadow>
            </pointLight>
          </group>
        );
      })}
    </group>
  );
}

export default Mall;
