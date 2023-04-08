// @ts-check
import { readCookie } from "./Util";

/**
 * Helper function to send an API request. Also does some checking beyond
 * fetch's default checks: HTTP response code is 200, our own response error
 * code is 0.
 * @param {string} url URL to the API: /api/v1/...
 * @param {any} params JS object to be sent as the GET url params
 * Function to be called when the request finishes.
 * @returns {Promise} Promise for the JSON response. Resolves into the JS
 *   object if the request is successful, rejects into the error otherwise.
 */
export async function networkGet(url, params = null) {
  return new Promise((resolve, reject) => {
    console.log("Sending GET with payload: ");
    console.log(params);

    const token = readCookie("token");
    const urlParams = (params ? ( "?" + new URLSearchParams(params) ) : "");

    fetch(url + urlParams, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? "Bearer " + token : "",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error: response status: " + response.status);
        }
        console.log("Response received and is OK");
        return response.json();
      })
      .then((json) => {
        console.log("Response JSON content is");
        console.log(json);

        if (json.error && json.error !== 0) {
          throw new Error(`Code ${json.error}: ${json.message}`);
        }
        resolve(json);
      })
      .catch((err) => {
        console.log("Error with request");
        console.log(err);
        reject(err);
      });
  });
}

/**
 * Helper function to send an API request. Also does some checking beyond
 * fetch's default checks: HTTP response code is 200, our own response error
 * code is 0.
 * @param {string} url URL to the API: /api/v1/...
 * @param {any} payload JS object to be sent as the POST payload
 * Function to be called when the request finishes.
 * @returns {Promise} Promise for the JSON response. Resolves into the JS
 *   object if the request is successful, rejects into the error otherwise.
 */
export async function networkPost(url, payload = null) {
  return new Promise((resolve, reject) => {
    console.log("Sending POST with payload: ");
    console.log(payload);

    const token = readCookie("token");

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? "Bearer " + token : "",
      },
      body: payload ? JSON.stringify(payload) : JSON.stringify({}),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error: response status: " + response.status);
        }
        console.log("Response received and is OK");
        console.log(response);
        return response.json();
      })
      .then((json) => {
        console.log("Response JSON content is");
        console.log(json);

        if (json.error && json.error !== 0) {
          throw new Error(`Code ${json.error}: ${json.message}`);
        }
        resolve(json);
      })
      .catch((err) => {
        console.log("Error with request");
        console.log(err);
        reject(err);
      });
  });
}
