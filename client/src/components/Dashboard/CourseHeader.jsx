// @ts-check
import React, { useContext, useEffect, useState } from "react";
import plusIco from "img/plus-svgrepo-com.svg";
import { contextCourse, contextSelectedItem } from "./ContentPane";
import PreviewCourseEdit from "./Preview/PrevCourseEdit";
import PreviewCategoryAdd from "./Preview/PrevCatAdd";
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
 * 
 * @param {{
 *   categoryList: Category[]
 *   setCategoryList: React.Dispatch<React.SetStateAction<Category[]>>
 * }} props
 * @returns
 */
function ContentCourseHeader({ categoryList, setCategoryList }) {
  const course = useContext(contextCourse);
  const { selectedItem, setSelectedItem } = useContext(contextSelectedItem);

  /* Set the content pane's selected to itself and preview pane to modify the course. */
  const handleClickModify = () => {
    console.log("Selected course " + course.id + " : " + course.name);
    setSelectedItem({ id: course.id, preview: <PreviewCourseEdit /> });
  };
  /* Set the content pane's selected to itself and preview pane to add a category. */
  const handleClickPlus = (/** @type {React.MouseEvent<HTMLElement>} */ e) => {
    e.stopPropagation(); //Don't trip handleClickModify
    console.log("Selected course PLUS " + course.id + " : " + course.name);
    setSelectedItem({ id: course.id, preview: <PreviewCategoryAdd setCategoryList={setCategoryList} /> });
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
      className={`course-info selectable-item ${selectedItem.id === course.id ? "selected-item" : ""}`}
      onClick={handleClickModify}
    >
      {/* Box containing the course info to allow the plus to grow */}
      <div className="course-info-box">
        <div className="course-name cap-text" title={`Course ID: ${course.id}`}>
          {course.name}
        </div>
        <div style={{ flexGrow: 1 }} /> {/* Grow to push away L and R sides */}
        <div className="course-data">
          <div className="course-gpa">
            {/* TODO Implement looping to solve this */}
            {floatToGPAMcgill(points.actPoints / points.maxPoints)}({floatToPercentStr(points.actPoints / points.maxPoints)})
          </div>
          <div className="course-credits">4 Credits</div>
        </div>
      </div>
      <img
        className="content-plus"
        src={plusIco} alt="Plus icon"
        onClick={handleClickPlus}
        title={`Add category to ${course.name}`} 
      />
    </div>
  );
}

export default ContentCourseHeader;
