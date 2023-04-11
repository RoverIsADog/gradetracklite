// @ts-check
import React, { useContext, useMemo, useState } from "react";
import "css/dashboard/sidebar.css";
import "css/dashboard/content.css";
import logoImg from "img/logo.png";
import sunIco from "img/sun-svgrepo-com.svg";
import moonIco from "img/moon-svgrepo-com.svg";
import identicon from "img/identicon.png"; // TODO procedurally generate based on username??
import logoutIco from "img/sign-out-2-svgrepo-com.svg";
import privacyIco from "img/contract-line-svgrepo-com.svg";
import { Link, useNavigate } from "react-router-dom";
import { contextTheme } from "pages/Dashboard";
import ContentSettings from "./ContentSettings";
import { readCookie } from "utils/Util";
import jwt_decode from "jwt-decode";
import ContentEmpty from "./ContentEmpty";
import SemesterChoiceList from "./SemChoiceList";
import CourseChoiceList from "./CourseChoiceList";
import ContentAbout from "./Content/About";

/**
 * @typedef {{
 *   gradeID: string, 
 *   gradeName: string, 
 *   gradeWeight: number, 
 *   gradePointsAct: number, 
 *   gradePointsMax: number, 
 *   gradeDescription: string, 
 *   gradeDate: string
 * }} Grade
 * @typedef {{
 *   categoryID: string, 
 *   categoryName: string, 
 *   categoryWeight: number, 
 *   categoryDescription: string, 
 *   categoryGradeList: Grade[]
 * }} Category
 * @typedef {{
 *   semesterID: string, 
 *   semesterName: string
 * }} Semester
 * @typedef {{
 *   courseID: string, 
 *   courseName: string, 
 *   courseCredits: number, 
 *   courseDescription: string
 * }} Course
 * 
 * @typedef {{error: number, message: string, semesterList: Semester[]}} listSemestersResponse
 * @typedef {{loading: boolean, error: Error, data: listSemestersResponse}} listSemestersFetchMetrics
 * 
 * @typedef {{error: number, message: string, courseList: Course[]}} listCoursesResponse
 * @typedef {{loading: boolean, error: Error, data: listCoursesResponse}} listCoursesFetchMetrics
 * 
 * @typedef {{error: number, message: string, categoryList: Category[]}} getCourseResponse
 * 
 * @typedef {{uuid: string, username: string, email: string | null | undefined, exp: number, iat: number}} TokenPayload
 */

/**
 * Component displaying the sidebar (#sidebar-itself) and the area controlled by the sidebar
 * (#sidebar-display). At any moment, the sidebar only has one selected item (or none), which
 * is stored in the `selected` state. The `selected` object contains the UUID of the element
 * that is selected, and a Component that the sidebar will display in the content area.
 * 
 * `selected` and `setSelected` are passed as props to all "child" components of the sidebar,
 * where they can determine if they are currently selected by comparing their ID with the
 * currently selected's. They should also __set__ the selected element to their own ID and
 * to their own content-display component if they are selected (usually onClick). For this
 * reason, we should avoid setting it to null (reduce checks).
 * 
 * The selection manager of the sidebar differs from the selection manager of the content-pane
 * in that there are two additional selection managers for semesters and courses (we can select
 * both a semester and a course). They can also be null to represent no selection.
 * 
 * * The `selected` state represents the latest item the user clicked, and controls what content
 * pane is shown.
 * 
 * * The `selectedSemester` state represents what semester we have selected, and persists even
 * if the `selected` state changes. This is so that we can select courses from a semester without
 * that semester becoming unfocussed. It is also used to keep track of when we should do a network
 * request for a semester's list of courses (on `selectedSemester` change).
 *   * It is reset if we click semesters+ / settings / about
 * 
 * * The `selectedCourse` state represents what course we have selected and also persists on
 * `selected` state changes. It is used to keep track of when we should do a network request for
 * a course's content to display (on `selectedCourse` change).
 *   * It is reset if we click semesters+ / a semester / courses+ / settings / about.
 *   * If a course is selected, there MUST be semester that is also selected, as we use both
 *     to know what to display to the content pane.
 * 
 */
