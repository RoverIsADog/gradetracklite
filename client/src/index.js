import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <React.StrictMode>
      {/* Keep basename up to date with package.json's homepage */}
      <BrowserRouter basename="">
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </>
);
