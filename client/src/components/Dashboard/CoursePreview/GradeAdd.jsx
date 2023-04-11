// @ts-check
import React, { useContext, useEffect, useState } from "react";
import "css/dashboard/preview.css";
import gradeIco from "img/abacus-svgrepo-com.svg";
import weightIco from "img/weight-svgrepo-com.svg";
import dateIco from "img/time-svgrepo-com.svg";
import categoryIco from "img/bookshelf-library-svgrepo-com.svg";
import courseIco from "img/education-books-apple-svgrepo-com.svg";
import descriptionIco from "img/open-book-svgrepo-com.svg";
import { contextCourse, contextSelectedItem } from "../ContentPane";
import { floatToPercentStr, isNumber } from "utils/Util";
import LoadingButton from "../common/LoadingButton";
import { networkPost } from "utils/NetworkUtils";
import { apiLocation } from "App";
import PreviewItemInline from "./ItemInline";
import PreviewItemVertical from "./ItemVertical";

/**
 * Renders the contents of a preview pane that allows the user to add a
 * grade by setting its (name, weight, date(opt), description(opt)).
 * 
 * It should render a list of items.
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
 *   gradeName: string, 
 *   gradeWeight: number, 
 *   gradePointsAct: number, 
 *   gradePointsMax: number, 
 *   gradeDescription: string, 
 *   gradeDate: string
 * }} GradeCandidate
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
 *   setGradeList: React.Dispatch<React.SetStateAction<Grade[]>>
 * }} props
 * @returns {JSX.Element}
 */
function PreviewGradeAdd({ category, setGradeList }) {
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

  // See PrevGradeEdit on why this is required
  useEffect(() => {
    setName("New Grade");
    setPtsAct("-");
    setPtsMax("-");
    setDate(new Date().toISOString().split("T")[0]);
    setWeight("-");
    setDescription("");
  }, [category]);

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

  const sendAdd = (btnDone, btnErr) => {
    console.log("Starting edit request...");

    if (!name || !isNumber(ptsAct) || !isNumber(ptsMax) || !isNumber(weight)) {
      alert("Name, points, and weight missing or mistyped");
      btnErr(new Error("Name, points, and weight missing or mistyped"));
      return;
    }

    /** @type {GradeCandidate} */
    const candidateGrade = {
      gradeName: name,
      gradePointsAct: Number(ptsAct),
      gradePointsMax: Number(ptsMax),
      gradeDate: date,
      gradeWeight: Number(weight),
      gradeDescription: description,
    };

    networkPost(`${apiURL}/grades/add`, {
      categoryID: category.categoryID,
      candidateGrade: candidateGrade,
    })
      .then((res) => {
        // We don't really care about the response other than it's response
        // code 200 and error code 0 (checked by networkPost).
        console.log("Create grade request finished");

        /** @type {Grade} */
        const newGrade = res.newGrade;

        // Server has accepted the new grade and given it an ID: replace
        // category's grade list with a new list where this new grade is 
        // inserted.
        setGradeList((prevGradeList) => {
          const newList = [...prevGradeList, newGrade];
          console.log(`Added new grade ${newGrade.gradeName}`);
          console.log(newList);
          return newList;
        });
        // FIXME THIS IS HACKY AND BAD
        category.categoryGradeList = [...category.categoryGradeList, newGrade];
        setSelectedItem({id: "", preview: null})
        
        btnDone();
      })
      .catch((err) => {
        // Server has refused the changed grade
        console.log(`Create grade request was unsuccessful!\n${err}`);
        btnErr(err);
        alert(`Create grade request was unsuccessful!\n${err}`);
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
        {"New Grade"}
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
        <LoadingButton name="Add Grade" longFunction={sendAdd} />
      </div>
    </div>
  );
}

export default PreviewGradeAdd;
