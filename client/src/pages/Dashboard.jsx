// @ts-check
import React, { createContext, useState } from "react";
import Sidebar from "@/components/Dashboard/Sidebar";
import "@/css/dashboard/styles.css";
import "@/css/dashboard/input.css";
import "@/css/dashboard/colors.css";
import { readCookie } from "@/utils/Util";

/**
 * Context providing a function to allow changing the theme of the dashboard.
 * 
 * Could be moved up the component so that the login page can also use it, but
 * there are no more user-defined divs above the dashboard (except root &
 * body), so we can't easily set a property data-theme. 
 * @type {React.Context<{theme: string, toggleTheme: () => void}>}
 */
const contextTheme = createContext(null);

/**
 * Component responsible for displaying the dashboard located at /app.
 * The component is not named App because of obvious conflicts.
 *
 * THIS COMPONENT REPRESENTS AN ENTIRE PAGE. When displayed, it should
 * be the only component visible to the screen (excluding root obv) just
 * like all other components in the /src/page/ folder.
 *
 * The dashboard is made up of 3 items side by side in a flexbox:
 * a sidebar, a course info, and an item preview pane. Each are in
 * their own components.
 */
function Dashboard() {
  // Dark mode CSS loading management
  // We could save this in local storage but whatever
  const [theme, setTheme] = useState(readCookie("theme") || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light"));
  
  const toggleTheme = () => {
    console.log("Toggling dark mode...");

    // Ask the user for permission to save the theme cookie.
    let saveIntoCookie = false;
    if (!readCookie("theme")) {
      saveIntoCookie = window.confirm("Do you want to save this setting in your cookies so that it persists across sessions?");
    }

    setTheme((prev) => {
      const newTheme = prev === "light" ? "dark" : "light";
      if (saveIntoCookie) document.cookie = `theme=${newTheme}; SameSite=Strict`;
      return newTheme;
    });
  };

  return (
    <contextTheme.Provider value={{ theme, toggleTheme }}>
      <div id="dashboard-container" data-theme={theme}>
        <Sidebar />
      </div>
    </contextTheme.Provider>
  );
}

export { contextTheme };
export default Dashboard;
