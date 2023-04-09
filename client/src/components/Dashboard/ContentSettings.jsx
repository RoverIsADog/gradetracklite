// @ts-check
import React, { useContext, useState } from "react";
import { apiLocation } from "App";
import "css/dashboard/content.css";
import { networkGet, networkPost } from "utils/NetworkUtils";
import { useNavigate } from "react-router-dom";
import EmptyPreview from "./Preview/EmptyPreview";
import LoadingButton from "./common/LoadingButton";

function ContentSettings() {
  const apiURL = useContext(apiLocation);

  const [selected, setSelected] = useState(null);

  const handlePasswordChange = () => {
    console.log("Starting password change");

    const oldPwd = window.prompt("Please confirm your old password");
    const newPwd = window.prompt("Please enter your new password");

    networkPost(`${apiURL}/account/edit/password`, { oldPassword: oldPwd, newPassword: newPwd })
      .then((res) => {
        alert("Password changed successfully");
      })
      .catch((err) => {
        alert(`Error while changing password!\n${String(err)}`);
      });
  };

  const handleInfoChange = () => {
    console.log("Starting account info change");
    const newUsername = window.prompt("Please enter a new username");
    const newEmail = window.prompt("Please enter a new email (optional)");

    networkPost(`${apiURL}/account/edit/info`, { username: newUsername, email: newEmail })
      .then((res) => {
        alert("Account info changed successfully");
      })
      .catch((err) => {
        alert(`Error while changing account info!\n${String(err)}`);
      });
  };

  return (
    <div id="course-container">
      <div id="course-itself">
        <div id="course-area">
          <div
            className={`option-item selectable-item ${
              selected && selected.id === "__editinfo" && "selected-item"
            }`}
            onClick={() => setSelected({ id: "__editinfo", preview: <AccInfo /> })}
          >
            Edit Account Info (WIP)
          </div>

          <div
            className={`option-item selectable-item ${
              selected && selected.id === "__editpass" && "selected-item"
            }`}
            onClick={() => setSelected({ id: "__editpass", preview: <AccPassword /> })}
          >
            Change Password (WIP)
          </div>

          <div
            className={`option-item selectable-item ${
              selected && selected.id === "__download" && "selected-item"
            }`}
            onClick={() => setSelected({ id: "__download", preview: <AccDownload /> })}
          >
            Download Data
          </div>

          <div
            className={`option-item selectable-item ${
              selected && selected.id === "__delete" && "selected-item"
            }`}
            onClick={() => setSelected({ id: "__delete", preview: <AccDelete /> })}
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

function AccInfo() {
  const apiURL = useContext(apiLocation);
  const navigate = useNavigate();

  const handleChangeInfo = (btnDone, btnErr) => {
    setTimeout(() => {
      btnDone();
    }, 2000);
  };

  return (
    <div className="card thin-scrollbar" id="preview-card">
      <div className="preview-name">Edit Account Info</div>
      <div className="preview-text">
        You can change your username and email (if you provided one) here. If you previously had an email and leave the input field blank, it will be removed.
      </div>
      <div style={{ flexGrow: "1" }}></div>
      <div className="preview-item preview-buttons">
        <LoadingButton name="Save" longFunction={handleChangeInfo} />
      </div>
    </div>
  );
}

function AccPassword() {
  const apiURL = useContext(apiLocation);
  const navigate = useNavigate();

  const handleChangePassword = (btnDone, btnErr) => {
    setTimeout(() => {
      btnDone();
    }, 2000);
  };

  return (
    <div className="card thin-scrollbar" id="preview-card">
      <div className="preview-name">Change Password</div>
      <div className="preview-text">
        Change your password here.
      </div>
      <div style={{ flexGrow: "1" }}></div>
      <div className="preview-item preview-buttons">
        <LoadingButton name="Save" longFunction={handleChangePassword} />
      </div>
    </div>
  );
}

function AccDownload() {
  const apiURL = useContext(apiLocation);

  const handleDownload = (btnDone, btnErr) => {
    console.log("Starting data download");

    networkGet(`${apiURL}/account/download`)
      .then((res) => {
        btnDone();

        // Save response to file
        // Credit https://stackoverflow.com/questions/34156282/how-do-i-save-json-to-local-text-file
        const a = document.createElement("a");
        var file = new Blob([res], { type: "text/plain" });
        a.href = URL.createObjectURL(file);
        a.download = "data.json";
        a.click();
      })
      .catch((err) => {
        alert(`Error while downloading data!\n${String(err)}`);
        btnErr(err);
      });
  };

  return (
    <div className="card thin-scrollbar" id="preview-card">
      <div className="preview-name">Download data</div>
      <div className="preview-text">
        You can request a download of all the data concerning this account that are stored in the
        system in an XML file format.
      </div>
      <div style={{ flexGrow: "1" }}></div>
      <div className="preview-item preview-buttons">
        <LoadingButton name="Download" longFunction={handleDownload} />
      </div>
    </div>
  );
}

function AccDelete() {
  const apiURL = useContext(apiLocation);
  const navigate = useNavigate();

  const handleDelete = (btnDone, btnErr) => {
    if (window.confirm("Are you sure you want to delete your account?") !== true) {
      btnErr(new Error("User cancellation"));
      return;
    }

    console.log("Starting account deletion request");
    networkPost(`${apiURL}/account/delete`)
      .then((res) => {
        btnDone();
        alert("Account deleted successfully! You will be logged out");
        // Delete all cookies
        document.cookie = "token=; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict";
        document.cookie = "theme=; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict";
        navigate("/");
      })
      .catch((err) => {
        btnErr(err);
        alert(`Error while deleting account!\n${String(err)}`);
      });
  };

  return (
    <div className="card thin-scrollbar" id="preview-card">
      <div className="preview-name">Delete Account</div>
      <div className="preview-text">
        You can request to delete your account and all associated data from the system.
        Please read your host's privacy notice or ask them as to whether they have a data retention policy
      </div>
      <div style={{ flexGrow: "1" }}></div>
      <div className="preview-item preview-buttons">
        <LoadingButton name="Delete" longFunction={handleDelete} />
      </div>
    </div>
  );
}

export default ContentSettings;
