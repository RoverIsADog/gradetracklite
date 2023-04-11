// @ts-check
import React, { useContext, useEffect, useMemo, useState } from "react";
import "css/dashboard/preview.css";
import "css/dashboard/styles.css";
import semesterIco from "img/calendar-svgrepo-com.svg";
import weightIco from "img/weight-svgrepo-com.svg";
import descriptionIco from "img/open-book-svgrepo-com.svg";
import { networkPost } from "utils/NetworkUtils";
import { apiLocation } from "App";
import LoadingButton from "../common/LoadingButton";
import { isNumber } from "utils/Util";
import PreviewItemInline from "../Preview/ItemInline";
import PreviewItemVertical from "../Preview/ItemVertical";

/**
 * @typedef {{semesterID: string, semesterName: string}} Semester
 * @typedef {{courseID: string, courseName: string, courseCredits: number, courseDescription: string}} Course
 * @typedef {{courseName: string, courseCredits: number, courseDescription: string}} CandidateCourse
 * @typedef {{id: string, content: JSX.Element}} Selected
 * 
 * @param {{
 *   semester: Semester
 *   setCourseList: React.Dispatch<React.SetStateAction<Course[] | null>>
 *   setSelected: React.Dispatch<React.SetStateAction<Selected>>
 * }} props 
 * @returns {JSX.Element}
 */
function ContentCourseAdd({ semester, setCourseList, setSelected }) {
  const apiURL = useContext(apiLocation);

  // Values for controlled inputs
  const [name, setName] = useState("");
  const [credits, setCredits] = useState("");
  const [description, setDescription] = useState("");

  /** @type {(e: React.ChangeEvent<HTMLInputElement>) => void} */
  const changeWeight = (e) => {
    // Limit to 4 chars
    const newVal = e.target.value;
    if (newVal.length > 4) return;
    setCredits(newVal);
  };

  // See PrevGradeEdit on why this is required
  useEffect(() => {
    console.log("Reset the component!");
    setName("New Course");
    setCredits("3");
    setDescription("");
  }, []);

  /** @type {(btnDone: () => void, btnErr: (err: Error) => void) => void} */
  const sendAdd = useMemo(
    () => (btnDone, btnErr) => {
      console.log("Starting create request...");

      if (!name || !isNumber(credits)) {
        alert("Name or credits missing or mistyped");
        console.log(`name: ${name}, credits: ${credits}`);
        btnErr(new Error("Name or credits missing or mistyped"));
        return;
      }

      /** @type {CandidateCourse} */
      const candidateCourse = {
        courseName: name,
        courseCredits: Number(credits),
        courseDescription: description,
      };

      networkPost(`${apiURL}/courses/add`, {
        semesterID: semester.semesterID,
        candidateCourse: candidateCourse,
      })
        .then((res) => {
          // We don't really care about the response other than it's response
          // code 200 and error code 0 (checked by networkPost).
          console.log("Create request finished");

          /** @type {Course} */
          const newCourse = res.newCourse;

          // Server has accepted the changed semester: replace the semester list
          // with a new list where this semester's entry is changed.
          setCourseList((prevCourseList) => {
            const newList = [...prevCourseList, newCourse];
            console.log(`Added semester ${newCourse.courseName}`);
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
    },
    // eslint-disable-next-line
    [name]
  );

  return (
    <div id="course-container">
      <div id="course-itself">
        <div id="course-area" style={{ height: "100%" }}>
          <div className="content-message">Create the course on the right</div>
        </div>
      </div>
      <div id="course-display">
        <div className="card thin-scrollbar" id="preview-card">
          <div
            className="preview-name"
            contentEditable={true}
            onInput={(e) => {
              e.preventDefault();
              // console.log(e.currentTarget.textContent);
              setName(e.currentTarget.textContent);
            }}
            title={`New course`}
            suppressContentEditableWarning={true} // The only child is text so it's ok
          >
            {/* Can't be {name} because React will keep updating it and setting
            the caret to the beginning. Instead, give the contentEditable an
            initial value and update the React name state to the contentEditable's
            content on change, but never set the CE's actual content to the React
            state. */}
            {"New course"}
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
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </PreviewItemVertical>

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

export default ContentCourseAdd;
