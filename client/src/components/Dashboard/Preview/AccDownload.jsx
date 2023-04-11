// @ts-check
import { apiLocation } from "App";
import React, { useContext } from "react";
import { networkGet } from "utils/NetworkUtils";
import LoadingButton from "../common/LoadingButton";

/**
 * Preview component for downloading all of a user's data.
 * @returns {JSX.Element}
 */
function PreviewAccDownload() {
  const apiURL = useContext(apiLocation);

  const handleDownload = (btnDone, btnErr) => {
    console.log("Starting data download");

    networkGet(`${apiURL}/account/download`)
      .then((res) => {

        console.log("Data is");
        console.log(res);

        btnDone();

        // Save response to file. Inspired by
        // https://stackoverflow.com/questions/34156282/how-do-i-save-json-to-local-text-file
        const a = document.createElement("a");
        var file = new Blob([JSON.stringify(res, null, 4)], { type: "text/plain" });
        a.href = URL.createObjectURL(file);
        a.download = "data.json";
        a.click();


      })
      .catch((err) => {
        alert(`Error while downloading data!\n${String(err)}`);
        btnErr(err);
      });
  };

  return (
    <div className="card thin-scrollbar" id="preview-card">
      <div className="preview-name">Download data</div>
      <div className="preview-item preview-text">
        You can request a download of all the data concerning this account that are stored in the
        system in a JSON file.
      </div>
      <div style={{ flexGrow: "1" }}></div>
      <div className="preview-item preview-buttons">
        <LoadingButton name="Download" longFunction={handleDownload} />
      </div>
    </div>
  );
}

export default PreviewAccDownload;
