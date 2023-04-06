// @ts-check
import React, { useContext, useEffect, useState } from "react";
import "../../../css/dashboard/preview.css";
// @ts-ignore
import gradeIco from "../../../img/abacus-svgrepo-com.svg";
// @ts-ignore
import weightIco from "../../../img/weight-svgrepo-com.svg";
// @ts-ignore
import dateIco from "../../../img/time-svgrepo-com.svg";
// @ts-ignore
import categoryIco from "../../../img/bookshelf-library-svgrepo-com.svg";
// @ts-ignore
import courseIco from "../../../img/education-books-apple-svgrepo-com.svg";
// @ts-ignore
import descriptionIco from "../../../img/open-book-svgrepo-com.svg";
import { contextCourse, contextSelectedItem, contextSemester } from "../ContentPane";
import { floatToPercentStr } from "../../../utils/Util";
import LoadingButton from "./LoadingButton";
import EmptyPreview from "./EmptyPreview";
import { networkPost } from "../../../utils/NetworkUtils";
import { apiLocation } from "../../../App";

/**
 * Renders a preview pane that allows the user to modify a grade to the
 * selected category by changing its (grade, weight, date(opt),
 * description(opt)).
 *
 * The category and course are gotten from context and can't be edited.
 *
 * See ContentGradeList for the type declaration of a category, but it's
 * subject to change as of writing. IT IS NOT THE SAME AS THE CATEGORY FROM
 * CONTENTCATEGORYLIST!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 *
 * See ContentGradeList for the type declaration of a grade, but it's subject
 * to change as of writing.
 *
 * @typedef {{gradeID: string, gradeName: string, gradeWeight: number, gradePointsAct: number, gradePointsMax: number, gradeDescription: string, gradeDate: string}} Grade
 * @typedef {{categoryID: string, categoryName: string, categoryWeight: number, categoryDescription: string, categoryGradeList: Array<Grade>}} Category
 *
 * @param {{category: Category, grade: Grade, gradeList: Array<Grade>, setGradeList: React.Dispatch<React.SetStateAction<Array<Grade>>>}} props
 * @returns {JSX.Element}
 */
