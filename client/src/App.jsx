// @ts-check
import React, { createContext } from "react";
import { Routes, Route, Link } from "react-router-dom";
import About from "./pages/About";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard"; // Path: /app

/**
 * "Global" context to give all pages access to the path to the root of the
 * API. Access this path instead of hardcoding anything. Currently, the path is /api/...
 * 
 * In the create-react-app's development server (npm start), all requests are proxied
 * from "http://localhost:3000" to "http://localhost:8000", where the server is located.
 * 
 * In production, this relative path (without a hostname) allows API calls to be sent
 * to wherever the website was served from (which is the same as the server).
 */

/** @type {React.Context<string>} */
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
    <apiLocation.Provider value='/api/v1'>
      <Routes>
        <Route path="/" element={<AuthPage />}></Route>
        <Route path="/app" element={<Dashboard />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/404" element={<div>404 Not Found. <Link to={"/"}>Go back</Link></div>}></Route>
        <Route path="*" element={<div>404 Not Found. <Link to={"/"}>Go back</Link></div>}></Route> {/* Redirect if DNE */}
      </Routes>
    </apiLocation.Provider>
  );
}

export { apiLocation };
export default App;
