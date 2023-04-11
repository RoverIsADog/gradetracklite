// @ts-check
import React, { useContext, useEffect, useState } from "react";
import plusIco from "img/plus-svgrepo-com.svg";
import trashIco from "img/delete-1-svgrepo-com.svg";
import courseIco from "img/education-books-apple-svgrepo-com.svg";
import spinner from "img/loading.svg";
import ContentEmpty from "./ContentEmpty";
import { ContentPane } from "./ContentPane";
import ContentCourseAdd from "./Preview/CourseAdd";
import { networkGet, networkPost } from "utils/NetworkUtils";
import { apiLocation } from "App";

/**
 * @typedef {{semesterID: string, semesterName: string}} Semester
 * @typedef {{courseID: string, courseName: string, courseCredits: number, courseDescription: string}} Course
 * 
 * @typedef {{id: string, content: JSX.Element}} Selected
 * 
 * @typedef {{error: number, message: string, courseList: Course[]}} listCoursesResponse
 */

/**
 * 
 * @see SemChoiceList For more details on the implementation. Differences only here. This
 * is basically the same thing but for courses.
 * 
 * # Network
 * On change of concerned semester, reset all fetch metrics and do a new GET request to get
 * a list of courses for that new concerned semester, displaying loading or error as
 * appropriate. 
 * 
 * If we click + / settings / about, they should take care of removing the concerned semester.
 * 
 * # Content-Display 
 * * Course entries display a ContentPane to modify everything about that course. It is by far
 *   the most complex content-display
 * * The plus displays a pane to add a new course as content.
 * 
 * # Storage
 * This component stores the list of courses gotten from the network into a `courseList` state,
 * replacing it whenever there is a new network request. We also update it when we add/delete
 * courses. This is because we must use states' content to display anything otherwise React
 * won't trigger a rerender on their change.
 * 
 * If we detect that the concerned semester has changed to null, we immediately discard our
 * stored `courseList` to null.
 * 
 * @param {{
 *   selected: Selected, 
 *   setSelected: React.Dispatch<React.SetStateAction<Selected>>,
 *   concernedCourse: Course,
 *   setConcernedCourse: React.Dispatch<React.SetStateAction<Course>>
 *   concernedSemester: Semester,
 *   setConcernedSemester: React.Dispatch<React.SetStateAction<Semester>>
 * }} props
 */
