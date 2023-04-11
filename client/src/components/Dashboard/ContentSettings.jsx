// @ts-check
import React, { useState } from "react";
import "css/dashboard/content.css";
import EmptyPreview from "./Preview/EmptyPreview";
import PreviewAccChangePwd from "./Preview/AccPwdChange";
import PreviewAccDownload from "./Preview/AccDownload";
import PreviewAccDelete from "./Preview/AccDelete";
import PreviewAccChangeInfo from "./Preview/AccInfoChange";

function ContentSettings() {

  const [selected, setSelected] = useState(null);

  return (
    <div id="course-container">
      <div id="course-itself">
        <div id="course-area">
          <div
            className={`option-item selectable-item ${
              selected && selected.id === "__editinfo" && "selected-item"
            }`}
            onClick={() => setSelected({ id: "__editinfo", preview: <PreviewAccChangeInfo /> })}
          >
            Edit Account Info
          </div>

          <div
            className={`option-item selectable-item ${
              selected && selected.id === "__editpass" && "selected-item"
            }`}
            onClick={() => setSelected({ id: "__editpass", preview: <PreviewAccChangePwd /> })}
          >
            Change Password
          </div>

          <div
            className={`option-item selectable-item ${
              selected && selected.id === "__download" && "selected-item"
            }`}
            onClick={() => setSelected({ id: "__download", preview: <PreviewAccDownload /> })}
          >
            Download Data
          </div>

          <div
            className={`option-item selectable-item ${
              selected && selected.id === "__delete" && "selected-item"
            }`}
            onClick={() => setSelected({ id: "__delete", preview: <PreviewAccDelete /> })}
          >
            Delete Account
          </div>
        </div>
      </div>

      <div id="course-display">
        {selected && selected.preview ? selected.preview : <EmptyPreview />}
      </div>
    </div>
  );
}

export default ContentSettings;
