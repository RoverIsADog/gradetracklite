import React from 'react'

function PreviewItemNormal({ name, children }) {
  return (
    <div className="preview-item">
      <div className="preview-item-name">{name}</div>
      {children}
    </div>
  );
}

export default PreviewItemNormal;