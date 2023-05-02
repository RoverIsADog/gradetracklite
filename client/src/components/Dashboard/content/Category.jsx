// @ts-check
import React, { useContext, useEffect, useState } from "react";
import plusIco from "@/img/plus-svgrepo-com.svg";
import { floatToDecimalStr } from "@/utils/Util";
import { contextSelectedItem } from "../ContentPane";
import ContentGradeList from "./GradeList";
import PreviewGradeAdd from "../CoursePreview/GradeAdd";
import PreviewCategoryEdit from "../CoursePreview/CatEdit";
import { ColoredPercent } from "@/utils/UtilComponents";

/**
 * Component responsible for displaying a category and its associated grades
 * (handled by subcomponent GradeList).
 * 
 * States must be reset on prop change.
 * 
 * In addition, this component must calculate some statistics regarding 
 * itself using its contained grades: the number of points out of the 
 * category's weight and the corresponding percentage.
 * 
 * Because the grade list is stored in a local state in each category rather
 * than being part of one massive state in the content pane, grade updates do
 * not propagate to the course header until reload. 
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
 *   category: Category,
 *   categoryList: Category[], 
 *   setCategoryList: React.Dispatch<React.SetStateAction<Category[]>>
 * }} props
 * @returns
 */
function Category(props) {
  const { category, setCategoryList } = props
  const { selectedItem, setSelectedItem } = useContext(contextSelectedItem);
  
  const [gradeList, setGradeList] = useState(category.categoryGradeList);

  // See PrevGradeEdit for why this is necessary
  useEffect(() => {
    setGradeList(category.categoryGradeList);
  }, [category])

  /*
  Calculate the overall grade (points/weight) and percentage for this category. There
  are probably more efficient ways, but currently blindly iterating through each category's
  grade list, and cumulating the total number of points in the category, and how much of it
  we scored.

  actPoint / maxPoints represents the average of this category. It must be converted into a
  fraction with category weight as denominator for display.
  */
  let actPoints = 0; // How many out of the total points we achieved.
  let maxPoints = 0; // Total points in the category
  category.categoryGradeList.forEach((grade) => {
    actPoints += grade.gradePointsAct * grade.gradeWeight;
    maxPoints += grade.gradePointsMax * grade.gradeWeight;
  });

  // When clicking the category's header, open modify preview screen
  const handleClickModify = () => {
    console.log(`Selected category ${category.categoryName} aka ${category.categoryID}`);
    setSelectedItem({ id: category.categoryID, preview: <PreviewCategoryEdit category={category} setCategoryList={setCategoryList} /> });
  };

  // When clicking the category's plus button, open add grade preview screen
  const handleClickPlus = (/** @type {React.MouseEvent<HTMLElement>} */ e) => {
    e.stopPropagation(); //Don't trip handleClickModify
    console.log(`Selected category PLUS ${category.categoryName} aka ${category.categoryID}`);
    setSelectedItem({ id: category.categoryID, preview: <PreviewGradeAdd category={category} setGradeList={setGradeList} /> });
  };

  return (
    <div className="category-item">
      {/* Category header */}
      <div
        className={`category-header selectable-item ${selectedItem.id === category.categoryID ? "selected-item" : ""}`}
        onClick={handleClickModify}
      >
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
        <img
          className="content-plus"
          src={plusIco}
          alt="Plus icon"
          onClick={handleClickPlus}
          title={`Add grade to ${category.categoryName}`}
        />
      </div>

      <div className="horizontal-line" />

      {/* Grades in that category */}
      <ContentGradeList category={category} gradeList={gradeList} setGradeList={setGradeList} />
    </div>
  );
}

export default Category;
