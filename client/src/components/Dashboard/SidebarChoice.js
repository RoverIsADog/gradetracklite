import React, { useState } from "react";
import plusIco from "../../img/plus-svgrepo-com.svg";

function SidebarChoice(props) {
  let { name, icon, id, fetchMetrics } = props;

  /* Current selection manager */
  const [curSelection, setCurSelection] = useState(null);
  const handleClick = (selectedID) => {
    console.log(`Selected: ${curSelection} for choice ${name}`);
    setCurSelection(selectedID);
  };

  // console.log(`SidebarChoice initialized with name: ${name}, id: ${id}`);
  // console.log(choicesList);

  const { data, error, loading } = fetchMetrics;
  console.log("Sidebar choice is loading: " + loading)

  return (
    <>
      <div className="sb-choice" id={id}>
        {/* Header (img, name, +) */}
        <div className="sb-choice-header">
          <img className="sb-choice-header-ico" src={icon} alt="Semester icon" />
          <div className="sb-choice-header-name">{name}</div>
          <img className="sb-choice-header-plus sb-selectable" src={plusIco} alt="Plus icon" />
        </div>

        {/* actually display the list */}
        <div className="sb-choice-list thin-scrollbar">
          
          {loading && <div>LOADING...</div>}
          {data && data.semesterList.map((value, idx) => (
            <ChoiceElement
              isSelected={curSelection === value.semID}
              onClick={() => handleClick(value.semID)}
              name={value.semName}
              key={value.semID} />
          ))}
          {error && <div style={{color: 'red'}}>Something went wrong!</div>}
        </div>
      </div>
    </>
  );
}

function ChoiceElement(props) {
  let { isSelected, name, onClick } = props;
  const selected = isSelected ? "sb-selected" : "";
  return (
    <div className={`sb-choice-list-element sb-selectable ${selected}`} onClick={onClick}>
      {name}
    </div>
  );
}

export default SidebarChoice;
