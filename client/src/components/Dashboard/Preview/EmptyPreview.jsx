// @ts-check
import React from "react";

/**
 * Renders an empty preview pane.
 * @returns {JSX.Element}
 */
function EmptyPreview() {
  return (
    <div
      className="card thin-scrollbar"
      id="preview-card"
      style={{
        fontSize: "x-large",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      Select something to see more details or to modify it.
    </div>
  );
}

export default EmptyPreview;
