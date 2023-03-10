import React from "react";
import { Link } from "react-router-dom";

/**
 * 
 */
function Dashboard() {
  return (
    <div>
      <h1>Dashboard Page</h1>
      <h2>I will populate this page with my stuff later -@yzhou131</h2>
      <Link to='/attributions'>See attributions</Link>
    </div>
  );
}

export default Dashboard;
