import React, { createContext } from "react";
import { Routes, Route } from "react-router-dom";
import About from "./pages/About";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard"; // Path: /app

/**
 * "Global" context to give all pages access to the API's domain (and port).
 * Components should append their requests to this instead of hardcoding
 * the link since we don't know where the API will be hosted.
 *
 * TOOD: Get this from a file or env variable or something (1 hardcode is
 * still better than many though)
 */
const apiLocation = createContext(null);

function App() {
  /* 
  On page load, the user will either be directed to the login/registration page if they enter
  the path '/' and the dashboard page otherwise.

  React router paths are clientside only (React-Router intercepts Link clicks & rerenders the
  page). If the user refreshes on a production build, they will get a 404.

  https://stackoverflow.com/questions/27928372/react-router-urls-dont-work-when-refreshing-or-writing-manually
  
  If we host on mimi, we'll have to have rewrite rules to send the paths to the compiled
  index.html (so that React-Router can render the appropriate page).

  Unless to add new pages or add common element (eg a common header), App.js should not contain any
  components.
  */
  return (
    <apiLocation.Provider value='http://localhost:8000'>
      <Routes>
        <Route path="/" element={<AuthPage />}></Route>
        <Route path="/app" element={<Dashboard />}></Route>
        <Route path="/about" element={<About />}></Route>
      </Routes>
    </apiLocation.Provider>
  );
}

export { apiLocation };
export default App;
