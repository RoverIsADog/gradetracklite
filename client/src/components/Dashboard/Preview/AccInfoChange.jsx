// @ts-check
import { apiLocation } from '@/App';
import React, { useContext, useState } from 'react'
import { networkPost } from '@/utils/NetworkUtils';
import PreviewItemNormal from '../CoursePreview/ItemNormal';
import LoadingButton from '../common/LoadingButton';

/**
 * Preview component for changing the user's username.
 * @returns {JSX.Element}
 */
function PreviewAccChangeInfo() {
  const apiURL = useContext(apiLocation);

  const [newUsername, setNewUsername] = useState("");
  // const [newEmail, setNewEmail] = useState("");

  const handleChangeInfo = (btnDone, btnErr) => {
    if (!newUsername) {
      alert("Can't use an empty username");
      btnErr("Can't use an empty username");
      return;
    }
    
    networkPost(`${apiURL}/account/edit/info`, {
      username: newUsername,
      email: "" /*newEmail*/
    }).then((res) => {
      // TODO fix 
      alert("Account information updated. They will take effect on next login");
      document.cookie = `token=${res.token}; SameSite=Strict`;
      btnDone();
    }).catch((err) => {
      alert(`Failed to change account information.\n${err}`);
      btnErr(err);
    })
  };

  return (
    <div className="card thin-scrollbar" id="preview-card">
      <div className="preview-name">Edit Account Info</div>
      
      <div className="preview-item preview-text">
        You can change your username here. <b>We recommend you do not put any personally identifiable information in your username</b>
      </div>

      <PreviewItemNormal name={`Username`} >
      <label htmlFor="Old Password" />
        <input
          className={`dash-input`}
          type="text"
          name="New Username"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          style={{width: "100%"}}
        />
      </PreviewItemNormal>

      {/* <PreviewItemNormal name={`Email`} >
      <label htmlFor="Old Password" />
        <input
          className={`dash-input`}
          type="email"
          name="New Email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          style={{width: "100%"}}
        />
      </PreviewItemNormal> */}

      <div style={{ flexGrow: "1" }}></div>
      <div className="preview-item preview-buttons">
        <LoadingButton name="Save" longFunction={handleChangeInfo} />
      </div>
    </div>
  );
}

export default PreviewAccChangeInfo;