function Sidebar() {
  const { theme, toggleTheme } = useContext(contextTheme); // Theme toggle button
  const handleLogout = () => { // For the logout button
    console.log("Logging out");
    document.cookie = "token=; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict"; // Delete cookie
  };

  // Global sidebar selection
  const [selected, setSelected] = useState({ id: "", content: <ContentEmpty /> });

  // List-localised concerned elements
  /** @type {[Semester | null, React.Dispatch<React.SetStateAction<Semester | null>>]} */
  const [concernedSemester, setConcernedSemester] = useState(null);
  /** @type {[Course | null, React.Dispatch<React.SetStateAction<Course | null>>]} */
  const [concernedCourse, setConcernedCourse] = useState(null);

  // Token management (allow changing)
  const [jWT, setJWT] = useState(readCookie("token"));
  const currentCookie = readCookie("token");
  if (jWT !== currentCookie) {
    setJWT(currentCookie);
  }

  // Get the username from the token.
  const navigate = useNavigate();
  /** @type {TokenPayload} */
  const tokenPayload = useMemo(() => {
    try {
      // Not validating, just decoding
      const tokenStr = jWT;
      console.log("TokenStr: " + tokenStr);
      /** @type {TokenPayload} */
      const content = jwt_decode(tokenStr);
      console.log("Token decoded into");
      console.log(content);
      return content;
    } catch (Error) {
      alert("Malformed token");
      navigate("/404");
      return null;
    }
    // eslint-disable-next-line
  }, [jWT]); // Run on page load only

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

          {/* List of selectable semester */}
          <SemesterChoiceList
            selected={selected}
            setSelected={setSelected}
            concernedSemester={concernedSemester}
            setConcernedSemester={setConcernedSemester}
          />

          <div className="horizontal-line" />

          {/* List of selectable courses */}
          <CourseChoiceList 
            selected={selected}
            setSelected={setSelected}
            concernedCourse={concernedCourse}
            setConcernedCourse={setConcernedCourse}
            concernedSemester={concernedSemester}
            setConcernedSemester={setConcernedSemester}
          />

          <div className="horizontal-line" />
          
          {/* GPA container (temporarily disabled) */}
          {/* <div className="sb-item" id="gpa-container">
            <span className="color-good">3.3</span>&nbsp;CGPA
          </div> */}
          
          {/* Push acc/signout to bottom */}
          <div style={{ flexGrow: 1 }} />
          <div
            className={`sb-selectable ${selected.id === "__user" ? 'sb-selected' : ''}`}
            id="user-container"
            onClick={() => {
              setSelected({ id: "__user", content: <ContentSettings /> });
              setConcernedSemester(null);
              setConcernedCourse(null);
            }}
          >
            {/* We're not actually storing any user pfp this just is just a random gravatar, 
            though we could use a gravatar generation library */}
            <img src={identicon} className="not-icon" alt="identicon" />
            <div>
              <div id="username">{tokenPayload && (tokenPayload.username || "Error")}</div>
              <div>Account Settings</div>
            </div>
          </div>

          {/* Sign out */}
          <Link to='/' className="sb-item sb-selectable" id="logout" onClick={handleLogout}>
            <img src={logoutIco} alt="logout" />
            <div>Sign out</div>
          </Link>

          {/* Privacy */}
          <div
            className={`sb-item sb-selectable ${(selected && selected.id === "__privacy") ? "sb-selected" : ""}`}
            id="privacy"
            onClick={() => {
              setSelected({ id: "__privacy", content: <ContentAbout /> })
              setConcernedSemester(null);
              setConcernedCourse(null);
            }}
          >
            <img src={privacyIco} alt="privacy" />
            <div>About and Privacy</div>
          </div>

        </div>
      </div>
      <div id='sidebar-display'>
        {
          (selected && selected.content) ? selected.content : <ContentEmpty />
        }
      </div>
    </div>
  );
}

export default Sidebar;
