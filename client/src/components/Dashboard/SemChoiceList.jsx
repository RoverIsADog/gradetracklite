// @ts-check
import React, { useContext, useEffect, useState } from "react";
import plusIco from "img/plus-svgrepo-com.svg";
import trashIco from "img/delete-1-svgrepo-com.svg";
import semIco from "img/calendar-svgrepo-com.svg";
import spinner from "img/loading.svg";
import ContentSemesterEdit from "./Preview/SemEdit";
import ContentSemesterAdd from "./Preview/SemAdd";
import ContentEmpty from "./ContentEmpty";
import { networkGet, networkPost } from "utils/NetworkUtils";
import { apiLocation } from "App";

/**
 * @typedef {{semesterID: string, semesterName: string}} Semester
 * @typedef {{courseID: string, courseName: string, courseCredit: number, courseDescription: string}} Course
 * 
 * @typedef {{id: string, content: JSX.Element}} Selected
 * 
 * @typedef {{error: number, message: string, semesterList: Semester[]}} listSemestersResponse
 */

/**
 * A component that is responsible for displaying a list of semesters in the sidebar.
 * 
 * # Network
 * On page load, this component will do a network request for a list of all semesters from
 * the user, displaying a loading or error state when appropriate.
 * 
 * # Selection Management
 * Items in this list will be considered selected (with all the accompanying styles) on either
 * one of 2 conditions: their ID corresponds to the global sidebar selected, or they are the
 * concerned semester.
 * 
 * On click, the semester becomes both the global selected and the concerned semester. Since they
 * are the global selected, we display its content. If the user clicks away (a course, etc), 
 * the concerned state persists, but we no longer display its content.
 * 
 * If we click + / settings / about, they should take care of removing the concerned semester.
 * 
 * # Content-Display 
 * * Semesters entries displays a pane to modify its name as content.
 * * The plus displays a pane to add a new semester as content.
 * 
 * # Storage
 * This component stores the list of semesters gotten from the network into a `semList` state,
 * replacing it whenever there is a new network request. We also update it when we add/delete
 * semesters. This is because we must use states' content to display anything otherwise React
 * won't trigger a rerender on their change.
 * 
 * @param {{
 *   selected: Selected, 
 *   setSelected: React.Dispatch<React.SetStateAction<Selected>>,
 *   concernedSemester: Semester,
 *   setConcernedSemester: React.Dispatch<React.SetStateAction<Semester>>
 * }} props
 */
function SemesterChoiceList({ selected, setSelected, concernedSemester, setConcernedSemester }) {
  const apiURL = useContext(apiLocation);

  // Keep track of a list of semesters (populated via network request)
  /** @type {[Semester[] | null, React.Dispatch<React.SetStateAction<Semester[] | null>>]} */
  const [semList, setSemList] = useState(null);

  // Fetch list of semesters on page load
  /** @type {[[boolean, React.Dispatch<React.SetStateAction<boolean>>], [Error | null, React.Dispatch<React.SetStateAction<Error | null>>], [listSemestersResponse | null, React.Dispatch<React.SetStateAction<listSemestersResponse | null>>]]} */
  const [[loading, setLoading], [error, setError], [data, setData]] = [useState(false), useState(null), useState(null)];
  useEffect(() => {
    console.log(`Getting semesters list`);
    // Reset fetch metrics before starting
    setLoading(true); setError(null); setData(null);

    networkGet(`${apiURL}/semesters/list`)
      .then((res) => {
        setLoading(false); setError(null); setData(res);
      }).catch((err) => {
        setLoading(false); setError(err); setData(null);
      });
    // eslint-disable-next-line
  }, []);

  // And store it in `semList` after network request
  useEffect(() => {
    data && data.semesterList && setSemList(data.semesterList);
  }, [loading, error, data]);


  const semPlusHandler = () => {
    // On select plus, remove concerned semester and set global selected to add semester pane
    setConcernedSemester(null);
    setSelected({
      id: "__plus-semester",
      content: <ContentSemesterAdd setSemesterList={setSemList} setSelected={setSelected} />
    });
  }

  let listJSX;
  // Error situation
  if (error) {
    listJSX = (
      <div style={{color: "red"}}>{String(error)}</div>
    );
  }
  // Not finished loading situation
  else if (loading || !data || !data.semesterList || !semList) {
    listJSX = (
      <div style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
        <img src={spinner} alt="Spinner" style={{ height: "1.5rem" }} />
        <div>Loading</div>
      </div>
    );
  }
  // Empty situation
  else if (semList.length === 0) {
    listJSX = <div>No semesters in the account</div>;
  }
  else {
    listJSX = semList.map((sem, idx) => {

      const clickSemHandler = () => {
        // On click of a semester, set itself as the concerned semester and global selected
        // A semester's content-pane is an edit box.
        setConcernedSemester({ ...sem });
        setSelected({
          id: sem.semesterID,
          content: <ContentSemesterEdit semester={sem} setSemesterList={setSemList} />
        });
      };

      const deleteSemHandler = (/** @type {React.MouseEvent<HTMLElement>} */ e) => {
        // On click of a semester's delete icon, don't actually change any selections / concerned
        // unless it's the one we're trying to delete. Only delete on confirmation from
        // the backend.

        e.stopPropagation(); // Don't select the item
        console.log(`Starting remove semester: ${sem.semesterID}`);

        networkPost(`${apiURL}/semesters/delete`, {
          semesterID: sem.semesterID
        }).then((res) => {
          // Don't care about content since code == 0
          console.log("Semester deletion successful");

          // Replace semester list with one where the removed is gone
          setSemList((prevList) => {
            const newList = prevList.filter((s) => s.semesterID !== sem.semesterID);
            console.log("Replaced the semester list with: ");
            console.log(newList);
            return newList;
          });
          
          // Only unselect/unconcern if they are the one selected
          if (concernedSemester && concernedSemester.semesterID === sem.semesterID) {
            setConcernedSemester(null);
            setSelected({ id: "", content: <ContentEmpty /> });
          }

        }).catch((err) => {
          console.log("Semester deletion failed!");
          console.log(err);
          alert(`Semester deletion failed!\n${err}`);
        })
      }

      // Selected visual status boolean
      const isSelected = (selected && selected.id === sem.semesterID) || (concernedSemester && concernedSemester.semesterID === sem.semesterID);
      
      return (
        <div
          className={`sb-choice-list-element sb-selectable ${isSelected ? "sb-selected" : ""}`}
          key={sem.semesterID}
          onClick={clickSemHandler}
        >
          {sem.semesterName}
          <div style={{flexGrow: "1"}} />
          <img src={trashIco} alt={`Delete ${sem.semesterName}`} onClick={deleteSemHandler}/>
        </div>
      );

    });
  }

  return (
    <div className="sb-choice" id="semester-container">
      {/* Header (img, name, +) */}
      <div className="sb-choice-header">
        <img className="sb-choice-header-ico" src={semIco} alt="Semester icon" />
        <div className="sb-choice-header-name">Semesters</div>
        <img
          className={`sb-choice-header-plus sb-selectable ${selected && selected.id === "__plus-semester" && "sb-selected"}`}
          style={{ display: selected && selected.id === "__plus-semester" ? "block" : ""}}
          src={plusIco} alt="Plus icon"
          onClick={semPlusHandler} title={'Add a semester'} />
      </div>

      {/* actually display either the list or some error */}
      <div className="sb-choice-list thin-scrollbar">
        {listJSX}
      </div>
    </div>
  );
}

export default SemesterChoiceList;
