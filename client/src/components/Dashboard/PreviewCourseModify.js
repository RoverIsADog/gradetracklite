// @ts-check
import React, { useContext } from 'react'
import { contextCourse, contextSemester } from './ContentPane';

/**
 * Renders a preview pane that allows the user to change the selected course
 * (as of right now, only the name).
 * 
 * @returns {JSX.Element}
 */
function PreviewCourseModify() {
  // Maybe modify this object on change?
  const course = useContext(contextCourse);
  const semester = useContext(contextSemester);

  return (
    <div>
      Previewing modifying {course.name}/{semester.name}
    </div>
  );
  }

export default PreviewCourseModify;