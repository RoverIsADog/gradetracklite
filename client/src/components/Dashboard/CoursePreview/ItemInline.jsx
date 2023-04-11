// @ts-check
import React from "react";

/**
 * Represents an item in the preview pane that is one line big
 * @param {{ico: any, name: string, children?: React.ReactNode}} props
 * @returns 
 */
function PreviewItemInline({ico, name, children}) {
  return (
    <div className="preview-item preview-inline">
      <div className="preview-inline-left">
        <img className="preview-item-ico" src={ico} alt={`${name} icon`} />
        <div className="preview-item-name">{name}</div>
      </div>
      <div className="preview-inline-right">
        {children}
      </div>
    </div>
  );
}

export default PreviewItemInline;
