import React, { useState, useRef, useEffect } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Text, Shadow } from '@react-three/drei';

function StoreModel({ position, color, name, rotation, onClick, modelUrl }) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [gltf, setGltf] = useState(null);

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf) => {
        setGltf(gltf.scene);
      },
      undefined,
      (error) => {
        console.error('An error happened', error);
      }
    );
  }, [modelUrl]);

  return (
    <group position={position} rotation={rotation} onClick={onClick}>
      {gltf && (
        <primitive
          object={gltf}
          scale={[0.08, 0.08, 0.08]} // Adjust the scale as needed
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          castShadow
          receiveShadow
        />
      )}
      <Shadow opacity={0.3} scale={[4, 4, 1]} position={[0, -1.5, 0]} />
      {hovered && (
        <Text position={[0, 3.3, 2.1]} fontSize={0.5} color="black" anchorX="center" anchorY="middle">
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

export default StoreModel;
