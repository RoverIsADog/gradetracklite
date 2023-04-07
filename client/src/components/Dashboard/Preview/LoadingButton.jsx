// @ts-check
import React, { useEffect, useState } from "react";
import spinner from "img/loading.svg"
import errorIco from "img/error-svgrepo-com.svg"
import successIco from "img/checkmark-circle-svgrepo-com.svg"

/**
 * Represents a button that, when pressed, does some long function (usually a
 * network request). It blocks while doing that long operation with a
 * spinners and other effects.
 * 
 * It takes a long-running function as argument. That long-running function is
 * responsible for calling either btnDone() or btnErr(), depending on whether
 * is succeeds or fails. This is similar to Express middlewares' next().
 * @param {{name: string, longFunction: (btnDone: () => void, btnErr: (err: Error) => void) => void }} props
 * @returns
 */
function LoadingButton({ name, longFunction }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Recall, same element is used, so have to reset on prop changes.
  useEffect(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, [name, longFunction]);

  /**
   * Function to be called if the long function is done.
   */
  const btnDone = () => {
    console.log(`"${name}" button unblocked`);
    setLoading(false);
    setError(null);
    setSuccess(true);
  };

  /**
   * Function to be called if the long function errors out.
   * @param {Error} err 
   */
  const btnErr = (err) => {
    console.log(`"${name}" button error ${err.message}`);
    setLoading(false);
    setError(err);
    setSuccess(false);
  };

  const handleClick = () => {
    console.log(`"${name} button blocked`);
    if (loading) {
      console.log("Please wait for the request to finish loading before clicking again");
      return;
    }
    setError(false);
    setLoading(true);
    setSuccess(null);
    longFunction(btnDone, btnErr);
  };

  const styleBad = {
    "--scrollbar-thumb-color": "rgb(240, 49, 49)",
    "--scrollbar-thumb-hover-color": "rgb(175, 49, 49)",
  };

  const styleGood = {
    "--scrollbar-thumb-color": "rgb(62, 168, 32)",
    "--scrollbar-thumb-hover-color": "rgb(55, 151, 28)",
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      // @ts-ignore
      style={error ? styleBad : (success ? styleGood : {})}
      title={error ? `${String(error)}\nPress to retry` : (success ? "Success" : "")}
    >
      <img
        className="preview-item-ico"
        src={spinner}
        alt={`${name} spinner`}
        style={{ paddingRight: (loading && !success) && "0.2rem", width: (loading && !success) && "1rem" }}
      />
      <img
        className="preview-item-ico"
        src={successIco}
        alt={`${name} success`}
        style={{ paddingRight: success && "0.2rem", width: success && "1rem" }}
      />
      <img
        className="preview-item-ico"
        // @ts-ignore
        src={errorIco}
        alt={`${name} error`}
        style={{ paddingRight: error && "0.2rem", width: error && "1.2rem" }}
      />
      {name}
    </button>
  );
}

export default LoadingButton;
