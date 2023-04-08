// @ts-check
import React, { useContext, useEffect, useState } from "react";
import plusIco from "img/plus-svgrepo-com.svg";
import trashIco from "img/delete-1-svgrepo-com.svg";
import courseIco from "img/education-books-apple-svgrepo-com.svg";
import ContentEmpty from "./ContentEmpty";
import { ContentPane } from "./ContentPane";
import ContentCourseAdd from "./CourseAdd";
import { networkPost } from "utils/NetworkUtils";
import { apiLocation } from "App";

/**
 * A component that is responsible for displaying a list of things to select
 * in the sidebar. Used to display a list of semesters and courses.
 *
 * Props required for displaying UI:
 * name, icon and id (of the list for CSS purposes)
 *
 * Props relating to the list
 * list: list of things to display. Can be null if override is true.
 * valueToName: function that takes an element in the list and returns its
 *              name and id for display
 *
 * Callbacks for when a user selects one of the options
 * onSelect: fn ((selectedID) => ...)
 * onPlus: fn (() => ...)
 *
 * Override: If this is set to true, then it the list will be replaced by the
 * component's children.
 * 
 * @typedef {{semesterID: string, semesterName: string}} Semester
 * @typedef {{courseID: string, courseName: string, courseCredits: number, courseDescription: string}} Course
 * 
 * @typedef {{id: string, content: JSX.Element}} Selected
 * 
 * @typedef {{error: number, message: string, courseList: Course[]}} listCoursesResponse
 * @typedef {{loading: boolean, error: Error, data: listCoursesResponse}} listCoursesFetchMetrics
 * 
 * @param {{
 *   courseFetchMetrics: listCoursesFetchMetrics, 
 *   selected: Selected, 
 *   setSelected: React.Dispatch<React.SetStateAction<Selected>>,
 *   children?: React.ReactNode,
 *   selectedCourse: Course,
 *   setSelectedCourse: React.Dispatch<React.SetStateAction<Course>>
 *   selectedSemester: Semester,
 *   setSelectedSemester: React.Dispatch<React.SetStateAction<Semester>>
 * }} props
 */
function SidebarChoiceCourse({ courseFetchMetrics, selected, setSelected, selectedCourse, setSelectedCourse, selectedSemester, setSelectedSemester, children }) {
  const apiURL = useContext(apiLocation);

  const { loading, error, data } = courseFetchMetrics;

  /** @type {[Course[] | null, React.Dispatch<React.SetStateAction<Course[] | null>>]} */
  const [courseList, setCourseList] = useState(null);

  useEffect(() => {
    data && data.courseList && setCourseList(data.courseList);
    if (!selectedSemester) setCourseList(null);
  }, [loading, error, data, selectedSemester]);

  const semPlusHandler = () => {
    setSelected({ id: "__plus-Course", content: <ContentCourseAdd semester={selectedSemester} setCourseList={setCourseList} setSelected={setSelected} /> });
    setSelectedCourse(null);
  }

  let displayed;
  if (children) {
    displayed = children;
  }
  else if (error) {
    displayed = <div>Error: {String(error)}</div>
  }
  else if (!selectedSemester) {
    displayed = <div>Please select a semester</div>
  }
  else if (loading || !data || !data.courseList || !courseList) {
    displayed = <div>Loading...</div>
  }
  else if (courseList.length !== 0) {
    displayed = courseList.map((course, idx) => {

      const courseClickHandler = () => {
        setSelectedCourse({ ...course }); // Locally set state
        setSelected({
          id: course.courseID,
          content: <ContentPane course={course} semester={selectedSemester} setCourseList={setCourseList} />
        });
      };

      const deleteCourseHandler = (/** @type {React.MouseEvent<HTMLElement>} */ e) => {
        e.stopPropagation(); // Don't select the thing
        console.log(`Starting remove course: ${course.courseName}`);

        networkPost(`${apiURL}/courses/delete`, {
          courseID: course.courseID
        }).then((res) => {
          console.log("Course deletion successful");

          setCourseList((prevList) => {
            const newList = prevList.filter((s) => s.courseID !== course.courseID);
            console.log("Replaced the course list with: ");
            console.log(newList);
            return newList;
          });
          
          setSelectedCourse( null );
          setSelected({ id: "", content: <ContentEmpty /> });

        }).catch((err) => {
          console.log("Course deletion failed!");
          console.log(err);
          alert(`Course deletion failed!\n${err}`);
        })
      }

      const isSelected = (selected.id === course.courseID) || (selectedCourse && selectedCourse.courseID === course.courseID);
      return (
        <div
          className={`sb-choice-list-element sb-selectable ${isSelected ? "sb-selected" : ""}`}
          key={course.courseID}
          onClick={courseClickHandler}
        >
          {course.courseName}
          <div style={{flexGrow: "1"}} />
          <img src={trashIco} alt={`Delete ${course.courseID}`} onClick={deleteCourseHandler}/>
        </div>
      );

    });
  } else {
    displayed = <div>No courses in semester</div>;
  }

  return (
    <>
      <div className="sb-choice" id="semester-container">
        {/* Header (img, name, +) */}
        <div className="sb-choice-header">
          <img className="sb-choice-header-ico" src={courseIco} alt="Semester icon" />
          <div className="sb-choice-header-name">Courses</div>
          <img
            className="sb-choice-header-plus sb-selectable"
            src={plusIco} alt="Plus icon"
            style={ selectedSemester ? {} : {width: 0}} // Only display a semester is actually selected
            onClick={semPlusHandler} title={'Add a semester'} />
        </div>

        {/* actually display the list */}
        <div className="sb-choice-list thin-scrollbar">
          {displayed}
        </div>
      </div>
    </>
  );
}

export default SidebarChoiceCourse;
