// @ts-check
import React, { useContext } from "react";
// @ts-ignore
import plusIco from "../../img/plus-svgrepo-com.svg";
import { ColoredPercent, floatToDecimalStr } from "../../utils/Util";
import { contextSelectedItem } from "./ContentPane";
import ContentGradeList from "./ContentGradeList";
import PreviewCategoryModify from "./PreviewCategoryModify";
import PreviewGradeAdd from "./PreviewGradeAdd";

/**
 * Component responsible for displaying a list of categories, and each's contained courses
 * into the content pane.
 *
 * As a child of ContentPane, itself and all its grades in the list (handled by GradeList)
 * are selectable and it uses the ContentPane's selection management context. The category's
 * header displays a preview pane allowing modification or adding a new grade. The GradeList
 * component will provide its own previewer.
 *
 * In addition, this component must calculate some statistics regarding itself using its
 * contained grades: the number of points out of the category's weight and the corresponding
 * percentage.

 * @param {{categoryList: Array<{categoryID: string, categoryName: string, categoryWeight: number, categoryDescription: string, categoryGradeList: Array<{gradeID: string, gradeName: string, gradeWeight: number, gradePointsAct: number, gradePointsMax: number, gradeDescription: string, gradeDate: string}>}>}} props
 * @returns
 */
function ContentCategoryList({ categoryList }) {
  const { selectedItem, setSelectedItem } = useContext(contextSelectedItem);

  /* For every category in the category list, convert into JSX using the below code. */
  const categoryListJSX = categoryList.map((category, index) => {
    /*
    Calculate the overall grade (points/weight) and percentage for this category. There
    are probably more efficient ways, but currently blindly iterating through each category's
    grade list, and cumulating the total number of points in the category, and how much of it
    we scored.

    actPoint / maxPoints represents the average of this category. It must be converted into a
    fraction with category weight as denominator.
    */

    // First get the total number of points in this category and how much of those we got.
    // FIXME maybe put in useMemo
    let actPoints = 0; // How many out of the total points we achieved.
    let maxPoints = 0; // Total points in the category
    category.categoryGradeList.forEach((grade) => {
      actPoints += (grade.gradePointsAct / grade.gradePointsMax) * grade.gradeWeight;
      maxPoints += grade.gradePointsMax;
    });

    // When clicking the category's banner, modify screen
    const handleClickModify = () => {
      // Preview renderer for a menu to modify the category's info.
      const previewModify = () => {
        // TODO, maybe put in useMemo
        return (
          <PreviewCategoryModify category={category} />
        );
      };

      console.log("Selected category " + category.categoryID + " : " + category.categoryName);
      setSelectedItem({ id: category.categoryID, preview: previewModify });
    };

    // When clicking the category's plus, add grade screen
    const handleClickPlus = (e) => {
      // Preview renderer for a menu to add a new grade into the category
      const previewAdd = () => {
        // TODO, maybe put in useMemo
        return (
          <PreviewGradeAdd category={category} />
        );
      };

      e.stopPropagation(); //Don't trip handleClickModify
      console.log("Selected category PLUS " + category.categoryID + " : " + category.categoryName);
      setSelectedItem({ id: category.categoryID, preview: previewAdd });
    };

    return (
      <div className="category-item" key={category.categoryID}>
        {/* Category header */}
        <div className={`category-header selectable-item ${selectedItem.id === category.categoryID ? "selected-item" : ""}`} onClick={handleClickModify}>
          {/* Max width to allow name to expand, min-width to allow name to shrink */}
          <div className="category-header-box">
            <div className="category-header-top">
              <div className="category-name cap-text">{category.categoryName}</div>
              <div className="category-weight">
                {floatToDecimalStr((actPoints * category.categoryWeight) / maxPoints, 1)}/{category.categoryWeight} (<ColoredPercent number={actPoints / maxPoints} />)
              </div>
            </div>
            <div className="category-description cap-text">{category.categoryDescription}</div>
          </div>
          <img className="content-plus" src={plusIco} alt="Plus icon" onClick={handleClickPlus} title={`Add grade to ${category.categoryName}`} />
        </div>

        <div className="horizontal-line" />

        {/* Grades in that category */}
        <ContentGradeList category={category} />
      </div>
    );
  });

  // Finally, render
  return (
    <div className="category-list thin-scrollbar">
      {
        categoryList.length !== 0 ? categoryListJSX : <div>Nothing for this course</div> 
      }
    </div>
  );
}

export default ContentCategoryList;
