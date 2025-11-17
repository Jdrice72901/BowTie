import React, { useState } from 'react';
import BowtieDiagram from './components/Bowtiediagram';
import Legend from './components/legend';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const appStyle = {
    backgroundColor: darkMode ? '#121212' : '#ffffff',
    color: darkMode ? '#ffffff' : '#000000',
    minHeight: '100vh',
    padding: '20px'
  };

  return (
    <div style={appStyle}>
      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          marginBottom: '10px',
          padding: '8px 12px',
          backgroundColor: darkMode ? '#333' : '#ddd',
          color: darkMode ? '#fff' : '#000',
          border: 'none',
          borderRadius: '4px'
        }}
      >
        Toggle {darkMode ? 'Light' : 'Dark'} Mode
      </button>
      <h1>Bowtie Risk Diagram</h1>
      <div style={{ display: 'flex', gap: '20px' }}>
        <BowtieDiagram />
        <Legend />
      </div>
    </div>
  );
}

export default App;