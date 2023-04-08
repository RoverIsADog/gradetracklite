// @ts-check
import React, { useContext, useEffect, useMemo, useState } from "react";
import "css/dashboard/preview.css";
import "css/dashboard/styles.css";
import { networkPost } from "utils/NetworkUtils";
import { apiLocation } from "App";
import LoadingButton from "../LoadingButton";
import ContentEmpty from "./ContentEmpty";

/**
 * @typedef {{semesterID: string, semesterName: string}} Semester
 * @typedef {{semesterName: string}} CandidateSemester
 * @typedef {{id: string, content: JSX.Element}} Selected
 * 
 * @param {{
 *   setSemesterList: React.Dispatch<React.SetStateAction<Semester[] | null>>
 *   setSelected: React.Dispatch<React.SetStateAction<Selected>>,
 * }} props 
 * @returns {JSX.Element}
 */
function ContentSemAdd({ setSemesterList, setSelected }) {
  const apiURL = useContext(apiLocation);
  
  // Values for controlled inputs
  const [name, setName] = useState("");

  // See PrevGradeEdit on why this is required
  useEffect(() => {
    console.log("Reset the component!");
    setName("New Semester");
  }, []);

  /** @type {(btnDone: () => void, btnErr: (err: Error) => void) => void} */
  const sendAdd = useMemo(() => (btnDone, btnErr) => {
    console.log("Starting create request...");
    
    if (!name) {
      alert("Name missing or mistyped");
      console.log(`name: ${name}`);
      btnErr(new Error("Name missing or mistyped"));
      return;
    }

    /** @type {CandidateSemester} */
    const candidateSemester = {
      semesterName: name
    };

    networkPost(`${apiURL}/semesters/add`, {
      candidateSemester: candidateSemester,
    })
      .then((res) => {
        // We don't really care about the response other than it's response
        // code 200 and error code 0 (checked by networkPost).
        console.log("Create request finished");

        /** @type {Semester} */
        const newSemester = res.newSemester;

        // Server has accepted the changed semester: replace the semester list
        // with a new list where this semester's entry is changed.
        setSemesterList((prevSemesterList) => {
          const newList = [...prevSemesterList, newSemester];
          console.log(`Added semester ${newSemester.semesterName}`);
          console.log(newList);
          return newList;
        });
        
        btnDone();

        // setSelected({ id: "", content: <ContentEmpty /> });
      })
      .catch((err) => {
        // Server has refused the changed semester
        console.log(`Create request was unsuccessful!\n${err}`);
        btnErr(err);
        alert(`Create request was unsuccessful!\n${err}`);
        return;
      });
  }, [name, apiURL, setSemesterList]);
  
  return (
    <div id="course-container">
      <div id="course-itself">
        <div id="course-area" style={{ height: "100%" }}>
          <div className="content-message">
            Create the semester on the right
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
            title={`New semester`}
            suppressContentEditableWarning={true} // The only child is text so it's ok
          >
            {/* Can't be {name} because React will keep updating it and setting
            the caret to the beginning. Instead, give the contentEditable an
            initial value and update the React name state to the contentEditable's
            content on change, but never set the CE's actual content to the React
            state. */}
            {"New semester"}
          </div>

          <div className="horizontal-line" />
          
          <div style={{ flexGrow: "1" }}></div>

          <div>Currently, semesters only have a name</div>

          <div style={{ flexGrow: "1" }}></div>
          {/* Buttons */}
          <div className="preview-item preview-buttons">
            <LoadingButton name="Save" longFunction={sendAdd} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContentSemAdd;