function CourseChoiceList({ selected, setSelected, concernedCourse, setConcernedCourse, concernedSemester, setConcernedSemester }) {
  const apiURL = useContext(apiLocation);

  // Keep track of a list of courses (populated via network request)
  /** @type {[Course[] | null, React.Dispatch<React.SetStateAction<Course[] | null>>]} */
  const [courseList, setCourseList] = useState(null);

  /* Every time the selected semester changes (inc init mount), fetch that semester's course
  list and save it into the course list state. */
  /** @type {[[boolean, React.Dispatch<React.SetStateAction<boolean>>], [Error | null, React.Dispatch<React.SetStateAction<Error | null>>], [listCoursesResponse | null, React.Dispatch<React.SetStateAction<listCoursesResponse | null>>]]} */
  const [[loading, setLoading], [error, setError], [data, setData]] = [useState(false), useState(null), useState(null)];
  useEffect(() => {
    if (!concernedSemester) return; // Don't do anything if empty.
    console.log(`Getting courses for ${concernedSemester.semesterName}`);
    // Reset fetch metrics AND concerned course before starting
    setLoading(true); setError(null); setData(null);
    setConcernedCourse(null);

    networkGet(`${apiURL}/courses/list`, { semesterID: concernedSemester.semesterID })
      .then((res) => {
        console.log("GET course list done.");
        // Set course states accordingly
        setLoading(false); setError(null); setData(res);
      }).catch((err) => {
        console.log("Get course list failed.");
        // Set course states accordingly
        setLoading(false); setError(err); setData(null);
      })
    // eslint-disable-next-line
  }, [concernedSemester]);

  // And store it in `courseList` after network request
  // Also clear `courseList` on concerned semester change.
  useEffect(() => {
    data && data.courseList && setCourseList(data.courseList);
    if (!concernedSemester) setCourseList(null);
  }, [loading, error, data, concernedSemester]);

  const semPlusHandler = () => {
    // On select plus, remove concerned course and set global selected to add course pane
    setConcernedCourse(null);
    setSelected({ id: "__plus-course", content: <ContentCourseAdd semester={concernedSemester} setCourseList={setCourseList} setSelected={setSelected} /> });
  }

  let listJSX;
  // Error situation
  if (error) {
    listJSX = (
      <div style={{color: "red"}}>{String(error)}</div>
    );
  }
  // NEW: Uset hasn't selected a semester yet
  else if (!concernedSemester) {
    listJSX = <div>Please select a semester</div>
  }
  // Not finished loading situation
  else if (loading || !data || !data.courseList || !courseList) {
    listJSX = (
      <div style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
        <img src={spinner} alt="Spinner" style={{ height: "1.5rem" }} />
        <div>Loading</div>
      </div>
    );
  }
  // Empty situation
  else if (courseList.length === 0) {
    listJSX = <div>No courses in semester</div>;
  }
  else {
    listJSX = courseList.map((course, idx) => {

      const clickCourseHandler = () => {
        // On click of a course, set itself as concerned course and global selected
        // A course's content-pane is the ContentPane.
        setConcernedCourse({ ...course });
        setSelected({
          id: course.courseID,
          content: <ContentPane course={course} semester={concernedSemester} setCourseList={setCourseList} />
        });
      };

      const deleteCourseHandler = (/** @type {React.MouseEvent<HTMLElement>} */ e) => {
        // On click of a course's delete icon, don't actually change any selections / concerned
        // unless it's the one we're trying to delete. Only delete on confirmation from
        // the backend.

        e.stopPropagation(); // Don't select the item
        console.log(`Starting remove course: ${course.courseName}`);

        networkPost(`${apiURL}/courses/delete`, {
          courseID: course.courseID
        }).then((res) => {
          console.log("Course deletion successful");

          // Replace course list with one where the removed is gone
          setCourseList((prevList) => {
            const newList = prevList.filter((s) => s.courseID !== course.courseID);
            console.log("Replaced the course list with: ");
            console.log(newList);
            return newList;
          });
          
          // Only unselect/unconcern if they are the one selected
          if (concernedCourse && concernedCourse.courseID === course.courseID) {
            setConcernedCourse(null);
            setSelected({ id: "", content: <ContentEmpty /> });
          }

        }).catch((err) => {
          console.log("Course deletion failed!");
          console.log(err);
          alert(`Course deletion failed!\n${err}`);
        })
      }

      // Selected visual status boolean
      const isSelected = (selected && selected.id === course.courseID) || (concernedCourse && concernedCourse.courseID === course.courseID);
      
      return (
        <div
          className={`sb-choice-list-element sb-selectable ${isSelected ? "sb-selected" : ""}`}
          key={course.courseID}
          onClick={clickCourseHandler}
        >
          {course.courseName}
          <div style={{flexGrow: "1"}} />
          <img src={trashIco} alt={`Delete ${course.courseID}`} onClick={deleteCourseHandler}/>
        </div>
      );

    });
  }

  return (
    <div className="sb-choice" id="semester-container">
      {/* Header (img, name, +) */}
      <div className="sb-choice-header">
        <img className="sb-choice-header-ico" src={courseIco} alt="Semester icon" />
        <div className="sb-choice-header-name">Courses</div>
        <img
          className={`sb-choice-header-plus sb-selectable ${selected && selected.id === "__plus-course" && "sb-selected"}`}
          src={plusIco} alt="Plus icon"
          style={ concernedSemester ? { display: selected && selected.id === "__plus-course" ? "block" : ""} : {width: 0}} // Only display if a semester is actually selected
          onClick={semPlusHandler} title={'Add a course'} />
      </div>

      {/* actually display the list */}
      <div className="sb-choice-list thin-scrollbar">
        {listJSX}
      </div>
    </div>
  );
}

export default CourseChoiceList;
