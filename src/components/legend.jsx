
import React from 'react';

const Legend = ({darkMode}) => (
  <div style={{
    padding: '10px',
    border: '1px solid #ccc',
    marginTop: '10px',
    
    background: darkMode ? '#1e1e1e' : '#f9f9f9', // Dark but lighter than page
    color: darkMode ? '#ffffff' : '#000000',

    borderRadius: '8px'
  }}>
    <h4>Legend</h4>
    <p>👤 Human Intervention</p>
    <p>⚙️ Hardware Intervention</p>
    
    <p>
      <span style={{
        display: 'inline-block',
        width: '20px',
        height: '20px',
        backgroundColor: '#ff4d4d',
        border: '1px solid #000',
        marginRight: '8px'
      }}></span>
      Failed Barrier
    </p>

    <p><span style={{ color: 'red' }}>Red Path</span> = Downstream failure</p>
  </div>
);

export default Legend;