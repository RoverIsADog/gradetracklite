// @ts-check
import React, { useContext } from "react";
import { ColoredPercent } from "../../utils/Util";
import { contextCourse, contextSelectedItem, contextSemester } from "./ContentPane";
import PreviewGradeModify from "./PreviewGradeModify";

/**
 * Component that is responsible for displaying a list of grades belonging to some
 * category.
 *
 * As a child of the ContentPane, all its elements are selectable and it uses the 
 * ContentPane's selection management context. Each grade provide a previewer that
 * displays a menu to change the grade's information.
 *
 * @typedef Grade // Here for readability only
 * @prop {string} gradeID
 * @prop {string} gradeName
 * @prop {number} gradeWeight
 * @prop {number} gradePointsAct
 * @prop {number} gradePointsMax
 * @prop {string} gradeDescription
 * @prop {string} gradeDate
 *
 * @param {{category: {categoryID: string, categoryName: string, categoryWeight: number, categoryDescription: string, categoryGradeList: Array<{gradeID: string, gradeName: string, gradeWeight: number, gradePointsAct: number, gradePointsMax: number, gradeDescription: string, gradeDate: string}>}}} props
 * @returns {JSX.Element}
 */
function ContentGradeList({ category }) {
  const semester = useContext(contextSemester);
  const course = useContext(contextCourse);
  const { selectedItem, setSelectedItem } = useContext(contextSelectedItem);

  let lst = category.categoryGradeList.map((grade, index) => {
    const handleClick = () => {
      /* Renders the current grade's editing page */
      const preview = () => {
        return <PreviewGradeModify category={category} grade={grade} />;
      };

      console.log(`Selected grade ${grade.gradeID} : ${grade.gradeName} at ${semester.name}/${course.name}`);
      setSelectedItem({ id: grade.gradeID, preview });
    };

    return (
      <div className={`grade-item selectable-item ${selectedItem.id === grade.gradeID ? "selected-item" : ""}`} key={grade.gradeID} onClick={handleClick}>
        <div className="grade-vert-box">
          <div className="grade-name cap-text">{grade.gradeName}</div>
          <div className="grade-description cap-text">{grade.gradeDescription}</div>
        </div>
        <div className="grade-vert-box">
          <div className="grade-score">
            {grade.gradePointsAct}/{grade.gradePointsMax} (<ColoredPercent number={grade.gradePointsAct / grade.gradePointsMax} />)
          </div>
          <div className="grade-weight">
            weight: {grade.gradeWeight}
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="grade-list">
      {
        category.categoryGradeList.length !== 0 ? lst : <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '2rem'}}>No grades in this category</div>
      }
    </div>
  );
}

export default ContentGradeList;
