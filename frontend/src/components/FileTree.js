// components/FileTree.js
import React, { useState } from 'react';
import { sortableTreeWithoutDndContext as SortableTree } from 'react-sortable-tree';
import 'react-sortable-tree/style.css'; // This only needs to be imported once in your app

const FileTree = ({ files, setActiveFile }) => {
  const [treeData, setTreeData] = useState(createTreeData(files));

  const createTreeData = (files) => {
    // Convert files into a hierarchical structure
    const root = { title: 'root', children: [], expanded: true };
    Object.keys(files).forEach(path => {
      const parts = path.split('/');
      let current = root;
      parts.forEach((part, index) => {
        let node = current.children.find(n => n.title === part);
        if (!node) {
          node = { title: part, children: [], expanded: true };
          current.children.push(node);
        }
        if (index === parts.length - 1) node.file = true;
        current = node;
      });
    });
    return root.children;
  };

  const handleTreeChange = (treeData) => {
    setTreeData(treeData);
  };

  const handleFileClick = (file) => {
    setActiveFile(file);
  };

  return (
    <div style={{ height: 400 }}>
      <SortableTree
        treeData={treeData}
        onChange={handleTreeChange}
        generateNodeProps={({ node }) => ({
          title: (
            <span
              style={{ cursor: 'pointer' }}
              onClick={() => handleFileClick(node.key)}
            >
              {node.title}
            </span>
          ),
        })}
      />
    </div>
  );
};

export default FileTree;
