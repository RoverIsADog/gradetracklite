// @ts-check
import React, { useContext, useEffect, useMemo, useState } from "react";
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
import { apiLocation } from "App";
import ContentSettings from "./Content/ContentSettings";
import { readCookie } from "utils/Util";
import jwt_decode from "jwt-decode";
import { networkGet } from "utils/NetworkUtils";
import ContentEmpty from "./Content/ContentEmpty";
import SidebarChoiceSemester from "./Content/SbChoiceSem";
import SidebarChoiceCourse from "./Content/SbChoiceCourse";

/**
 * Component displaying the sidebar (#sidebar-itself) and the area controlled
 * by the sidebar (#sidebar-display).
 * The sidebar should control how elements in its control area are displayed,
 * in this case, the course and item panes.
 * 
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
 * 
 * @typedef {{semesterID: string, semesterName: string}} Semester
 * @typedef {{courseID: string, courseName: string, courseCredits: number, courseDescription: string}} Course
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
 * 
 */
function Sidebar() {
  const apiURL = useContext(apiLocation);
  const { theme, toggleTheme } = useContext(contextTheme); // Theme toggle button
  const handleLogout = () => { // For the logout button
    console.log("Logging out");
    document.cookie = "token=; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict"; // Delete cookie
  };

  // Global sidebar selection
  const [selected, setSelected] = useState({ id: "", content: <ContentEmpty /> });

  // List-localised selection
  /** @type {[Course | null, React.Dispatch<React.SetStateAction<Course | null>>]} */
  const [selectedCourse, setSelectedCourse] = useState(null);
  /** @type {[Semester | null, React.Dispatch<React.SetStateAction<Semester | null>>]} */
  const [selectedSemester, setSelectedSemester] = useState(null);

  // console.log("Currently selected course is " + (selectedCourse ? `${selectedCourse.courseName}: ${selectedCourse.courseID}` : selectedCourse));
  // console.log("Currently selected semester is " + (selectedSemester ? `${selectedSemester.semesterName}: ${selectedSemester.semesterID}` : selectedSemester));

  // Fetch related states
  /** @type {[[boolean, React.Dispatch<React.SetStateAction<boolean>>], [Error | null, React.Dispatch<React.SetStateAction<Error | null>>], [listSemestersResponse | null, React.Dispatch<React.SetStateAction<listSemestersResponse | null>>]]} */
  const [[semLoading, setSemLoading], [semError, setSemError], [semData, setSemData]] = [useState(false), useState(null), useState(null)];
  /** @type {[[boolean, React.Dispatch<React.SetStateAction<boolean>>], [Error | null, React.Dispatch<React.SetStateAction<Error | null>>], [listCoursesResponse | null, React.Dispatch<React.SetStateAction<listCoursesResponse | null>>]]} */
  const [[courseLoading, setCourseLoading], [courseError, setCourseError], [courseData, setCourseData]] = [useState(false), useState(null), useState(null)];
  const semFetchMetrics = { loading: semLoading, error: semError, data: semData };
  const courseFetchMetrics = { loading: courseLoading, error: courseError, data: courseData };


  /*
  The selected semester state remains null until the user actually chooses
  one through the list (we give the list a callback to set state). Once it
  becomes set, only then do we do another fetch request to get the courses
  associated with it.

  So, fetch hook for courses only called on change of selectedSemester.
   */

  // Fetch on page load
  useEffect(() => {
    console.log(`Getting semesters list`);
    setSemLoading(true);
    setSemError(null);
    setSemData(null);

    networkGet(`${apiURL}/semesters/list`)
      .then((res) => {
        setSemLoading(false);
        setSemError(null);
        setSemData(res);
      }).catch((err) => {
        setSemLoading(false);
        setSemError(err);
        setSemData(null);
      });
    
  }, []);
  
  /* Every time the selected semester changes, fetch that semester's course
  list and save it into the course list. */
  useEffect(() => {
    if (!selectedSemester || !selectedSemester.semesterID) return; // Don't do anything if empty.
    console.log(`Getting courses for ${selectedSemester ? selectedSemester.semesterName : selectedSemester}`);
    // Reset course states to display loading
    setCourseLoading(true);
    setCourseError(null);
    setCourseData(null);
    setSelectedCourse(null);

    // Finally, do the network request
    networkGet(`${apiURL}/courses/list`, { semesterID: selectedSemester.semesterID })
      .then((res) => {
        console.log("GET course list done.");

        // Set course states accordingly
        setCourseLoading(false);
        setCourseError(null);
        setCourseData(res);

      }).catch((err) => {
        console.log("Get course list failed.");

        // Set course states accordingly
        setCourseLoading(false);
        setCourseError(err);
        setCourseData(null);
      })
  }, [selectedSemester]);
  
  // console.log("Sem data... " + (semData ? 'exist' : 'dne'));
  // console.log(`Sem status... ${semLoading ? 'loading' : 'loaded'} / ${semError ? 'err' : 'ok'}`);
  // console.log("Course data... " + (courseData ? 'exist' : 'dne'));
  // console.log(`Course status... ${courseLoading ? 'loading' : 'loaded'} / ${courseError ? 'err' : 'ok'}`);


  // Get the username from the token.
  const navigate = useNavigate();
  /** @type {TokenPayload} */
  const tokenPayload = useMemo(() => {
    try {
      // Not validating, just decoding
      const tokenStr = readCookie("token");
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
  }, []); // Run on page load only

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

          <SidebarChoiceSemester
            semFetchMetrics={semFetchMetrics}
            selected={selected}
            setSelected={setSelected}
            selectedSemester={selectedSemester}
            setSelectedSemester={setSelectedSemester}
          />

          

          <div className="horizontal-line" />

          <SidebarChoiceCourse 
            courseFetchMetrics={courseFetchMetrics}
            selected={selected}
            setSelected={setSelected}
            selectedCourse={selectedCourse}
            setSelectedCourse={setSelectedCourse}
            selectedSemester={selectedSemester}
            setSelectedSemester={setSelectedSemester}
          />

          <div className="horizontal-line" />
          
          {/* GPA container (temporarily disabled) */}
          {/* <div className="sb-item" id="gpa-container">
            <span className="color-good">3.3</span>&nbsp;CGPA
          </div> */}
          
          {/* Push acc/signout to bottom */}
          <div style={{ flexGrow: 1 }} />
          
          {/* User (FIXME FIXME FIXME TESTING ONLY SELECTION LOGIC) */}
          <div
            className={`sb-selectable ${selected.id === "user-container" ? 'sb-selected' : ''}`}
            id="user-container"
            onClick={() => {
              setSelected({ id: "user-container", content: <ContentSettings /> });
              setSelectedSemester(null);
              setSelectedCourse(null);
            }}
          >
            {/* We're not actually storing any user pfp this just is just a random gravatar. */}
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
          <Link to='/about' className="sb-item sb-selectable" id="privacy">
            <img src={privacyIco} alt="privacy" />
            <div>About and Privacy</div>
          </Link>
        </div>
      </div>
      <div id='sidebar-display'>
        {
          selected.content && selected.content
        }
      </div>
    </div>
  );
}

export default Sidebar;
