import React from 'react';
import stores from '../stores';

function SideMenu({ selectedStore, onSelectStore }) {
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
    padding: '20px',
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
