import React, { useContext } from 'react'
import { contextCourse, contextSemester } from './ContentPane';

/**
 * Renders a preview pane that allows the user to change the selected course
 * (as of right now, only the name).
 * 
 * Add more props if needed, although a lot of them could be gotten from the
 * context (currently selected semester / course).
 * @returns {React.Component}
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