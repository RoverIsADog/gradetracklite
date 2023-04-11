import { apiLocation } from "App";
import React, { useContext, useMemo, useState } from "react";
import { passwordComplexity } from "utils/Util";
import PreviewItemNormal from "./ItemNormal";
import LoadingButton from "../common/LoadingButton";
import errorIco from "img/error-svgrepo-com.svg"
import { networkPost } from "utils/NetworkUtils";

function PreviewAccChangePwd() {
  const apiURL = useContext(apiLocation);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  const newPwdTest = useMemo(() => passwordComplexity(newPassword), [newPassword]);
  const newPwdConfirmSame = useMemo(() => newPassword === newPasswordConfirm, [newPassword, newPasswordConfirm])

  const handleChangePassword = (btnDone, btnErr) => {
    if (!newPwdTest.ok || !newPwdConfirmSame) {
      alert("New passwords are invalid or non matching");
      btnErr(new Error("New passwords are invalid or non matching"));
      return;
    }

    networkPost(`${apiURL}/account/edit/password`, { oldPassword, newPassword })
      .then((res) => {
        alert("Password changed successfully");
        btnDone();
      })
      .catch((err) => {
        alert(`Error while changing password!\n${String(err)}`);
        btnErr(err);
      });
  };
  
  return (
    <div className="card thin-scrollbar" id="preview-card">
      <div className="preview-name">Change Password</div>
      <div className="preview-item preview-text">
        Change your password here.
      </div>
      
      {/* Old password entry */}
      <PreviewItemNormal name="Old Password">
        <label htmlFor="Old Password" />
        <input
          className={`dash-input`}
          type="password"
          name="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          style={{width: "100%"}}
        />
      </PreviewItemNormal>

      {/* New password entry */}
      <PreviewItemNormal name="New Password">
        <label htmlFor="New Password" />
        <input
          className={`dash-input ${newPwdTest.ok ? "" : "dash-input-err"}`}
          type="password"
          name="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={{width: "100%"}}
        />
        <PasswordCondition name="8 or longer" fulfilled={newPwdTest.longEnough} />
        <PasswordCondition name="1 lowercase" fulfilled={newPwdTest.hasLower} />
        <PasswordCondition name="1 uppercase" fulfilled={newPwdTest.hasUpper} />
        <PasswordCondition name="1 number" fulfilled={newPwdTest.hasNumber} />
        <PasswordCondition name="1 special" fulfilled={newPwdTest.hasSpecial} />
        <PasswordCondition name="No invalid" fulfilled={newPwdTest.noInvalid} />
      </PreviewItemNormal>

      {/* Course credits entry */}
      <PreviewItemNormal name="Confirm New Password">
        <label htmlFor="Confirm New Password" />
        <input
          className={`dash-input ${newPwdConfirmSame ? "" : "dash-input-err"}`}
          type="password"
          name="Confirm New Password"
          value={newPasswordConfirm}
          onChange={(e) => setNewPasswordConfirm(e.target.value)}
          style={{width: "100%"}}
        />
        <PasswordCondition name="Doesn't match" fulfilled={newPwdConfirmSame} />
      </PreviewItemNormal>
      
      <div style={{ flexGrow: "1" }}></div>
      
      <div className="preview-item preview-buttons">
        <LoadingButton name="Save" longFunction={handleChangePassword} />
      </div>
    </div>
  );
}

export default PreviewAccChangePwd;

function PasswordCondition({ name, fulfilled }) {
  if (fulfilled) return <></>;
  return (
    <div className="password-condition">
      <img
        src={errorIco}
        className="preview-item-ico"
        style={{
          width: (fulfilled ? "0" : ""),
          padding: "0"
        }}
        alt="success"
      />
      <div style={{ margin: "0.1rem", display: (fulfilled ? "none" : "block") }}>
        {name}
      </div>
    </div>
  );
}