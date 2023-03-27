// @ts-check
import React, { useContext } from "react";
import { contextCourse, contextSemester } from "./ContentPane";

/**
 * Renders a preview pane that allows the user to modify a selected grade
 * category by changing its (weight, name).
 * 
 * As of right now, other fields are not modifiable.
 * 
 * @param {{category: {categoryID: string; categoryName: string; categoryWeight: number; categoryDescription: string; categoryGradeList: Array<{gradeID: string; gradeName: string; gradeWeight: number; gradePointsAct: number; gradePointsMax: number; gradeDescription: string; gradeDate: string; }>;}}} props
 * @returns {JSX.Element}
 */
function PreviewCategoryModify({ category }) {
  const course = useContext(contextCourse);
  const semester = useContext(contextSemester);
  return (
    <div>
      Previewing modifying {category.categoryName} (from {course.name}/{semester.name})
    </div>
  );
}

export default PreviewCategoryModify;
