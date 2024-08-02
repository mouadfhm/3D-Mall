import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useFrame, useThree, extend } from '@react-three/fiber';
import { Text, Shadow } from '@react-three/drei';
import { SphereGeometry } from 'three';
import * as THREE from 'three';

// Extend R3F to include SphereGeometry
extend({ SphereGeometry });

function useSmoothScroll(speed = 0.1) {
  const [target, setTarget] = useState(0);
  const current = useRef(0);

  useFrame(() => {
    current.current += (target - current.current) * speed;
  });

  return [current, setTarget];
}

function Store({ position, color, name, rotation, onClick }) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const meshRef = useRef();

  return (
    <group position={position} rotation={rotation}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[4, 3, 4]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Shadow opacity={0.3} scale={[4, 4, 1]} position={[0, -1.5, 0]} />
      {hovered && (
        <Text position={[0, 2, 2.1]} fontSize={0.5} color="black" anchorX="center" anchorY="middle">
          {name}
        </Text>
      )}
      {clicked && (
        <Text position={[0, -2, 2.1]} fontSize={0.3} color="black" anchorX="center" anchorY="middle">
          Click to enter {name}
        </Text>
      )}
    </group>
  );
}

function Mall({ selectedStore, onStoreClick, onStoreVisible, stores }) {
  const [rotation, setRotation] = useSmoothScroll();
  const groupRef = useRef();
  const { camera, scene } = useThree();

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [cameraAngle, setCameraAngle] = useState(0);
  const [cameraRadius, setCameraRadius] = useState(10);

  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (isDragging) {
        const deltaX = (e.clientX - dragStart.x) * 0.005;
        const deltaY = (e.clientY - dragStart.y) * 0.005;

        setCameraAngle((prevAngle) => prevAngle + deltaX);
        setCameraRadius((prevRadius) => Math.max(5, prevRadius - deltaY));

        const currentStorePosition = new THREE.Vector3(
          Math.sin(-rotation.current) * 8 * 1.5,
          1.5,
          Math.cos(-rotation.current) * 8 * 1.5
        );

        const x = currentStorePosition.x + Math.sin(cameraAngle) * cameraRadius;
        const z = currentStorePosition.z + Math.cos(cameraAngle) * cameraRadius;

        camera.position.set(x, camera.position.y, z);
        camera.lookAt(currentStorePosition);
      }
    },
    [isDragging, dragStart, camera, cameraAngle, cameraRadius, rotation]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    const currentStorePosition = new THREE.Vector3(
      Math.sin(-rotation.current) * 8 * 1.5,
      1.5,
      Math.cos(-rotation.current) * 8 * 1.5
    );
    const defaultPosition = currentStorePosition.clone().add(new THREE.Vector3(0, 0, cameraRadius));
    camera.position.set(defaultPosition.x, camera.position.y, defaultPosition.z);
    camera.lookAt(currentStorePosition);
  }, [camera, rotation, cameraRadius]);

  useEffect(() => {
    scene.fog = new THREE.Fog('#f0f0f0', 10, 30);
    const handleWheel = (e) => {
      setRotation((current) => current - e.deltaY * 0.001);
    };
    window.addEventListener('wheel', handleWheel);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseDown, handleMouseMove, handleMouseUp, setRotation, scene]);

  useEffect(() => {
    if (selectedStore !== null) {
      const angle = (selectedStore / stores.length) * Math.PI * 2;
      setRotation(-angle);
      const x = Math.sin(angle) * 8;
      const z = Math.cos(angle) * 8;
      const targetPosition = [x * 1.5, 1.5, z * 1.5];
      camera.position.set(targetPosition[0] + 10, targetPosition[1] + 2, targetPosition[2] + 10); // Initial camera position
      camera.lookAt(targetPosition[0], targetPosition[1], targetPosition[2]);
      setCameraAngle(0); // Reset camera angle
      setCameraRadius(10); // Reset camera radius
    }
  }, [selectedStore, stores.length, setRotation, camera]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = rotation.current;

      const radius = 5;
      const height = 1.5;
      const angle = -rotation.current;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;

      camera.position.set(x, height, z);

      const lookAtRadius = radius + 3;
      const lookAtX = Math.sin(angle) * lookAtRadius;
      const lookAtZ = Math.cos(angle) * lookAtRadius;
      camera.lookAt(lookAtX, height, lookAtZ);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh rotation={[-Math.PI / 1, 0, 0]} receiveShadow>
        <cylinderGeometry args={[100, 10, 0.5, 64]} />
        <meshStandardMaterial color="#D8FFDD" />
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
            <Store
              position={[x * 1.5, 1.5, z * 1.5]}
              rotation={[0, angle + Math.PI, 0]}
              color={store.color}
              name={store.name}
              onClick={() => onStoreClick(index)}
            />
            <pointLight position={[x, 5, z]} intensity={10.5} distance={100} castShadow>
              <mesh>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshBasicMaterial color="#ffff00" />
              </mesh>
            </pointLight>
          </group>
        );
      })}
    </group>
  );
}

export default Mall;
