// @ts-check
import React from "react";
import Category from "./Category";

/**
 * Component responsible for displaying a list of categories, and each's 
 * contained grades into the content pane.
 *
 * As a child of the ContentPane, the list of categories itself and all its 
 * gradse in the list (handled by ContentGradeList) are selectable and uses 
 * the ContentPane's selection management context. Each category's header 
 * displays a preview pane allowing  modification or adding a new grade. The 
 * ContentGradeList component will provide and manage its own previewers.
 * 
 * @typedef {{
 *   gradeID: string, 
 *   gradeName: string, 
 *   gradeWeight: number, 
 *   gradePointsAct: number, 
 *   gradePointsMax: number, 
 *   gradeDescription: string, 
 *   gradeDate: string
 * }} Grade
 * @typedef {{
 *   categoryID: string, 
 *   categoryName: string, 
 *   categoryWeight: number, 
 *   categoryDescription: string, 
 *   categoryGradeList: Grade[]
 * }} Category
 * 
 * @param {{
 *   categoryList: Category[], 
 *   setCategoryList: React.Dispatch<React.SetStateAction<Category[]>>
 * }} props
 * @returns
 */

function CategoryList({ categoryList, setCategoryList }) {

  const categoryListJSX = categoryList.map((category) => {
    return <Category key={category.categoryID} category={category} categoryList={categoryList} setCategoryList={setCategoryList} />;
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

export default CategoryList