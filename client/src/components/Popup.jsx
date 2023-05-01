import React, { useContext } from "react";
import "../css/popup.css";
import { apiLocation } from "@/App";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import useFetch from "@/hooks/useFetch";
import Paragraph from "./Dashboard/common/Paragraph";

function Popup(props) {
  const apiURL = useContext(apiLocation);

  const {
    loading: loadingPrivacy,
    error: errorPrivacy,
    data: dataPrivacy,
  } = useFetch(`${apiURL}/docs/privacy`);
  const {
    loading: loadingTerms,
    error: errorTerms,
    data: dataTerms,
  } = useFetch(`${apiURL}/docs/terms`);

  if (!props.trigger) {
    return <></>;
  }

  return (
    <div className="popup">
      <div className="popup-inner">
        <button className="close-btn auth-button" onClick={() => props.setTrigger(false)}>
          close
        </button>

        {/* Privacy Policy */}
        <Paragraph name="Cookies, Terms and Privacy">
        <p>This website uses two cookies: "theme" and "token"</p>
          <ul>
            <li>
              token: stores your authentication token. The site cannot function without it. Removed
              on logout.
            </li>
            <li>
              theme: either "dark" or "light".{" "}
              <b>Only set if you change the theme from the default</b> (click the sun/moon).
            </li>
          </ul>
          <p>
            The privacy policy and terms of service are provided by your host. Read them carefully
            and contact them if you have any questions.
          </p>
        </Paragraph>

        {/* Privacy Policy */}
        <Paragraph name="Your Host's Privacy Notice">
          {loadingPrivacy && <div>loading privacy policy...</div>}
          {errorPrivacy && <div style={{ color: "red" }}>Error loading privacy policy!</div>}
          {dataPrivacy && <ReactMarkdown>{dataPrivacy.content}</ReactMarkdown>}
        </Paragraph>

        {/* Terms of Use */}
        <Paragraph name="Your Host's Terms of Use">
          {loadingTerms && <div>loading privacy policy...</div>}
          {errorTerms && <div style={{ color: "red" }}>Error loading privacy policy!</div>}
          {dataTerms && <ReactMarkdown>{dataTerms.content}</ReactMarkdown>}
        </Paragraph>
      </div>
    </div>
  );
}

export default Popup;
