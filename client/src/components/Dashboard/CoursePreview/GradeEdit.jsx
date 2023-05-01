// @ts-check
import React, { useContext, useEffect, useState } from "react";
import "@/css/dashboard/preview.css";
import gradeIco from "@/img/abacus-svgrepo-com.svg";
import weightIco from "@/img/weight-svgrepo-com.svg";
import dateIco from "@/img/time-svgrepo-com.svg";
import categoryIco from "@/img/bookshelf-library-svgrepo-com.svg";
import courseIco from "@/img/education-books-apple-svgrepo-com.svg";
import descriptionIco from "@/img/open-book-svgrepo-com.svg";
import { contextCourse, contextSelectedItem } from "../ContentPane";
import { floatToPercentStr, isNumber } from "@/utils/Util";
import LoadingButton from "../common/LoadingButton";
import PreviewEmpty from "./EmptyPreview";
import { networkPost } from "@/utils/NetworkUtils";
import { apiLocation } from "@/App";
import PreviewItemInline from "./ItemInline";
import PreviewItemVertical from "./ItemVertical";

/**
 * Renders the contents of a preview pane that allows the user to modify a
 * grade by changing its (name, weight, date(opt), description(opt)). It
 * also gives the option to delete the grade entirely.
 * 
 * It should render a list of items.
 *
 * Changing the category would require minor refactoring and isn't supported.
 * Changing The semester and course would require major refactoring and aren't
 * supported.
 * 
 * Any and all changes made by this component will only be reflected on the
 * page if we use setGradeList to replace the list of grades with an entirely
 * new one with out changes.
 * 
 * The props category and grade can be used for information and initial state
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
 *
 * @param {{
 *   category: Category, 
 *   grade: Grade, 
 *   gradeList: Grade[], 
 *   setGradeList: React.Dispatch<React.SetStateAction<Grade[]>>
 * }} props
 * @returns {JSX.Element}
 */
