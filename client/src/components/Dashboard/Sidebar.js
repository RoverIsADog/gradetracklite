import React, { useContext } from "react";
import "../../css/dashboard/sidebar.css";
import logoImg from "../../img/logo.png";
import darkModeIco from "../../img/day-night-sun-moon-cycle-svgrepo-com.svg";
import semestersIco from "../../img/calendar-svgrepo-com.svg";
import coursesIco from "../../img/education-books-apple-svgrepo-com.svg";
import plusIco from "../../img/plus-svgrepo-com.svg";
import identicon from "../../img/identicon.png"; // TODO procedurally generate based on username??
import logoutIco from "../../img/sign-out-2-svgrepo-com.svg";
import privacyIco from "../../img/contract-line-svgrepo-com.svg";
import { useNavigate } from "react-router-dom";
import { contextDark } from "../../pages/Dashboard";

function Sidebar(semesterList, courseList) {
  const navigate = useNavigate();
  const handleLogout = () => {
    console.log("Logging out")
    console.log("TODO: clear session cookie/storage")
    navigate("/");
  };

  const contDark = useContext(contextDark);
  console.log(contDark.darkMode)
  console.log(contDark.toggleDarkMode)

  return (
    <div id="sidebar-container">
      <div className="card thin-scrollbar" id="sidebar-card">
        {/* Logo */}
        <div id="sb-logo-container">
          <img src={logoImg} className="not-icon" style={{ height: "3rem" }} alt="Logo" />
          <div style={{ flexGrow: 1 }} />
          <img src={darkModeIco} className="toggle-dark sb-selectable" alt="Dark mode icon" onClick={(e) => contDark.toggleDarkMode()} />
        </div>
        <div className="horizontal-line" />

        {/* Semester list */}
        <div className="sb-choice" id="semesters-container">
          {/* List header (img, name, +) */}
          <div className="sb-choice-header">
            <img className="sb-choice-header-ico" src={semestersIco} alt="Semester icon" />
            <div className="sb-choice-header-name">Semesters</div>
            <img className="sb-choice-header-plus sb-selectable" src={plusIco} alt="Plus icon" />
          </div>
          {/* List of semesters */}
          <div className="sb-choice-list thin-scrollbar">
            <div className="sb-choice-list-element sb-selectable">Winter 2023</div>
            <div className="sb-choice-list-element sb-selectable">Summer 2023</div>
            <div className="sb-choice-list-element sb-selectable">Fall 2023</div>
            <div className="sb-choice-list-element sb-selectable">Winter 2024</div>
            <div className="sb-choice-list-element sb-selectable sb-selected">Summer 2024</div>
            <div className="sb-choice-list-element sb-selectable">Fall 2024</div>
            <div className="sb-choice-list-element sb-selectable">Winter 2025</div>
            <div className="sb-choice-list-element sb-selectable">Summer 2025</div>
            <div className="sb-choice-list-element sb-selectable">Fall 2025</div>
          </div>
        </div>
        <div className="horizontal-line" />

        {/* Courses list */}
        <div className="sb-choice" id="courses-container">
          {/* List header (img, name, +) */}
          <div className="sb-choice-header">
            <img className="sb-choice-header-ico" src={coursesIco} alt="Courses icon" />
            <div className="sb-choice-header-name">Courses</div>
            <img className="sb-choice-header-plus sb-selectable" src={plusIco} alt="Plus icon" />
          </div>
          <div className="sb-choice-list thin-scrollbar">
            <div className="sb-choice-list-element sb-selectable">COMP 111</div>
            <div className="sb-choice-list-element sb-selectable">COMP 222</div>
            <div className="sb-choice-list-element sb-selectable">COMP 333</div>
            <div className="sb-choice-list-element sb-selectable sb-selected">COMP 444</div>
            <div className="sb-choice-list-element sb-selectable">COMP 555</div>
            <div className="sb-choice-list-element sb-selectable">COMP 666</div>
            <div className="sb-choice-list-element sb-selectable">COMP 777</div>
          </div>
        </div>
        <div className="horizontal-line" />
        {/* GPA container */}
        <div className="sidebar-item" id="gpa-container">
          <span className="color-good">3.3</span>&nbsp;CGPA
        </div>
        {/* Padding */}
        <div style={{ flexGrow: 1 }} />
        {/* User */}
        <div className="sb-selectable" id="user-container">
          {/* We're not actually storing any user pfp this just is just a random gravatar. */}
          <img src={identicon} className="not-icon" alt="identicon" />
          <div>
            <div id="username">UserNameThatIsWayTooLongForItsOwnGood</div>
            <div>Account Settings</div>
          </div>
        </div>

        {/* Sign out */}
        <div className="sb-item sb-selectable" id="logout" onClick={handleLogout} >
          <img src={logoutIco} alt="logout" />
          <div>Sign out</div>
        </div>
        {/* Privacy */}
        {/* Sign out */}
        <div className="sb-item sb-selectable" id="privacy">
          <img src={privacyIco} alt="privacy" />
          <div>Privacy and Terms</div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
