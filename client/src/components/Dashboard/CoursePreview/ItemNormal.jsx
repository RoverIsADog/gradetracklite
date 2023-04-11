import React from 'react'

/**
 * Represents an item in the preview pane that is normal sized
 * @param {{name: string, children?: React.ReactNode}} props
 * @returns {JSX.Element} 
 */
function PreviewItemNormal({ name, children }) {
  return (
    <div className="preview-item">
      <div className="preview-item-name">{name}</div>
      {children}
    </div>
  );
}

export default PreviewItemNormal;