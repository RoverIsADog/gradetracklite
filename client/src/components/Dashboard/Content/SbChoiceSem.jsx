// @ts-check
import React, { useContext, useEffect, useState } from "react";
import plusIco from "img/plus-svgrepo-com.svg";
import trashIco from "img/delete-1-svgrepo-com.svg";
import semIco from "img/calendar-svgrepo-com.svg";
import ContentSemEdit from "./SemEdit";
import ContentSemAdd from "./SemAdd";
import ContentEmpty from "./ContentEmpty";
import { networkPost } from "utils/NetworkUtils";
import { apiLocation } from "App";

/**
 * A component that is responsible for displaying a list of things to select
 * in the sidebar. Used to display a list of semesters and courses.
 *
 * Props required for displaying UI:
 * name, icon and id (of the list for CSS purposes)
 *
 * Props relating to the list
 * list: list of things to display. Can be null if override is true.
 * valueToName: function that takes an element in the list and returns its
 *              name and id for display
 *
 * Callbacks for when a user selects one of the options
 * onSelect: fn ((selectedID) => ...)
 * onPlus: fn (() => ...)
 *
 * Override: If this is set to true, then it the list will be replaced by the
 * component's children.
 * 
 * @typedef {{semesterID: string, semesterName: string}} Semester
 * @typedef {{courseID: string, courseName: string, courseCredit: number, courseDescription: string}} Course
 * 
 * @typedef {{id: string, content: JSX.Element}} Selected
 * 
 * @typedef {{error: number, message: string, semesterList: Semester[]}} listSemestersResponse
 * @typedef {{loading: boolean, error: Error, data: listSemestersResponse}} listSemestersFetchMetrics
 * 
 * @typedef {{error: number, message: string, courseList: Course[]}} listCoursesResponse
 * @typedef {{loading: boolean, error: Error, data: listCoursesResponse}} listCoursesFetchMetrics
 * @param {{
 *   semFetchMetrics: listSemestersFetchMetrics, 
 *   selected: Selected, 
 *   setSelected: React.Dispatch<React.SetStateAction<Selected>>,
 *   children?: React.ReactNode,
 *   selectedSemester: Semester,
 *   setSelectedSemester: React.Dispatch<React.SetStateAction<Semester>>
 * }} props
 */
function SidebarChoiceSemester({ semFetchMetrics, selected, setSelected, children, selectedSemester, setSelectedSemester }) {
  const apiURL = useContext(apiLocation);

  const { loading, error, data } = semFetchMetrics;

  /** @type {[Semester[] | null, React.Dispatch<React.SetStateAction<Semester[] | null>>]} */
  const [semList, setSemList] = useState(null);

  useEffect(() => {
    data && data.semesterList && setSemList(data.semesterList);
  }, [loading, error, data]);

  const semPlusHandler = () => {
    setSelected({ id: "__plus-semester", content: <ContentSemAdd setSemesterList={setSemList} setSelected={setSelected} /> });
    setSelectedSemester(null);
  }

  let displayed;
  if (children) {
    displayed = children;
  }
  else if (error) {
    displayed = <div>Error: {String(error)}</div>
  }
  else if (loading || !data || !data.semesterList || !semList) {
    displayed = <div>Loading...</div>
  }
  else if (semList.length !== 0) {
    displayed = semList.map((sem, idx) => {

      const semClickHandler = () => {
        setSelectedSemester({ ...sem }); // Locally set state
        setSelected({
          id: sem.semesterID,
          content: <ContentSemEdit semester={sem} setSemesterList={setSemList} />
        });
      };

      const semDeleteSem = (/** @type {React.MouseEvent<HTMLElement>} */ e) => {
        e.stopPropagation(); // Don't select the thing
        console.log(`Starting remove semester: ${sem.semesterID}`);

        networkPost(`${apiURL}/semesters/delete`, {
          semesterID: sem.semesterID
        }).then((res) => {
          console.log("Semester deletion successful");

          setSemList((prevList) => {
            const newList = prevList.filter((s) => s.semesterID !== sem.semesterID);
            console.log("Replaced the semester list with: ");
            console.log(newList);
            return newList;
          });
          
          setSelectedSemester( null );
          setSelected({ id: "", content: <ContentEmpty /> });

        }).catch((err) => {
          console.log("Semester deletion failed!");
          console.log(err);
          alert(`Semester deletion failed!\n${err}`);
        })
    
      }

      const isSelected = (selected.id === sem.semesterID) || (selectedSemester && selectedSemester.semesterID === sem.semesterID);
      return (
        <div
          className={`sb-choice-list-element sb-selectable ${isSelected ? "sb-selected" : ""}`}
          key={sem.semesterID}
          onClick={semClickHandler}
        >
          {sem.semesterName}
          <div style={{flexGrow: "1"}} />
          <img src={trashIco} alt={`Delete ${sem.semesterName}`} onClick={semDeleteSem}/>
        </div>
      );

    });
  } else {
    displayed = <div>No semesters in the account</div>;
  }

  return (
    <>
      <div className="sb-choice" id="semester-container">
        {/* Header (img, name, +) */}
        <div className="sb-choice-header">
          <img className="sb-choice-header-ico" src={semIco} alt="Semester icon" />
          <div className="sb-choice-header-name">Semesters</div>
          <img
            className="sb-choice-header-plus sb-selectable"
            src={plusIco} alt="Plus icon"
            onClick={semPlusHandler} title={'Add a semester'} />
        </div>

        {/* actually display the list */}
        <div className="sb-choice-list thin-scrollbar">
          {displayed}
        </div>
      </div>
    </>
  );
}

export default SidebarChoiceSemester;
