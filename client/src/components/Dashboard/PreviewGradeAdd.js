// @ts-check
import React, { useContext } from 'react'
import { contextCourse, contextSemester } from './ContentPane';


/**
 * Renders a preview pane that allows the user to add a grade to the selected
 * category by inputting its (grade, weight, date(opt), description(opt)).
 * 
 * The category and course are gotten from context and can't be edited.
 * 
 * See ContentCategoryList for the type declaration of a category, but it's
 * subject to change as of writing.
 * @param {{category: {categoryID: string; categoryName: string; categoryWeight: number; categoryDescription: string; categoryGradeList: Array<{gradeID: string; gradeName: string; gradeWeight: number; gradePointsAct: number; gradePointsMax: number; gradeDescription: string; gradeDate: string; }>;}}} props
 * @returns {JSX.Element}
 */
function PreviewGradeAdd({ category }) {
  const course = useContext(contextCourse);
  const semester = useContext(contextSemester);
  return (
    <div>
      Previewing adding a grade to {category.categoryName} (from {course.name}/{semester.name})
    </div>
  );
}

export default PreviewGradeAdd;