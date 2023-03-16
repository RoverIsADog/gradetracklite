// @ts-check
import { useEffect, useState } from "react";

/**
 * Hook that uses fetch API to do a GET request to some given address, and
 * get back data in the form of JSON (assume all data exchanges are done in
 * JSON).
 * 
 * Returns 3 fields relating to the current state of the request: { data, 
 * loaded and error }.
 * 
 * As long as loaded === false, the request is still not over and we should
 * assume it's loading. When loaded === true, then either there was an error
 * (error is not null) or everything was ok and the data (in JSON form) is
 * contained in data.
 * 
 * Errors include both network failures and any response that is not "ok"
 * (response.ok). I think it means status != 200 but don't quote me on that.
 * 
 * TODO modify this hook to be able to use POST aswell.
 * 
 * @param {string} url
 * @returns Object containing the 3 monitoring fields.
 */
function useFetch(url) {
  // State declarations
  const [data, setData] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Fetching from " + url);
    // We make a fetch request, returning a promise
    fetch(url)
      /* .then: We wait until the promise resolves (AKA the response arrives), then run
        the function defined below with the response as argument that will do some
        error checking and convert it into JSON (another promise). */
      .then((response) => {
        // Fetch API only throws error if network failure.
        // 404 / other errors don't throw errors and we must handle here.
        console.log(response)
        if (!response.ok) {
          throw new Error("Error: response status: " + response.status);
        }
        console.log("Response received and is OK");
        console.log(response);
        return response.json(); // Another promise
      })
      /* .then: We wait until the promise resolves (AKA the response is parsed into JSON)
        then run the function defined below with the JSON data as argument that will update
        the states. */
      .then((json) => {
        console.log("Response JSON content is");
        console.log(json);
        setError(null); // Reset error in case of future requests
        setLoaded(true);
        setData(json);
      })
      .catch((err) => {
        console.log("Error with request");
        console.log(err);
        setError(err);
        setLoaded(true);
      });
  }, [url]); // Empty dependency array = runs on mount only

  return { data, loaded, error };
}

export default useFetch;
