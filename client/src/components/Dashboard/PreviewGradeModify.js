//@ts-check
import React, { useContext } from 'react'
import { contextCourse, contextSemester } from './ContentPane';

/**
 * Renders a preview pane that allows the user to modify a grade to the
 * selected category by changing its (grade, weight, date(opt),
 * description(opt)).
 * 
 * The category and course are gotten from context and can't be edited.
 * 
 * See ContentGradeList for the type declaration of a category, but it's
 * subject to change as of writing. IT IS NOT THE SAME AS THE CATEGORY FROM
 * CONTENTCATEGORYLIST!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * 
 * See ContentGradeList for the type declaration of a grade, but it's subject
 * to change as of writing.
 * 
 * 
 * @param {{category: {categoryID: string, categoryName: string, categoryWeight: number, categoryDescription: string, categoryGradeList: Array<{gradeID: string, gradeName: string, gradeWeight: number, gradePointsAct: number, gradePointsMax: number, gradeDescription: string, gradeDate: string}>}, grade: {gradeID: string, gradeName: string, gradeWeight: number, gradePointsAct: number, gradePointsMax: number, gradeDescription: string, gradeDate: string}}} props
 * @returns {JSX.Element}
 */
function PreviewGradeModify({ category, grade }) {
  const course = useContext(contextCourse);
  const semester = useContext(contextSemester);
  return (
    <div>
      Previewing editing grade {grade.gradeName}({grade.gradeID}) from {category.categoryName}/{semester.name}/{course.name}
    </div>
  );
}

export default PreviewGradeModify;