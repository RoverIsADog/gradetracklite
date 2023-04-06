import React, { useContext } from "react";
import plusIco from "../../img/plus-svgrepo-com.svg";
import { contextCourse, contextSelectedItem } from "./ContentPane";
import PreviewCourseModify from "./PreviewCourseModify";
import PreviewCategoryAdd from "./PreviewCategoryAdd";
import { floatToGPAMcgill, floatToPercentStr } from "../../utils/Util";

/**
 * Component that is responsible for rendering a course's header containing it name, overall
 * grade, gpa...
 * 
 * As a child of the ContentPane, it itself is selectable and it provides previewers for both
 * modifying the course information and creating a new category in the course (plus).
 * 
 * @param {{categoryList: Array<{categoryID: string, categoryName: string, categoryWeight: number, categoryDescription: string, categoryGradeList: Array<{gradeID: string, gradeName: string, gradeWeight: number, gradePointsAct: number, gradePointsMax: number, gradeDescription: string, gradeDate: string}>}>}} props
 * @returns
 */
function ContentCourseHeader({ categoryList }) {
  const course = useContext(contextCourse);
  const { selectedItem, setSelectedItem } = useContext(contextSelectedItem);

  /* Preview pane component allowing modifying a course. */
  const previewModify = () => {
    // TODO maybe put this in a memo
    return <PreviewCourseModify />;
  };
  /* Peview pane component allowing adding a category to a course. */
  const previewAdd = () => {
    // TODO maybe put this in a memo
    return <PreviewCategoryAdd />;
  };
  /* Set the content pane's selected to itself and preview pane to modify the course. */
  const handleClickModify = () => {
    console.log("Selected course " + course.id + " : " + course.name);
    setSelectedItem({ id: course.id, preview: previewModify });
  };
  /* Set the content pane's selected to itself and preview pane to add a category. */
  const handleClickPlus = (e) => {
    e.stopPropagation(); //Don't trip handleClickModify
    console.log("Selected course PLUS " + course.id + " : " + course.name);
    setSelectedItem({ id: course.id, preview: previewAdd });
  };
  
  let actPoint = 0;
  let maxPoint = 0;
  categoryList.forEach((category) => {
    let catActPoints = 0;
    let catMaxPoints = 0;
    category.categoryGradeList.forEach((grade) => {
      catActPoints += grade.gradePointsAct * grade.gradeWeight;
      catMaxPoints += grade.gradePointsMax * grade.gradeWeight;
    });
    actPoint += catActPoints * category.categoryWeight;
    maxPoint += catMaxPoints * category.categoryWeight;
  });

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
            {floatToGPAMcgill(actPoint / maxPoint)}({floatToPercentStr(actPoint / maxPoint)})
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
