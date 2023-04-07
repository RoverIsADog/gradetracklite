import React, { useState } from "react";
import plusIco from "img/plus-svgrepo-com.svg";
import trashIco from "img/delete-1-svgrepo-com.svg";

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
 */
function SidebarChoice({ name, icon, id, list, valueToName, onSelect, onPlus, override = false, children }) {
  /* Current selection manager */
  const [curSelection, setCurSelection] = useState(null);
  const handleClick = (sel) => {
    console.log(`Selected ${sel.name} ${curSelection}`);
    setCurSelection(sel.id);
    if (onSelect) onSelect(sel);
  };

  let displayed;
  if (override) displayed = children;
  else {
    if (list.length !== 0) {
      displayed = list.map((value, idx) => {
        const [elID, elName] = valueToName(value);
        return <ChoiceElement isSelected={curSelection === elID} name={elName} key={elID} onClick={() => handleClick({id: elID, name: elName})} />;
      });
    } else {
      displayed = <div>No courses</div>;
    }
  }

  if (!override) {
    console.log(name + " SC displayed: VV");
    console.log(displayed);
  }

  return (
    <>
      <div className="sb-choice" id={id}>
        {/* Header (img, name, +) */}
        <div className="sb-choice-header">
          <img className="sb-choice-header-ico" src={icon} alt="Semester icon" />
          <div className="sb-choice-header-name">{name}</div>
          <img className="sb-choice-header-plus sb-selectable" src={plusIco} alt="Plus icon" onClick={onPlus} title={'Add ' + name.toLowerCase()} />
        </div>

        {/* actually display the list */}
        <div className="sb-choice-list thin-scrollbar">
          {displayed}
        </div>
      </div>
    </>
  );
}

function ChoiceElement({ isSelected, name, onClick }) {
  const selected = isSelected ? "sb-selected" : "";

  const handleDelete = (/** @type {React.MouseEvent<HTMLElement>} */ e) => {
    e.stopPropagation(); // Don't select the thing
    alert("Unimplemented!");
  }

  return (
    <div className={`sb-choice-list-element sb-selectable ${selected}`} onClick={onClick}>
      {name}
      <div style={{flexGrow: "1"}} />
      <img src={trashIco} alt={`Delete ${name}`} onClick={handleDelete}/>
    </div>
  );
}

export default SidebarChoice;
