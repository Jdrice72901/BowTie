import React from 'react';

const Sidepanel = ({ node, onToggleScenario }) => {
  if (!node) return <p>Click a node to see details</p>;

  return (
    <div>
      <h3>{node.label}</h3>
      <p>{node.description}</p>
      <p>Status: <strong>{node.status}</strong></p>
      {node.type === 'Barrier' && (
        <button onClick={() => onToggleScenario(node.id)}>
          Toggle Scenario
        </button>
      )}
    </div>
  );
};

export default Sidepanel;