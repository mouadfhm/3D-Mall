import React, { useState, useRef } from 'react';
import { useGLTF, Text, Shadow } from '@react-three/drei';

function Store({ position, color, name, rotation, onClick }) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const meshRef = useRef();
  const { scene } = useGLTF('../../public/models/small_store.glb'); // Correct path to your model

  return (
    <group position={position} rotation={rotation} onClick={onClick}>
      <primitive
        object={scene}
        scale={[1, 1, 1]} // Adjust the scale as needed
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      />
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

useGLTF.preload('C:/Users/Mouad/Documents/3d-mall-project/public/models/scene.gltf'); // Preload your model

export default Store;
