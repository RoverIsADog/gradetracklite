import React from "react";
import { Routes, Route } from "react-router-dom";
import Attributions from "./pages/Attributions";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard"; // Path: /app

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
    <Routes>
      <Route path="/" element={<AuthPage />}></Route>
      <Route path="/app" element={<Dashboard />}></Route>
      <Route path="/attributions" element={<Attributions />}></Route>
    </Routes>
  );
}

export default App;
