// @ts-check
import React, { useEffect, useState } from "react";
import spinner from "@/img/loading.svg"
import errorIco from "@/img/error-svgrepo-com.svg"
import successIco from "@/img/checkmark-circle-svgrepo-com.svg"

/**
 * Represents a button that, when pressed, does some long function (usually a
 * network request). It blocks while doing that long operation with a
 * spinners and other effects.
 * 
 * The long function takes two callbacks that should be called when it either
 * finishes or fails: `btnDone()` and `btnErr()`. Calling these callbacks will
 * unblock the button. 
 * 
 * __If they are not called, the button will never unblock__. This system is
 * similar to (and inspired by working with) Express middlewares' `next()`
 * callback.
 * 
 * @param {{
 *   name: string
 *   longFunction: (btnDone: () => void, btnErr: (err: Error) => void) => void
 * }} props
 * @returns {JSX.Element} A button JSX component.
 */
function LoadingButton({ name, longFunction }) {
  // Button states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Reset on prop changes due to no unmounting
  useEffect(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, [name, longFunction]);

  /**
   * Callback to be invoked by the long function when it is done and has
   * succeeded with no errors.
   */
  const btnDone = () => {
    console.log(`"${name}" button unblocked`);
    setLoading(false);
    setError(null);
    setSuccess(true);
  };

  /**
   * Callback to be invoked by the long function if it errors out.
   * @param {Error} err 
   */
  const btnErr = (err) => {
    console.log(`"${name}" button error ${err.message}`);
    setLoading(false);
    setError(err);
    setSuccess(false);
  };

  /**
   * Disable the button and run the long function on clicking the button.
   */
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

  // For convenience, override and use CSS variables instead of declaring new
  // ones. Buttons use the scrollbar accents normally, and the variables get
  // overridden on success or error.
  const styleBad = {
    "--scrollbar-thumb-color": "rgb(240, 49, 49)",
    "--scrollbar-thumb-hover-color": "rgb(175, 49, 49)",
  };
  const styleGood = {
    "--scrollbar-thumb-color": "rgb(62, 168, 32)",
    "--scrollbar-thumb-hover-color": "rgb(55, 151, 28)",
  };

  // The JSX consists of a button containing 3 images for loading, OK, error.
  // Only one is visible at any time.
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
