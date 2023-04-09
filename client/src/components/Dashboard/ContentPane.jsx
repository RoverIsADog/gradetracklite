// @ts-check
import React, { createContext, useContext, useEffect, useState } from "react";
import { apiLocation } from "App";
import "css/dashboard/content.css";
import useFetch from "hooks/useFetch";
import ContentCourseHeader from "./Preview/CourseHeader";
import PreviewEmpty from "./Preview/EmptyPreview";
import CategoryList from "./Preview/CategoryList";


/**
 * Type declarations
 * @typedef {{semesterID: string, semesterName: string}} Semester
 * @typedef {{courseID: string, courseName: string, courseCredits: number, courseDescription: string}} Course
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
 * @typedef {{
 *   loading: boolean, 
 *   error: Error, 
 *   data: {error: number, message: string, categoryList: Category[]}
 * }} CourseResponse
 * 
 * Allowed props for this component.
 * @typedef Props
 * @prop {{id: string, name: string}} semester
 * @prop {{id: string, name: string}} course
 * 
 * @typedef SelectedItemInfo
 * @prop {string} id
 * @prop {Function} preview
 * 
 */

/** @type {React.Context<{selectedItem: {id: string, preview: React.ReactNode}, setSelectedItem: React.Dispatch<React.SetStateAction<{id: string; preview: React.ReactNode}>>}>} */
const contextSelectedItem = createContext(null);
/** @type {React.Context<Semester>} */
const contextSemester = createContext(null);
/** @type {React.Context<Course>} */
const contextCourse = createContext(null);

/**
 * Component that is responsible for displaying the selected course's information and contained
 * categories, grades. In addition, all the aforementioned items are selectable, and this
 * component keeps track of which one is selected to control what is displayed in the preview
 * pane
 * 
 * Each of the selectable elements provide their JSX Element that renders their
 * preview pane displayed.
 * 
 * @param {{
 *   semester: Semester,
 *   course: Course,
 *   setCourseList: React.Dispatch<React.SetStateAction<Course[]>>
 * }} props 
 * @returns 
 */
function ContentPane({ semester, course, setCourseList }) {
  const apiURL = useContext(apiLocation);

  // Upon loading, fetch the selected course
  const courseURL = course ? `${apiURL}/courses/get?courseID=${course.courseID}&singular=1` : null;

  /** @type {CourseResponse} */
  const fetchMetrics = useFetch(courseURL);

  // Keep track of which child is selected, and the JSX Element that
  // child uses to generate its preview pane.
  const [selectedItem, setSelectedItem] = useState({ id: "", preview: <PreviewEmpty /> });
  const [catList, setCatList] = useState(fetchMetrics.data && fetchMetrics.data.categoryList && fetchMetrics.data.categoryList);

  // On prop change, reset the selection
  useEffect(() => {
    setSelectedItem({ id: "", preview: <PreviewEmpty /> });
  }, [semester, course])

  useEffect(() => {
    console.log("New data received!");
    fetchMetrics.data && fetchMetrics.data.categoryList && setCatList(fetchMetrics.data.categoryList);
  }, [fetchMetrics.data]);

  // console.log("Fetchmetrics are: ");
  // console.log(fetchMetrics);

  // Special handling if loading or loading failed
  if (fetchMetrics.loading || !catList) {
    return (
      <div className="content-message">
        <div>Loading...</div>
      </div>
    );
  } // Loading failed
  if (fetchMetrics.error) {
    return (
      <div className="content-message">
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "red" }}>Error</p>
          <p style={{ fontSize: "medium" }}>{fetchMetrics.error.message}</p>
        </div>
      </div>
    );
  }
  else {
    return (
      <contextSelectedItem.Provider value={{ selectedItem, setSelectedItem }}>
        <contextSemester.Provider value={semester}>
          <contextCourse.Provider value={course}>
            <div id="course-container">
              <div id="course-itself">
                {/* Another div level here to prevent weird padding/margin problems */}
                <div id="course-area">
                  {/* A course's header (name, grade, credits) */}
                  <ContentCourseHeader categoryList={catList} setCategoryList={setCatList} setCourseList={setCourseList} />
                  <div className="horizontal-line-bold" />
                  {/* Each course has its list of categories. */}
                  <CategoryList categoryList={catList} setCategoryList={setCatList} />
                </div>
              </div>
              
              <div id="course-display">
                {/* We preview whatever thing is currently selected. Hence why
                when setting the selected, the selected element must also provide
                a function to generate its previewer. For now, also display template
                previewer, but remove once all specific previewers are done*/}
                {selectedItem.preview ? selectedItem.preview : <PreviewEmpty />}
                {/* <PlaceholderPreview /> */}
              </div>
            </div>
          </contextCourse.Provider>
        </contextSemester.Provider>
      </contextSelectedItem.Provider>
    );
  }
}

export { ContentPane };
export { contextSelectedItem, contextSemester, contextCourse };