function PreviewGradeEdit({ category, grade, setGradeList }) {
  const apiURL = useContext(apiLocation);
  const course = useContext(contextCourse);
  const { setSelectedItem } = useContext(contextSelectedItem);
  
  // Values for controlled inputs
  const [name, setName] = useState("");
  const [ptsAct, setPtsAct] = useState("");
  const [ptsMax, setPtsMax] = useState("");
  const [date, setDate] = useState("");
  const [weight, setWeight] = useState("");
  const [description, setDescription] = useState("");

  /* Despite literally creating a component generator function that generates
  a new component every time the selected item changes, React keeps the same
  component and just changes the props. The result is that controlled inputs
  (i.e. value controlled by a state, change by using setState) don't update
  when a new grade is selected.
  
  This is because the old selected grade's preview component isn't unmounted
  and the same preview component is used to display the new grade (aka the
  states aren't set to the prop's values).
  
  So, we have to set the states of every controlled component on every prop
  change. All user changeable fields must be controlled components.
  
  Sometimes I really hate React */
  useEffect(() => {
    if (grade) {
      setName(String(grade.gradeName));
      setPtsAct(String(grade.gradePointsAct));
      setPtsMax(String(grade.gradePointsMax));
      setDate(String(grade.gradeDate));
      setWeight(String(grade.gradeWeight));
      setDescription(String(grade.gradeDescription));
    }
  }, [category, grade]);

  /** @type {(e: React.ChangeEvent<HTMLInputElement>) => void} */
  const changePtsAct = (e) => { // Limit to 4 chars
    const newVal = e.target.value;
    if (newVal.length > 4) return;
    setPtsAct(newVal);
  };
  /** @type {(e: React.ChangeEvent<HTMLInputElement>) => void} */
  const changePtsMax = (e) => { // Limit to 4 chars
    const newVal = e.target.value;
    if (newVal.length > 4) return;
    setPtsMax(newVal);
  };
  /** @type {(e: React.ChangeEvent<HTMLInputElement>) => void} */
  const changeWeight = (e) => { // Limit to 4 chars
    const newVal = e.target.value;
    if (newVal.length > 4) return;
    setWeight(newVal);
  };

  const sendDelete = (btnDone, btnErr) => {
    console.log("Starting deletion request...");

    if (!name || !isNumber(ptsAct) || !isNumber(ptsMax) || !isNumber(weight)) {
      alert("Name, points, and weight missing or mistyped");
      btnErr(new Error("Name, points, and weight missing or mistyped"));
      return;
    }
    
    networkPost(`${apiURL}/grades/delete`, {
      gradeID: grade.gradeID,
    })
      .then((res) => {
        // We don't really care about the response other than it's response
        // code 200 and error code 0 (checked by networkPost).
        console.log("Deletion request finished");

        // Server has accepted the deletion: replace parent's grade list
        // with a new list where this grade's entry is removed.
        setGradeList((prevGradeList) => {
          const newList = prevGradeList.filter((gr) => {
            return gr.gradeID !== grade.gradeID;
          });
          // FIXME THIS IS HACKY AND BAD
          category.categoryGradeList = newList;
          return newList;
        });
        setSelectedItem({ id: "", preview: <PreviewEmpty /> });
        btnDone();
      })
      .catch((err) => {
        console.log(`Deletion request was unsuccessful!\n${err}`);
        btnErr(err);
        alert(`Deletion request was unsuccessful!\n${err}`);
        return;
      });
  };

  const sendEdit = (btnDone, btnErr) => {
    console.log("Starting edit request...");

    if (!name || !isNumber(ptsAct) || !isNumber(ptsMax) || !isNumber(weight)) {
      alert("Name, points, and weight missing or mistyped");
      btnErr(new Error("Name, points, and weight missing or mistyped"));
      return;
    }

    /** @type {Grade} */
    const modifiedGrade = {
      gradeID: grade.gradeID,
      gradeName: name,
      gradePointsAct: Number(ptsAct),
      gradePointsMax: Number(ptsMax),
      gradeDate: date,
      gradeWeight: Number(weight),
      gradeDescription: description,
    };

    networkPost(`${apiURL}/grades/edit`, {
      modifiedGrade: modifiedGrade,
    })
      .then((res) => {
        // We don't really care about the response other than it's response
        // code 200 and error code 0 (checked by networkPost).
        console.log("Edit request finished");

        // Server has accepted the changed grade: replace parent's grade list
        // with a new list where this grade's entry is changed.
        setGradeList((prevGradeList) => {
          const newList = prevGradeList.map((gr) => {
            return gr.gradeID === grade.gradeID ? modifiedGrade : gr;
          });
          console.log(`Modified grade ${grade.gradeName}`);
          console.log(newList);
          // FIXME THIS IS HACKY AND BAD
          category.categoryGradeList = newList;
          return newList;
        });
        
        btnDone();
      })
      .catch((err) => {
        // Server has refused the changed grade
        console.log(`Edit request was unsuccessful!\n${err}`);
        btnErr(err);
        alert(`Edit request was unsuccessful!\n${err}`);
        return;
      });
  }
  
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
        {grade.gradeName}
      </div>

      <div className="horizontal-line" />
      
      {/* Grade name */}
      {/* <input
        className="dash-input preview-name"
        style={{
          fontSize: "xx-large",
          fontWeight: "bold",
        }}
        value={name}
        onChange={(e) => setName(e.target.value)}
      /> */}

      {/* <div className="horizontal-line" /> */}

      {/* Grade preview entry */}
      <PreviewItemInline ico={gradeIco} name="Grade" >
        <div>({floatToPercentStr(Number(ptsAct) / Number(ptsMax))})&nbsp;</div>
        <label htmlFor="points-actual" />
        <input
          className="input-small dash-input"
          type="text"
          min="0"
          max="9999"
          name="points-actual"
          maxLength={4}
          value={ptsAct}
          onChange={changePtsAct}
        />

        <div>&nbsp;/&nbsp;</div>

        <label htmlFor="points-max" />
        <input
          className="input-small dash-input"
          type="text"
          min="0"
          max="9999"
          name="points-max"
          maxLength={4}
          value={ptsMax}
          onChange={changePtsMax}
        />
      </PreviewItemInline>

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

      {/* Date */}
      <PreviewItemInline ico={dateIco} name="Date">
        <label htmlFor="Date" />
        <input
          className="input-large dash-input"
          type="date"
          name="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </PreviewItemInline>

      {/* Category (not editable) */}
      <PreviewItemInline ico={categoryIco} name="Category">
        <div className="cap-text" style={{ paddingLeft: "1rem", WebkitLineClamp: 3 }}>
          {category.categoryName}
        </div>
      </PreviewItemInline>

      {/* Course (not editable) */}
      <PreviewItemInline ico={courseIco} name="Course">
        <div className="cap-text" style={{ paddingLeft: "1rem", WebkitLineClamp: 3 }}>
          {course.courseName}
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
        <LoadingButton name="Delete" longFunction={sendDelete} />
        <LoadingButton name="Save" longFunction={sendEdit} />
      </div>
    </div>
  );
}

export default PreviewGradeEdit;
