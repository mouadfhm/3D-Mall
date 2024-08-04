import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Mall from './components/mall';
import SideMenu from './components/sidemenu';
import stores from './stores';

function App() {
  const [selectedStore, setSelectedStore] = useState(null);

  const handleSelectStore = (index) => {
    setSelectedStore(index);
  };

  const handleStoreVisible = (index) => {
    setSelectedStore(index);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex' }}>
      <SideMenu selectedStore={selectedStore} onSelectStore={handleSelectStore} />
      <div style={{ width: 'calc(100% )', height: '100%' }}>
        <Canvas shadows camera={{ fov: 75 }} gl={{ alpha: false }} fog={{ color: '#ffcad4', near: 20, far: 50 }}>
          <color attach="background" args={['#ffcad4']} />
          <ambientLight intensity={0.3} />
          <Mall
            selectedStore={selectedStore}
            onStoreClick={handleSelectStore}
            onStoreVisible={handleStoreVisible}
            stores={stores} // Ensure stores prop is passed here
          />
        </Canvas>
      </div>
    </div>
  );
}

export default App;
