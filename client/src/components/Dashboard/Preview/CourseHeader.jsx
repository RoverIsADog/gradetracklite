// @ts-check
import React, { useContext, useEffect, useState } from "react";
import plusIco from "img/plus-svgrepo-com.svg";
import { contextCourse, contextSelectedItem } from "../ContentPane";
import PreviewCourseEdit from "./CourseEdit";
import PreviewCategoryAdd from "./CatAdd";
import { floatToGPAMcgill, floatToPercentStr } from "utils/Util";

/**
 * Component that is responsible for rendering a course's header containing it name, overall
 * grade, gpa...
 * 
 * As a child of the ContentPane, it itself is selectable and it provides previewers for both
 * modifying the course information and creating a new category in the course (plus).
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
 * @typedef {{courseID: string, courseName: string, courseCredits: number, courseDescription: string}} Course
 * 
 * @param {{
 *   categoryList: Category[],
 *   setCategoryList: React.Dispatch<React.SetStateAction<Category[]>>,
 *   setCourseList: React.Dispatch<React.SetStateAction<Course[]>>,
 * }} props
 * @returns
 */
function ContentCourseHeader({ categoryList, setCategoryList, setCourseList }) {
  const course = useContext(contextCourse);
  const { selectedItem, setSelectedItem } = useContext(contextSelectedItem);

  /* Set the content pane's selected to itself and preview pane to modify the course. */
  const handleClickModify = () => {
    console.log("Selected course " + course.courseID + " : " + course.courseName);
    setSelectedItem({ id: course.courseID, preview: <PreviewCourseEdit setCourseList={setCourseList} /> });
  };
  /* Set the content pane's selected to itself and preview pane to add a category. */
  const handleClickPlus = (/** @type {React.MouseEvent<HTMLElement>} */ e) => {
    e.stopPropagation(); //Don't trip handleClickModify
    console.log("Selected course PLUS " + course.courseID + " : " + course.courseName);
    setSelectedItem({ id: course.courseID, preview: <PreviewCategoryAdd setCategoryList={setCategoryList} /> });
  };
  
  // Fixme this doesn't update on grade change
  const [points, setPoints] = useState({ actPoints: 0, maxPoints: 0 });
  useEffect(() => {
    let actPoints = 0;
    let maxPoints = 0;
    categoryList.forEach((category) => {
      let catActPoints = 0;
      let catMaxPoints = 0;
      category.categoryGradeList.forEach((grade) => {
        catActPoints += grade.gradePointsAct * grade.gradeWeight;
        catMaxPoints += grade.gradePointsMax * grade.gradeWeight;
      });
      actPoints += catActPoints * category.categoryWeight;
      maxPoints += catMaxPoints * category.categoryWeight;
    });
    setPoints({ actPoints, maxPoints });
  }, [categoryList, setCategoryList]);

  // console.log(`Course has ${actPoint}/${maxPoint}.`);

  return (
    <div
      className={`course-info selectable-item ${(selectedItem && selectedItem.id === course.courseID) ? "selected-item" : ""}`}
      onClick={handleClickModify}
    >
      {/* Box containing the course info to allow the plus to grow */}
      <div className="course-info-box">
        <div className="course-name cap-text" title={`Course ID: ${course.courseID}`}>
          {course.courseName}
        </div>
        <div style={{ flexGrow: 1 }} /> {/* Grow to push away L and R sides */}
        <div className="course-data">
          <div className="course-gpa">
            {/* TODO Implement looping to solve this */}
            {floatToGPAMcgill(points.actPoints / points.maxPoints)}({floatToPercentStr(points.actPoints / points.maxPoints)})
          </div>
          <div className="course-credits">{course.courseCredits} Credits</div>
        </div>
      </div>
      <img
        className="content-plus"
        src={plusIco} alt="Plus icon"
        onClick={handleClickPlus}
        title={`Add category to ${course.courseName}`} 
      />
    </div>
  );
}

export default ContentCourseHeader;
