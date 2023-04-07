import React, { useContext, useState } from "react";
import "../../css/dashboard/sidebar.css";
import "../../css/dashboard/content.css";
import logoImg from "../../img/logo.png";
import sunIco from "../../img/sun-svgrepo-com.svg";
import moonIco from "../../img/moon-svgrepo-com.svg";
import semestersIco from "../../img/calendar-svgrepo-com.svg";
import coursesIco from "../../img/education-books-apple-svgrepo-com.svg";
import identicon from "../../img/identicon.png"; // TODO procedurally generate based on username??
import logoutIco from "../../img/sign-out-2-svgrepo-com.svg";
import privacyIco from "../../img/contract-line-svgrepo-com.svg";
import { Link, Navigate } from "react-router-dom";
import { contextTheme } from "../../pages/Dashboard";
import { apiLocation } from "../../App";
import useFetch from "../../hooks/useFetch";
import SidebarChoice from "./SidebarChoice";
import { ContentPane } from "./ContentPane";
import Settings from "./Settings";
import { readCookie } from "../../utils/Util";
import jwt_decode from "jwt-decode";

/**
 * Component displaying the sidebar (#sidebar-itself) and the area controlled
 * by the sidebar (#sidebar-display).
 * The sidebar should control how elements in its control area are displayed,
 * in this case, the course and item panes.
 * 
 * @typedef Semester
 * @prop {string} uuid
 * @prop {string} semesterName
 * 
 */
