// @ts-check
import React, { useContext, useEffect, useMemo, useState } from "react";
import "@/css/dashboard/preview.css";
import weightIco from "@/img/weight-svgrepo-com.svg";
import courseIco from "@/img/education-books-apple-svgrepo-com.svg";
import semesterIco from "@/img/calendar-svgrepo-com.svg";
import descriptionIco from "@/img/open-book-svgrepo-com.svg";
import { contextCourse, contextSemester } from "../ContentPane";
import LoadingButton from "../common/LoadingButton";
import { networkPost } from "@/utils/NetworkUtils";
import { apiLocation } from "@/App";
import PreviewItemInline from "./ItemInline";
import PreviewItemVertical from "./ItemVertical";
import { isNumber } from "@/utils/Util";

/**
 * Renders the contents of a preview pane that allows the user to modify a
 * grade category. It also gives the option to delete the grade entirely.
 * 
 * Any and all changes made by this component will only be reflected on the
 * page if we use setCategoryList to replace the list of categories with an
 * entirely new one with our changes.
 * 
 * The category prop can be used for information and initial state
 * initialisation, but their values are not kept in sync after that. All edits
 * should be reflected onto the gradeList (via setGradeList).
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
 * @typedef {{ 
 *   categoryName: string, 
 *   categoryWeight: number, 
 *   categoryDescription: string
 * }} CategoryCandidate
 *
 * @param {{
 *   setCategoryList: React.Dispatch<React.SetStateAction<Category[]>>
 * }} props
 * @returns {JSX.Element}
 */
function PreviewCategoryAdd({ setCategoryList }) {
  const apiURL = useContext(apiLocation);
  const course = useContext(contextCourse);
  const semester = useContext(contextSemester);
  
  // Values for controlled inputs
  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");
  const [description, setDescription] = useState("");

  // See PrevGradeEdit on why this is required
  useEffect(() => {
    console.log("Reset the component!");
    setName("New Category");
    setWeight("-");
    setDescription("");
  }, [course]);

  /** @type {(e: React.ChangeEvent<HTMLInputElement>) => void} */
  const changeWeight = (e) => { // Limit to 4 chars
    const newVal = e.target.value;
    if (newVal.length > 4) return;
    setWeight(newVal);
  };

  /** @type {(btnDone: () => void, btnErr: (err: Error) => void) => void} */
  const sendEdit = useMemo(() => (btnDone, btnErr) => {
    console.log("Starting edit request...");

    if (!name || !isNumber(weight)) {
      alert("Name or weight missing or mistyped");
      console.log(`name: ${name}, weight: ${weight}`);
      btnErr(new Error("Name or weight missing or mistyped"));
      return;
    }

    /** @type {CategoryCandidate} */
    const candidateCategory = {
      categoryName: name,
      categoryWeight: Number(weight),
      categoryDescription: description
    };

    networkPost(`${apiURL}/categories/add`, {
      courseID: String(course.courseID),
      candidateCategory: candidateCategory,
    })
      .then((res) => {
        // We don't really care about the response other than it's response
        // code 200 and error code 0 (checked by networkPost).
        console.log("Add request finished");

        /** @type {Category} */
        const newCategory = { ...res.newCategory, categoryGradeList: [] };

        // Server has accepted the new cat: replace parent's cat list
        // with a new list where this cat's entry is added.
        setCategoryList((prevCatList) => {
          const newList = [...prevCatList, newCategory];
          console.log(`Added category ${newCategory.categoryName}`);
          console.log(newList);
          return newList;
        });
        
        btnDone();
      })
      .catch((err) => {
        // Server has refused the new cat
        console.log(`Add request was unsuccessful!\n${err}`);
        btnErr(err);
        alert(`Add request was unsuccessful!\n${err}`);
        return;
      });
  }, [name, weight, description, apiURL, setCategoryList, course]);
  
  return (
    <div className="card thin-scrollbar" id="preview-card">
      
      <div
        className="preview-name"
        contentEditable={true}
        onInput={e => {
          e.preventDefault();
          // console.log(e.currentTarget.textContent);
          setName(e.currentTarget.textContent);
        }}
        suppressContentEditableWarning={true} // The only child is text so it's ok
      >
        {/* Can't be {name} because React will keep updating it and setting
        the caret to the beginning. Instead, give the contentEditable an
        initial value and update the React name state to the contentEditable's
        content on change, but never set the CE's actual content to the React
        state. */}
        {"New Category"}
      </div>

      <div className="horizontal-line" />

      {/* Grade weight entry */}
      <PreviewItemInline ico={weightIco} name="Weight">
        <label htmlFor="Date" />
        <input
          className={`input-small dash-input`}
          type="text"
          min="0"
          max="9999"
          name="weight"
          value={weight}
          onChange={changeWeight}
        />
      </PreviewItemInline>

      {/* Course (not editable) */}
      <PreviewItemInline ico={courseIco} name="Course">
        <div className="cap-text" style={{ paddingLeft: "1rem", WebkitLineClamp: 3 }}>
          {course.courseName}
        </div>
      </PreviewItemInline>

      {/* Course (not editable) */}
      <PreviewItemInline ico={semesterIco} name="semester">
        <div className="cap-text" style={{ paddingLeft: "1rem", WebkitLineClamp: 3 }}>
          {semester.semesterName}
        </div>
      </PreviewItemInline>

      {/* Description */}
      <PreviewItemVertical ico={descriptionIco} name="Description">
        <textarea
          className="thin-scrollbar dash-textarea"
          style={{ transition: "0" }}
          name="grade-description"
          rows={6} value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </PreviewItemVertical>
      
      {/* Buttons */}
      <div style={{ flexGrow: "1" }}></div>
      <div className="preview-item preview-buttons">
        <LoadingButton name="Save" longFunction={sendEdit} />
      </div>
    </div>
  );
}

export default PreviewCategoryAdd;
