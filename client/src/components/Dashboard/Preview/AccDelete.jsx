// @ts-check
import { apiLocation } from "App";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { networkPost } from "utils/NetworkUtils";
import LoadingButton from "../common/LoadingButton";

/**
 * Preview component deleting a user's account.
 * @returns {JSX.Element}
 */
function PreviewAccDelete() {
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
      <div className="preview-item preview-text">
        You can request to delete your account and all associated data from the system. Please read
        your host's privacy notice or ask them as to whether they have a data retention policy
      </div>
      <div style={{ flexGrow: "1" }}></div>
      <div className="preview-item preview-buttons">
        <LoadingButton name="Delete" longFunction={handleDelete} />
      </div>
    </div>
  );
}

export default PreviewAccDelete;
