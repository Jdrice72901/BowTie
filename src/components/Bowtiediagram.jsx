import React, { useEffect, useState } from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import ELK from 'elkjs';
import sampleData from '../data/samplediagram.json';

const elk = new ELK();

const BowtieDiagram = ({darkMode}) => {
  const [elements, setElements] = useState({ nodes: [], edges: [] });
  const [selectedNode, setSelectedNode] = useState(null);
  const [collapsedNodes, setCollapsedNodes] = useState([]);
  const [failedNodes, setFailedNodes] = useState([]);

  const getDownstreamEdges = (startId) => {
    const downstreamEdges = [];
    const visited = new Set();

    const traverse = (nodeId) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);

      for (const edge of sampleData.edges) {
        if (edge.source === nodeId) {
          downstreamEdges.push(`${edge.source}-${edge.target}`);
          const nextNode = sampleData.nodes.find(n => n.id === edge.target);
          if (nextNode && nextNode.type !== 'barrier') {
            traverse(edge.target);
          }
        }
      }
    };

    traverse(startId);
    return downstreamEdges;
  };

  useEffect(() => {
    const layoutGraph = async () => {
      const graph = {
        id: 'root',
        layoutOptions: { 'elk.algorithm': 'layered', 'elk.direction': 'RIGHT' },
        children: sampleData.nodes.map(node => ({
          id: node.id,
          width: 180,
          height: 80,
          labels: [{ text: node.label }]
        })),
        edges: sampleData.edges.map(edge => ({
          id: `${edge.source}-${edge.target}`,
          sources: [edge.source],
          targets: [edge.target]
        }))
      };

      const layout = await elk.layout(graph);

      console.log('Failed nodes:', failedNodes);

      const nodes = layout.children.map(n => {
        const nodeData = sampleData.nodes.find(nd => nd.id === n.id);
        const symbol = nodeData.status.includes('Human') ? '👤' :
                       nodeData.status.includes('Hardware') ? '⚙️' : '';

        let highlightConsequence = false;
        if (nodeData.type === 'consequence') {
          const incomingEdges = sampleData.edges.filter(e => e.target === nodeData.id);
          const relatedBarriers = incomingEdges.map(e => e.source);
          highlightConsequence = relatedBarriers.every(b => failedNodes.includes(b));
        }

        return {
          id: n.id,
          data: {
            label: `${symbol} ${nodeData.label}`,
            description: nodeData.description,
            status: nodeData.status,
            type: nodeData.type
          },
          position: { x: n.x, y: n.y },
          style: {
            border: `3px solid ${nodeData.color}`,
            padding: 10,
            borderRadius: 8,
            background: highlightConsequence ? '#ffcccc' :
                        failedNodes.includes(n.id) ? '#ff4d4d' : '#fff'
          }
        };
      });

      const edges = layout.edges.map(e => {
        const edgeId = e.id;
        const highlight = failedNodes.some(failedId => {
          const downstream = getDownstreamEdges(failedId);
          console.log(`Failed barrier: ${failedId}, Downstream edges:`, downstream);
          return downstream.includes(edgeId);
        });

        console.log(`Edge ${edgeId} highlight:`, highlight);

        return {
          id: edgeId,
          source: e.sources[0],
          target: e.targets[0],
          style: {
            
              stroke: highlight ? 'red' : darkMode ? '#ffffff' : '#000000', // ✅ White in dark mode
              strokeWidth: highlight ? 3 : 1

          }
        };
      });

      setElements({ nodes, edges });
    };

    layoutGraph();
  }, [failedNodes, darkMode]);

  const onNodeClick = (_, node) => {
    setSelectedNode(node); // ✅ store full node object
  };

  const onNodeDoubleClick = (_, node) => {
    if (node.data.type === 'threat') {
      const connectedBarriers = sampleData.edges
        .filter(e => e.source === node.id)
        .map(e => e.target);

      setCollapsedNodes(prev => {
        const isCollapsed = connectedBarriers.every(id => prev.includes(id));
        return isCollapsed
          ? prev.filter(id => !connectedBarriers.includes(id))
          : [...prev, ...connectedBarriers];
      });
    }

    if (node.data.type === 'consequence') {
      const connectedBarriers = sampleData.edges
        .filter(e => e.target === node.id)
        .map(e => e.source);

      setCollapsedNodes(prev => {
        const isCollapsed = connectedBarriers.every(id => prev.includes(id));
        return isCollapsed
          ? prev.filter(id => !connectedBarriers.includes(id))
          : [...prev, ...connectedBarriers];
      });
    }
  };

  const toggleScenario = (nodeId) => {
    setFailedNodes(prev => {
      const isFailed = prev.includes(nodeId);
      const updated = isFailed ? prev.filter(id => id !== nodeId) : [...prev, nodeId];
      console.log('Updated failedNodes:', updated);
      return updated;
    });
  };

  const visibleNodes = elements.nodes.filter(n => !collapsedNodes.includes(n.id));
  const visibleEdges = elements.edges.filter(e =>
    visibleNodes.some(n => n.id === e.source) && visibleNodes.some(n => n.id === e.target)
  );

  return (
    <div style={{ width: '100%', height: '600px', display: 'flex' }}>
      <div style={{ flex: 3 }}>
        <ReactFlow
          nodes={visibleNodes}
          edges={visibleEdges}
          fitView
          onNodeClick={onNodeClick}
          onNodeDoubleClick={onNodeDoubleClick}
          defaultEdgeOptions={{ style: { 
              stroke: darkMode ? '#ffffff' : '#000000', // White edges in dark mode
              strokeWidth: 1
          } 
        }}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
      <div style={{ flex: 1, padding: '10px', borderLeft: '1px solid #ccc' }}>
        {selectedNode ? (
          <div>
            <h3>{selectedNode.data.label}</h3>
            <p>{selectedNode.data.description}</p>
            <p>Status: <strong>{selectedNode.data.status}</strong></p>
            {selectedNode.data.type === 'barrier' && (
              <button
                style={{
                  marginTop: '10px',
                  padding: '8px 12px',
                  backgroundColor: failedNodes.includes(selectedNode.id) ? '#ff4d4d' : '#4CAF50',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                onClick={() => toggleScenario(selectedNode.id)} // ✅ now passes correct ID
              >
                {failedNodes.includes(selectedNode.id) ? 'Restore Barrier' : 'Fail Barrier'}
              </button>
            )}
          </div>
        ) : (
          <p>Click a node to see details</p>
        )}
      </div>
    </div>
  );
};

export default BowtieDiagram;