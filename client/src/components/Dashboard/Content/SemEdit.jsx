// @ts-check
import React, { useContext, useEffect, useMemo, useState } from "react";
import "css/dashboard/preview.css";
import "css/dashboard/styles.css";
import weightIco from "img/weight-svgrepo-com.svg";
import semesterIco from "img/calendar-svgrepo-com.svg";
import descriptionIco from "img/open-book-svgrepo-com.svg";
import { contextCourse, contextSemester } from "../Content/ContentPane";
import { networkPost } from "utils/NetworkUtils";
import { apiLocation } from "App";
import { isNumber } from "utils/Util";
import PreviewItemInline from "../Preview/ItemInline";
import PreviewItemVertical from "../Preview/ItemVertical";
import LoadingButton from "../LoadingButton";

/**
 * @typedef {{semesterID: string, semesterName: string}} Semester
 * @param {{
 *   semester: Semester,
 *   setSemesterList: React.Dispatch<React.SetStateAction<Semester[] | null>>
 * }} props 
 * @returns {JSX.Element}
 */
function ContentSemEdit({ semester, setSemesterList }) {
  const apiURL = useContext(apiLocation);
  
  // Values for controlled inputs
  const [name, setName] = useState("");

  // See PrevGradeEdit on why this is required
  useEffect(() => {
    console.log("Reset the component!");
    setName(String(semester.semesterName));
  }, [semester]);

  /** @type {(btnDone: () => void, btnErr: (err: Error) => void) => void} */
  const sendEdit = useMemo(() => (btnDone, btnErr) => {
    console.log("Starting edit request...");
    
    if (!name) {
      alert("Name missing or mistyped");
      console.log(`name: ${name}`);
      btnErr(new Error("Name missing or mistyped"));
      return;
    }

    /** @type {Semester} */
    const modifiedSemester = {
      semesterID: semester.semesterID,
      semesterName: name,
    };

    networkPost(`${apiURL}/semesters/edit`, {
      modifiedSemester: modifiedSemester,
    })
      .then((res) => {
        // We don't really care about the response other than it's response
        // code 200 and error code 0 (checked by networkPost).
        console.log("Edit request finished");

        // Server has accepted the changed semester: replace the semester list
        // with a new list where this semester's entry is changed.
        setSemesterList((prevSemesterList) => {
          const newList = prevSemesterList.map((sem) => {
            return (sem.semesterID === semester.semesterID) ? modifiedSemester : sem;
          });
          console.log(`Modified semester ${semester.semesterName}`);
          console.log(newList);
          return newList;
        });
        
        btnDone();
      })
      .catch((err) => {
        // Server has refused the changed semester
        console.log(`Edit request was unsuccessful!\n${err}`);
        btnErr(err);
        alert(`Edit request was unsuccessful!\n${err}`);
        return;
      });
  }, [name, apiURL, semester, setSemesterList]);
  
  return (
    <div id="course-container">
      <div id="course-itself">
        <div id="course-area" style={{ height: "100%" }}>
          <div className="content-message">
            Edit the semester on the right
          </div>
        </div>
      </div>
      <div id="course-display">
        <div
          className="card thin-scrollbar"
          id="preview-card"
        >
          <div
            className="preview-name"
            contentEditable={true}
            onInput={(e) => {
              e.preventDefault();
              // console.log(e.currentTarget.textContent);
              setName(e.currentTarget.textContent);
            }}
            title={`semesterID: ${semester.semesterID}`}
            suppressContentEditableWarning={true} // The only child is text so it's ok
          >
            {/* Can't be {name} because React will keep updating it and setting
            the caret to the beginning. Instead, give the contentEditable an
            initial value and update the React name state to the contentEditable's
            content on change, but never set the CE's actual content to the React
            state. */}
            {semester.semesterName}
          </div>

          <div className="horizontal-line" />
          
          <div style={{ flexGrow: "1" }}></div>

          <div>Currently, only the name of semesters can be changed</div>

          <div style={{ flexGrow: "1" }}></div>
          {/* Buttons */}
          <div className="preview-item preview-buttons">
            <LoadingButton name="Save" longFunction={sendEdit} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContentSemEdit;
