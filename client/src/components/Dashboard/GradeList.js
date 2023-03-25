import React, { useContext } from "react";
import { ColoredPercent } from "../../utils/Util";
import { contextCourse, contextSelectedItem, contextSemester } from "./ContentPane";

/**
 * Component that is responsible for displaying a list of grades belonging to some
 * category.
 *
 * As a child of the ContentPane, all its elements are selectable and it uses the 
 * ContentPane's selection management context. Each grade provide a previewer that
 * displays a menu to change the grade's information.
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
 * @param {{category: {id: string, name: string}, gradeList: Array<Grade>}} props
 * @returns
 */
function GradeList({ gradeList }) {
  const semester = useContext(contextSemester);
  const course = useContext(contextCourse);
  const { selectedItem, setSelectedItem } = useContext(contextSelectedItem);

  const lst = gradeList.map((grade, index) => {
    const handleClick = () => {
      /* Renders the current grade's editing page */
      const preview = () => {
        return <div>{`Selected grade ${grade.uuid} : ${grade.item_name} at ${semester.name}/${course.name}`}</div>;
      };

      console.log(`Selected grade ${grade.uuid} : ${grade.item_name} at ${semester.name}/${course.name}`);
      setSelectedItem({ id: grade.uuid, preview });
    };

    return (
      <div className={`grade-item selectable-item ${selectedItem.id === grade.uuid ? "selected-item" : ""}`} key={grade.uuid} onClick={handleClick}>
        <div className="grade-vert-box">
          <div className="grade-name cap-text">{grade.item_name}</div>
          <div className="grade-description cap-text">{grade.item_description}</div>
        </div>
        <div className="grade-vert-box">
          <div className="grade-score">
            {grade.item_mark}/{grade.item_total} (<ColoredPercent number={grade.item_mark / grade.item_total} />)
          </div>
          <div className="grade-weight">weight: {grade.item_weight}</div>
        </div>
      </div>
    );
  });

  return <div className="grade-list">{lst}</div>;
}

export default GradeList;
