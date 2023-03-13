import React, { createContext, useState } from "react";
import Course from "../components/Dashboard/Course";
import Preview from "../components/Dashboard/Preview";
import Sidebar from "../components/Dashboard/Sidebar";
import "../css/dashboard/styles.css";
import "../css/dashboard/input.css";

const contextDark = createContext();

/**
 *
 */
function Dashboard() {

  // Dark mode CSS loading management
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => {
    console.log("Toggling dark mode...");
    setDarkMode((prev) => !prev);
  };

  if (!darkMode) require("../css/dashboard/color-bright.css");
  else require("../css/dashboard/color-dark.css");

  return (
    <contextDark.Provider value={{ darkMode, toggleDarkMode }}>
      <div id="dashboard-container">
        <Sidebar />
        <Course />
        <Preview />
      </div>
    </contextDark.Provider>
  );
}

export { contextDark };
export default Dashboard;
