import React, { useContext } from 'react'
import { contextCourse, contextSemester } from './ContentPane';

/**
 * Renders a preview pane that allows the user to add a grade category to a
 * course by specifying its (weight, name). It should also display for what
 * course and semester? we're adding it for (get these from context).
 * @returns {React.Component}
 */
function PreviewCategoryAdd() {
  const course = useContext(contextCourse);
  const semester = useContext(contextSemester)
  return (
    <div>Previewing adding a category to {course.name}/{semester.name}</div>
  );
}

export default PreviewCategoryAdd;