function PreviewGradeModify({ category, grade, setGradeList }) {
  const apiURL = useContext(apiLocation);
  const course = useContext(contextCourse);
  const semester = useContext(contextSemester);
  const selected = useContext(contextSelectedItem);
  
  // Values for controlled inputs
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
  
  This is because the old grade's preview component isn't unmounted and the
  same preview component is used to display the new grade (aka the states
  aren't set to the prop's values).
  
  So, we have to set the states of every controlled component on every prop
  change. All user changeable fields must be controlled components.
  
  Sometimes I really hate React */
  useEffect(() => {
    if (grade) {
      setPtsAct(String(grade.gradePointsMax));
      setPtsMax(String(grade.gradePointsMax));
      setDate(String(grade.gradeDate));
      setWeight(String(grade.gradeWeight));
      setDescription(String(grade.gradeDescription));
    }
  }, [category, grade]);

  /** @type {(e: React.ChangeEvent<HTMLInputElement>) => void} */
  const changePtsAct = (e) => {
    const newVal = e.target.value;
    if (newVal.length > 4) return;
    setPtsAct(newVal);
  };
  const changePtsMax = (e) => {
    const newVal = e.target.value;
    if (newVal.length > 4) return;
    setPtsMax(newVal);
  };

  const sendDelete = (btnDone, btnErr) => {

    console.log("Starting deletion request...");
    networkPost(
      `${apiURL}/grades/delete`,
      {
        gradeID: grade.gradeID,
      },
      (err, res) => {
        console.log("Deletion request finished");
        // Server has refused the deletion request
        if (err) {
          console.log("Deletion request was unsuccessful!");
          btnErr(err);
          alert("Deletion request was unsuccessful! " + err);
          return;
        };

        // Server has accepted the deletion: replace parent's grade list
        // with a new list where this grade's entry is removed.
        setGradeList((prevGradeList) => {
          const newList = prevGradeList.filter((g) => {
            return g.gradeID !== grade.gradeID;
          });
          return newList;
        });
        selected.setSelectedItem({id: "", preview: <EmptyPreview />});
        btnDone();

      }
    )
  }

  const sendEdit = (btnDone, btnErr) => {
    console.log("Starting edit request...")

    /** @type {Grade} */
    const modifiedGrade = {
      gradeID: grade.gradeID,
      gradeName: grade.gradeName,
      gradePointsAct: Number(ptsAct),
      gradePointsMax: Number(ptsMax),
      gradeDate: date,
      gradeWeight: Number(weight),
      gradeDescription: description,
    }

    networkPost(
      `${apiURL}/grades/edit`,
      {
        modifiedGrade: modifiedGrade
      },
      (err, res) => {
        console.log("Edit request finished");
        // Server has refused the changed grade
        if (err) {
          console.log("Edit request was unsuccessful!");
          btnErr(err);
          alert("Edit request was unsuccessful! " + err);
          return;
        };
  
        // Server has accepted the changed grade: replace parent's grade list
        // with a new list where this grade's entry is changed.
        setGradeList((prevGradeList) => {
          const newList = prevGradeList.map((gr) => {
            return gr.gradeID === grade.gradeID ? modifiedGrade : gr;
          })
          console.log(`Modified grade ${grade.gradeName}`);
          console.log(newList);
          return newList;
        })
  
        btnDone();
      }
    )
  }
  
  return (
    <>
      <div key={grade.gradeID + "123"} className="card thin-scrollbar" id="preview-card">
        <div className="preview-name">{grade.gradeName}</div>
        <div className="horizontal-line" />

        {/* Grade preview entry */}
        <div className="preview-item preview-inline">
          <div className="preview-inline-left">
            <img className="preview-item-ico" src={gradeIco} alt="grade" />
            <div className="preview-item-name">Grade</div>
          </div>
          <div className="preview-inline-right">
            <div>({floatToPercentStr(Number(ptsAct) / Number(ptsMax))})&nbsp;</div>
            <label htmlFor="points-actual" />
            <input className="input-small dash-input" type="text" min="0" max="9999" name="points-actual" maxLength={4} value={ptsAct} onChange={changePtsAct}></input>

            <div>&nbsp;/&nbsp;</div>

            <label htmlFor="points-max" />
            <input className="input-small dash-input" type="text" min="0" max="9999" name="points-max" maxLength={4} value={ptsMax} onChange={changePtsMax}></input>
          </div>
        </div>

        {/* Weight preview entry */}
        <div className="preview-item preview-inline">
          <div className="preview-inline-left">
            <img className="preview-item-ico" src={weightIco} alt="weight" />
            <div className="preview-item-name">Weight</div>
          </div>
          <div className="preview-inline-right">
            <label htmlFor="weight" />
            <input
              className="input-small dash-input"
              type="text"
              name="weight"
              value={weight}
              readOnly={true}
            />
          </div>
        </div>

        {/* Date preview entry */}
        <div className="preview-item preview-inline">
          <div className="preview-inline-left">
            <img className="preview-item-ico" src={dateIco} alt="date" />
            <div className="preview-item-name">Date</div>
          </div>
          <div className="preview-inline-right">
            <label htmlFor="weight" />
            <input
              className="input-large dash-input"
              type="date"
              name="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        {/* Category preview entry */}
        <div className="preview-item preview-inline">
          <div className="preview-inline-left">
            <img className="preview-item-ico" src={categoryIco} alt="category" />
            <div className="preview-item-name">Category</div>
          </div>
          <div className="preview-inline-right">
            <div className="cap-text" style={{ paddingLeft: "1rem", WebkitLineClamp: 3 }}>
              {category.categoryName}
            </div>
          </div>
        </div>

        {/* Course preview entry */}
        <div className="preview-item preview-inline">
          <div className="preview-inline-left">
            <img className="preview-item-ico" src={courseIco} alt="course" />
            <div className="preview-item-name">Course</div>
          </div>
          <div className="preview-inline-right">
            <div className="cap-text" style={{ paddingLeft: "1rem", WebkitLineClamp: 3 }}>
              {course.name}
            </div>
          </div>
        </div>

        {/* Description preview entry */}
        <div className="preview-item preview-vertical">
          <div className="preview-vertical-about">
            <img className="preview-item-ico" src={descriptionIco} alt="description" />
            <div className="preview-item-name">Description</div>
          </div>
          <textarea
            className="thin-scrollbar dash-textarea"
            style={{ transition: "0" }} name="grade-description"
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div style={{ flexGrow: "1" }}></div>
        <div className="preview-item preview-buttons">
          <LoadingButton name="Delete" longFunction={sendDelete} />
          <LoadingButton name="Save" longFunction={sendEdit} />
        </div>
      </div>
    </>
  );
}

export default PreviewGradeModify;
