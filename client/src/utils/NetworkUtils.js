// @ts-check
import axios from "axios";
import { readCookie } from "./Util";


/**
 * Helper function to send an API request.
 * @param {string} url URL to the API: /api/v1/...
 * @param {any} payload JS object to be sent as the POST payload
 * @param {(err: Error | null, res: any) => void} callback 
 * Function to be called when the request finishes.
 */
export function networkPost(url, payload, callback) {
  console.log("Sending POST with payload: ");
  console.log(payload);
  
  const token = readCookie("token");
  
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? "Bearer " + token : "",
    },
    body: JSON.stringify(payload)

  }).then((response) => {
    if (!response.ok) {
      throw new Error("Error: response status: " + response.status);
    }
    console.log("Response received and is OK");
    console.log(response);
    return response.json();

  }).then((json) => {
    console.log("Response JSON content is");
    console.log(json);

    if (json.error && json.error !== 0) {
      throw new Error(json.message);
    }
    callback(null, json);

  }).catch((err) => {
    console.log("Error with request");
    console.log(err);
    callback(err, null)
  })
}