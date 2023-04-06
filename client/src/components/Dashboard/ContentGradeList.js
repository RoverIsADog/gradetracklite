// @ts-check
import React, { useContext, useEffect, useState } from "react";
import { ColoredPercent } from "../../utils/Util";
import { contextCourse, contextSelectedItem, contextSemester } from "./ContentPane";
import PreviewGradeModify from "./Preview/PreviewGradeModify";

/**
 * Component that is responsible for displaying a list of grades belonging to some
 * category.
 *
 * As a child of the ContentPane, all its elements are selectable and it uses the 
 * ContentPane's selection management context. Each grade provide a previewer that
 * displays a menu to change the grade's information.
 *
 * @typedef {{gradeID: string, gradeName: string, gradeWeight: number, gradePointsAct: number, gradePointsMax: number, gradeDescription: string, gradeDate: string}} Grade
 * @typedef {{categoryID: string, categoryName: string, categoryWeight: number, categoryDescription: string, categoryGradeList: Array<Grade>}} Category
 *
 * @param {{category: Category}} props
 * @returns {JSX.Element}
 */
function ContentGradeList({ category }) {
  const semester = useContext(contextSemester);
  const course = useContext(contextCourse);
  const { selectedItem, setSelectedItem } = useContext(contextSelectedItem);
  const [gradeList, setGradeList] = useState(category.categoryGradeList);

  let lst = gradeList.map((grade, index) => {
    const handleClick = () => {
      /* Renders the current grade's editing page */
      const preview = <PreviewGradeModify category={category} grade={grade} gradeList={gradeList} setGradeList={setGradeList} />;

      console.log(`Selected grade ${grade.gradeName} : ${grade.gradeID} at ${semester.name}/${course.name}`);
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
        gradeList.length !== 0 ? lst : <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '2rem'}}>No grades in this category</div>
      }
    </div>
  );
}

export default ContentGradeList;
