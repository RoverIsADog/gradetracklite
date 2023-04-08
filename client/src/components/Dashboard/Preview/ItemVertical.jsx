// @ts-check
import React from "react";

/**
 * Represents an item in the preview pane that is larger
 * @param {{ico: any, name: string, children?: React.ReactNode}} props
 * @returns 
 */
function PreviewItemVertical({ico, name, children}) {
  return (
    <div className="preview-item preview-vertical">
      <div className="preview-vertical-about">
        <img className="preview-item-ico" src={ico} alt={`${name} icon`} />
        <div className="preview-item-name">{name}</div>
      </div>
      {children}
    </div>
  );
}

export default PreviewItemVertical;
