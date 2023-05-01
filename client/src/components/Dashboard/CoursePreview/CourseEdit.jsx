// @ts-check
import React, { useContext, useEffect, useMemo, useState } from "react";
import "@/css/dashboard/preview.css";
import weightIco from "@/img/weight-svgrepo-com.svg";
import semesterIco from "@/img/calendar-svgrepo-com.svg";
import descriptionIco from "@/img/open-book-svgrepo-com.svg";
import { contextCourse, contextSemester } from "../ContentPane";
import LoadingButton from "../common/LoadingButton";
import { networkPost } from "@/utils/NetworkUtils";
import { apiLocation } from "@/App";
import PreviewItemInline from "./ItemInline";
import { isNumber } from "@/utils/Util";
import PreviewItemVertical from "./ItemVertical";

/**
 * Renders the contents of a preview pane that allows the user to modify a
 * course.
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
 *   courseID: string,
 *   courseName: string,
 *   courseCredits: number,
 *   courseDescription: string
 * }} Course
 * 
 * @param {{
 *   setCourseList: React.Dispatch<React.SetStateAction<Course[]>>
 * }} props
 *
 * @returns {JSX.Element}
 */
function PreviewCourseEdit({ setCourseList }) {
  const apiURL = useContext(apiLocation);
  const course = useContext(contextCourse);
  const semester = useContext(contextSemester);
  
  // Values for controlled inputs
  const [name, setName] = useState("");
  const [credits, setCredits] = useState("");
  const [description, setDescription] = useState("");

  // See PrevGradeEdit on why this is required
  useEffect(() => {
    console.log("Reset the component!");
    setName(String(course.courseName));
    setCredits(String(course.courseCredits));
    setDescription(String(course.courseDescription));
  }, [course]);

  /** @type {(e: React.ChangeEvent<HTMLInputElement>) => void} */
  const changeWeight = (e) => { // Limit to 4 chars
    const newVal = e.target.value;
    if (newVal.length > 4) return;
    setCredits(newVal);
  };

  /** @type {(btnDone: () => void, btnErr: (err: Error) => void) => void} */
  const sendEdit = useMemo(() => (btnDone, btnErr) => {
    console.log("Starting edit request...");
    
    if (!name || !isNumber(credits)) {
      alert("Name or weight missing or mistyped");
      console.log(`name: ${name}, weight: ${credits}`);
      btnErr(new Error("Name or weight missing or mistyped"));
      return;
    }

    /** @type {Course} */
    const modifiedCourse = {
      courseID: course.courseID,
      courseName: name,
      courseCredits: Number(credits),
      courseDescription: description
    };

    networkPost(`${apiURL}/courses/edit`, {
      semesterID: semester.semesterID,
      modifiedCourse: modifiedCourse,
    })
      .then((res) => {
        // We don't really care about the response other than it's response
        // code 200 and error code 0 (checked by networkPost).
        console.log("Edit request finished");

        // Server has accepted the changed course: replace parent's course list
        // with a new list where this course's entry is changed.
        setCourseList((prevCourseList) => {
          const newList = prevCourseList.map((cou) => {
            return (cou.courseID === course.courseID) ? modifiedCourse : cou;
          });
          // FIXME how to change the context here?
          console.log(`Modified course ${course.courseName}`);
          console.log(newList);
          return newList;
        });
        
        btnDone();
      })
      .catch((err) => {
        // Server has refused the changed course
        console.log(`Edit request was unsuccessful!\n${err}`);
        btnErr(err);
        alert(`Edit request was unsuccessful!\n${err}`);
        return;
      });
  }, [name, credits, course, description, apiURL, semester, setCourseList]);
  
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
        title={`courseID: ${course.courseID}`}
        suppressContentEditableWarning={true} // The only child is text so it's ok
      >
        {/* Can't be {name} because React will keep updating it and setting
        the caret to the beginning. Instead, give the contentEditable an
        initial value and update the React name state to the contentEditable's
        content on change, but never set the CE's actual content to the React
        state. */}
        {course.courseName}
      </div>

      <div className="horizontal-line" />

      {/* Course credits entry */}
      <PreviewItemInline ico={weightIco} name="Credits">
        <label htmlFor="Date" />
        <input
          className={`input-small dash-input`}
          type="text"
          min="0"
          max="9999"
          name="Credits"
          value={credits}
          onChange={changeWeight}
        />
      </PreviewItemInline>

      {/* Semester (not editable) */}
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
      
      <div style={{ flexGrow: "1" }}></div>
      
      {/* Buttons */}
      <div className="preview-item preview-buttons">
        <LoadingButton name="Save" longFunction={sendEdit} />
      </div>
    </div>
  );
}

export default PreviewCourseEdit;
