import React, { useState } from "react";

/**
 *
 * @param {{name: string, longFunction: (done: () => void) => void }} props
 * @returns
 */
function LoadingButton({ name, longFunction }) {
  const [loading, setLoading] = useState(false);
  const done = () => {
    console.log(`"${name}" button unblocked`);
    setLoading(false);
  };

  const handleClick = () => {
    console.log(`"${name} button blocked`);
    setLoading(true);
    if (loading) {
      console.log("Please wait for the request to finish loading before clicking again");
      return;
    }
    longFunction(done);
  };

  return (
    <button onClick={handleClick} disabled={loading}>
      {name}
      {loading && "..."}
    </button>
  );
}

export default LoadingButton;
