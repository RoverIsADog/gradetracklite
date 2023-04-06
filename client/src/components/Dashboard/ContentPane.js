import React, { createContext, useContext, useState } from "react";
import { apiLocation } from "../../App";
import "../../css/dashboard/content.css";
import useFetch from "../../hooks/useFetch";
import PlaceholderPreview from "./PlaceholderPreview";
import ContentCategoryList from "./ContentCategoryList";
import ContentCourseHeader from "./ContentCourseHeader";


/**
 * Expected Request JSON format
 * 
 * @typedef Grade
 * @prop {string} uuid
 * @prop {string} item_name
 * @prop {number} item_weight
 * @prop {number} item_mark
 * @prop {number} item_total
 * @prop {string} item_description
 * @prop {string} item_date
 * 
 * @typedef Category
 * @prop {string} uuid
 * @prop {string} category_type
 * @prop {number} category_weight
 * @prop {string} category_description
 * @prop {Array<Grade>} category_grade_list
 * 
 * @typedef {Object} CourseResponse
 * @prop {number} error
 * @prop {string} message
 * @prop {Array<Category>} category_list
 * 
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

/** @type {React.Context<{selectedItem: {id: string, preview: {() => JSX.Element}}, setSelectedItem: React.Dispatch<React.SetStateAction<{id: string; preview: () => JSX.Element;}>>}>} */
const contextSelectedItem = createContext(null);
/** @type {React.Context<{id: string, name: string}>} */
const contextSemester = createContext(null);
/** @type {React.Context<{id: string, name: string}>} */
const contextCourse = createContext(null);

const EmptyPreview = () => {
  return (
    <div>EmptyPreview</div>
  );
}

/**
 * Component that is responsible for displaying the selected course's information and contained
 * categories, grades. In addition, all the aforementioned items are selectable, and this
 * component keeps track of which one is selected to control what is displayed in the preview
 * pane
 * 
 * Each of the selectable elements provide their own function to generate the JSX of their
 * preview pane when called.
 * 
 * @param {Props} props 
 * @returns 
 */
function ContentPane({ semester, course }) {
  const apiURL = useContext(apiLocation);

  // Upon loading, fetch the selected course
  const courseURL = course ? `${apiURL}/courses/get?courseID=${course.id}&singular=1` : null;

  /** @type {{loading: boolean, error: Error, data: {error: number, message: string, categoryList: Array<{categoryID: string, categoryName: string, categoryWeight: number, categoryDescription: string, categoryGradeList: Array<{gradeID: string, gradeName: string, gradeWeight: number, gradePointsAct: number, gradePointsMax: number, gradeDescription: string, gradeDate: string}>}>}}} */
  const fetchMetrics = useFetch(courseURL);

  // Keep track of which child is selected, and the function the selected child uses to
  // generate its preview pane.
  const [selectedItem, setSelectedItem] = useState({ id: "", preview: EmptyPreview });

  // Special handling if loading or loading failed
  if (fetchMetrics.loading) {
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

  return (
    <contextSelectedItem.Provider value={{ selectedItem, setSelectedItem }}>
      <contextSemester.Provider value={semester}>
        <contextCourse.Provider value={course}>
          <div id="course-container">
            <div id="course-itself">
              {/* Another div level here to prevent weird padding/margin problems */}
              <div id="course-area">
                {/* A course's header (name, grade, credits) */}
                <ContentCourseHeader categoryList={fetchMetrics.data.categoryList} />
                <div className="horizontal-line-bold" />
                {/* Each course has its list of categories. */}
                <ContentCategoryList categoryList={fetchMetrics.data.categoryList} />
              </div>
            </div>
            
            <div id="course-display">
              {/* We preview whatever thing is currently selected. Hence why
              when setting the selected, the selected element must also provide
              a function to generate its previewer. For now, also display template
              previewer, but remove once all specific previewers are done*/}
              {selectedItem.preview && selectedItem.preview()}
              {/* <PlaceholderPreview /> */}
            </div>
          </div>
        </contextCourse.Provider>
      </contextSemester.Provider>
    </contextSelectedItem.Provider>
  );
}

export { ContentPane };
export { contextSelectedItem, contextSemester, contextCourse };
