import React, { useContext } from "react";
import { contextCourse, contextSemester } from "./ContentPane";

/**
 * Renders a preview pane that allows the user to modify a selected grade
 * category by changing its (weight, name).
 * 
 * See ContentCategoryList for the type declaration of a category, but it's
 * subject to change as of writing.
 * @returns {React.Component}
 */
function PreviewCategoryModify({ category }) {
  const course = useContext(contextCourse);
  const semester = useContext(contextSemester);
  return (
    <div>
      Previewing modifying {category.category_type} (from {course.name}/{semester.name})
    </div>
  );
}

export default PreviewCategoryModify;
