import React, { useEffect } from 'react';
import stores from '../stores';

function SideMenu({ selectedStore, onSelectStore }) {
  let timeoutId = null; // Store the timeout ID for throttling

  const handleScroll = (event) => {
    if (timeoutId) {
      clearTimeout(timeoutId); // Clear any previous timeout
    }
    
    timeoutId = setTimeout(() => {
      if (event.deltaY > 0) {
        // Scroll down
        onSelectStore((prevStore) => {
          if (prevStore === null) return 0;
          return Math.min(prevStore + 1, stores.length - 1);
        });
      } else if (event.deltaY < 0) {
        // Scroll up
        onSelectStore((prevStore) => {
          if (prevStore === null) return 0;
          return Math.max(prevStore - 1, 0);
        });
      }
    }, 100); // Adjust this value to control the sensitivity
  };

  useEffect(() => {
    window.addEventListener('wheel', handleScroll);

    return () => {
      window.removeEventListener('wheel', handleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId); // Clear timeout on unmount
      }
    };
  }, [onSelectStore]);

  return (
    <div style={styles.sideMenu}>
      <h3>Store List</h3>
      <ul style={styles.list}>
        {stores.map((store, index) => (
          <li
            key={index}
            style={{
              ...styles.listItem,
              color: index === selectedStore ? '#fff' : '#333',
            }}
            onClick={() => onSelectStore(index)}
          >
            {store.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  sideMenu: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '200px',
    height: '100%',
    padding: '2%',
    boxSizing: 'border-box',
    zIndex: 1000,
    overflowY: 'auto',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  listItem: {
    padding: '10px 0',
    cursor: 'pointer',
    transition: 'background-color 0.3s, color 0.3s',
  },
};

export default SideMenu;
