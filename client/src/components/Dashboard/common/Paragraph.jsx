import React, { useState } from 'react'

/**
 * Represents a paragraph to be used in about pages and the privacy notice
 * popup. Pass its contents as children.
 * @param {{name: string, children?: React.ReactNode}} param0 
 * @returns 
 */
function Paragraph( {name, children} ) {
  const [hidden, setHidden] = useState(false);
  
  return (
    <div>
      <div
        style={{ fontSize: "xx-large", cursor: "pointer" }}
        onClick={() => setHidden((prev) => !prev)}
        title="Click to hide"
      >
        {name}
      </div>
      <div className="horizontal-line" />
      <div style={{
        padding: hidden ? "0 1rem" : "1rem",
        margin: hidden ? "0 1rem" : "1rem",
        border: hidden ? "none" : "solid",
        transition: "0.5s",
        overflow: "hidden",
        height: hidden ? "0" : ""
        // display: hidden ? "none" : "block"
      }}>
        {children}
      </div>
      {hidden && <div>Click the header to unhide paragraph</div>}
    </div>
  );
}

export default Paragraph;