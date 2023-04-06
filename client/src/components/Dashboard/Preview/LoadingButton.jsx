import React, { useState } from "react";

/**
 *
 * @param {{name: string, longFunction: (done: () => void, err: (err: Error) => void) => void }} props
 * @returns
 */
function LoadingButton({ name, longFunction }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const btnDone = () => {
    console.log(`"${name}" button unblocked`);
    setLoading(false);
    setError(null);
  };

  const btnErr = (err) => {
    console.log(`"${name}" button error ${err.message}`);
    setLoading(false);
    setError(err);
  }

  const handleClick = () => {
    console.log(`"${name} button blocked`);
    setError(false);
    setLoading(true);
    if (loading) {
      console.log("Please wait for the request to finish loading before clicking again");
      return;
    }
    longFunction(btnDone, btnErr);
  };

  return (
    <button onClick={handleClick} disabled={loading}>
      {loading && "Spinning..."}
      {error && " ERROR..."}
      {name}
    </button>
  );
}

export default LoadingButton;
