import React, { useState } from 'react';
import BowtieDiagram from './components/Bowtiediagram';
import Legend from './components/legend';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const appStyle = {
    backgroundColor: darkMode ? '#222121ff' : '#ffffff',
    color: darkMode ? '#ffffff' : '#222121ff',
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
          backgroundColor: darkMode ? '#222121ff' : '#ddd',
          color: darkMode ? '#fff' : '#222121ff',
          border: 'none',
          borderRadius: '4px'
        }}
      >
        Toggle {darkMode ? 'Light' : 'Dark'} Mode
      </button>
      <h1>Bowtie Risk Diagram</h1>
      <div style={{ display: 'flex', gap: '20px' }}>
        <BowtieDiagram darkMode={darkMode}/>
        <Legend darkMode={darkMode} />
      </div>
    </div>
  );
}

export default App;