function Sidebar() {
  const apiURL = useContext(apiLocation);

  // Logout button
  const handleLogout = () => {
    console.log("Logging out");
    document.cookie = "token=; Expires=Thu, 01 Jan 1970 00:00:01 GMT;"; // Set expiration to long ago
  };

  // Theme toggle button
  const { theme, toggleTheme } = useContext(contextTheme);

  // States
  const [selectedAccSetting, setSelectedAccSettings] = useState(false); // FIXME TESTING ONLY


  /*
  The selected semester state remains null until the user actually chooses
  one through the list (we give the list a callback to set state). Once it
  becomes set, only then do we do another fetch request to get the courses
  associated with it.

  So, fetch hook for courses only called on change of selectedSemester.
   */
  const [selectedSemester, setSelectedSemester] = useState(null);
  console.log("Currently selected semester is " + (selectedSemester ? `${selectedSemester.name}: ${selectedSemester.id}` : selectedSemester));
  const selectSemester = (sem) => {
    if (selectedAccSetting) setSelectedAccSettings(false);  // FIXME TESTING ONLY
    if (selectedSemester && sem.id === selectedSemester.id) return;
    setSelectedCourse(null);
    setSelectedSemester(sem);
  }
  
  /* The selected course state remains null as long as (1) the user didn't
  select a semester and, once they selected a semester, as long as they
  didn't select an entry in the list. */
  const [selectedCourse, setSelectedCourse] = useState(null);
  console.log("Currently selected course is " + (selectedCourse ? `${selectedCourse.name}: ${selectedCourse.id}` : selectedCourse));
  const selectCourse = (course) => {
    if (setSelectedAccSettings) setSelectedAccSettings(false); // FIXME TESTING ONLY
    if (selectedCourse && course.id === selectedCourse.id) return;
    setSelectedCourse(course);
  }

  // Always initially fetch a list of semesters (userID included in token)
  /**
   * @type {{loading: boolean, error: Error, data: {error: number, message: string, semesterList: Array<{semesterID: string, semesterName: string}>}}}
   */
  const { data: semData, loading: semLoading, error: semError } = useFetch(`${apiURL}/semesters/list`);
  const semToName = (val) => { return [val.semesterID, val.semesterName]; }
  
  /* Set the URL of the fetch request for the course to null if no semester
  have been selected (useFetch does nothing if they are null). Values of
  course fetch metrics are meaningless if selectedSemester == null. */
  const courseURL = selectedSemester != null ? `${apiURL}/courses/list?semesterID=${selectedSemester.id}&singular=1` : null; // Remove singular for production
  /** 
   * @type {{loading: boolean, error: Error, data: {error: number, message: string, courseList: Array<{courseID: string, courseName: string}>}}} 
   */
  const { data: courseData, loading: courseLoading, error: courseError } = useFetch(courseURL);
  const courseToName = (val) => { return [val.courseID, val.courseName]; }
  
  console.log("Sem data... " + (semData ? 'exist' : 'dne'));
  console.log(`Sem status... ${semLoading ? 'loading' : 'loaded'} / ${semError ? 'err' : 'ok'}`);
  console.log("Course data... " + (courseData ? 'exist' : 'dne'));
  console.log(`Course status... ${courseLoading ? 'loading' : 'loaded'} / ${courseError ? 'err' : 'ok'}`);

  // Get the username from the token.
  let token;
  try {
    // Not validating, just decoding
    const tokenStr = readCookie("token");
    console.log("TokenStr: " + tokenStr);
    token = jwt_decode(tokenStr);
    console.log("Token decoded into");
    console.log(token);
  } catch(Error) {
    alert("Malformed token");
    return (<Navigate replace to="/404" />);
  }

  return (
    <div id="sidebar-container">
      <div id="sidebar-itself">
        
        <div className="card thin-scrollbar" id="sidebar-card">
          {/* Box containing the logo and a theme toggle button. */}
          <div id="sb-logo-container">
            <img src={logoImg} className="not-icon" style={{ height: "2.5rem" }} alt="Logo" />
            <div style={{ flexGrow: 1 }} /> {/* Push apart logo & theme toggle */}
            <img
              src={theme === "light" ? moonIco : sunIco}
              className="toggle-dark sb-selectable not-icon"
              alt="Dark mode icon" onClick={(e) => toggleTheme()}
              title="Toggle theme" />
          </div>
          <div className="horizontal-line" />

          {
            <SidebarChoice 
              name="Semesters"
              icon={semestersIco}
              id="semester-container"
              list={semData && semData.semesterList}
              valueToName={semToName}
              onSelect={selectSemester}
              override={semError || semLoading || semData.semesterList.length === 0}
              onPlus={() => alert("Unimplemented")}
            >
              {semError && <div className='sb-choice-list-message' style={{ color: 'red' }}>Error<br />{semError.message}</div>}
              {semLoading && <div className='sb-choice-list-message'>Loading</div>}
              {!semLoading && !semError && semData.semesterList.length === 0 && <div className='sb-choice-list-message'>No semesters</div>}
              
            </SidebarChoice>
          }

          <div className="horizontal-line" />

          {
            <SidebarChoice 
              name="Courses"
              icon={coursesIco}
              id="semester-container"
              list={courseData && courseData.courseList}
              valueToName={courseToName}
              onSelect={selectCourse}
              override={!selectedSemester || courseError || courseLoading || courseData.courseList.length === 0}
              onPlus={() => alert("Unimplemented")}
            >
              {!selectedSemester && <div className='sb-choice-list-message'>Please select a semester</div>}
              {selectedSemester && courseError && <div style={{ color: 'red' }}>Error<br />{courseError.message}</div>}
              {selectedSemester && courseLoading && <div className='sb-choice-list-message'>Loading</div>}
              {!courseLoading && !courseError && courseData.courseList.length === 0 && <div className='sb-choice-list-message'>No courses for semester</div>}
              
            </SidebarChoice>
          }

          <div className="horizontal-line" />
          
          {/* GPA container */}
          <div className="sidebar-item" id="gpa-container">
            <span className="color-good">3.3</span>&nbsp;CGPA
          </div>
          
          {/* Padding */}
          <div style={{ flexGrow: 1 }} />
          
          {/* User (FIXME FIXME FIXME TESTING ONLY SELECTION LOGIC) */}
          <div
            className={`sb-selectable ${selectedAccSetting ? 'sb-selected' : ''}`}
            id="user-container"
            onClick={() => (setSelectedAccSettings(prev => !prev))}
          >
            {/* We're not actually storing any user pfp this just is just a random gravatar. */}
            <img src={identicon} className="not-icon" alt="identicon" />
            <div>
              <div id="username">{token && (token.username || "Error")}</div>
              <div>Account Settings</div>
            </div>
          </div>

          {/* Sign out */}
          <Link to='/' className="sb-item sb-selectable" id="logout" onClick={handleLogout}>
            <img src={logoutIco} alt="logout" />
            <div>Sign out</div>
          </Link>

          {/* Privacy */}
          <Link to='/about' className="sb-item sb-selectable" id="privacy">
            <img src={privacyIco} alt="privacy" />
            <div>About and Privacy</div>
          </Link>
        </div>
      </div>
      <div id='sidebar-display'>
        {
          /*
          Display the currently selected course's content on the condition that:
          1. The user did not select account settings
          2. Both a course and semester were selected, and the selected course isn't currently loading.
              2.1 If loading, display loading.
          */
          (!selectedAccSetting &&
            (
              (selectedSemester && selectedCourse && !courseLoading) ?
              <ContentPane course={selectedCourse} semester={selectedSemester} /> :
              <div className="content-message">
                Please select a course and semester
              </div>
            )
          )
        }
        {
          (selectedAccSetting && <Settings />) // FIXME TESTING ONLY
        }
      </div>
    </div>
  );
}

export default Sidebar;
