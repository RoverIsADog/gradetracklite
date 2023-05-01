// @ts-check
import React from 'react'
import About from '@/pages/About';

/**
 * This component is basically a "wrapper" over the about page so that it
 * fits inside of the content-area.
 * @returns {JSX.Element}
 */
function ContentAbout() {

  return (
    <div
      style={{
        maxWidth: "100%",
        maxHeight: "100%",
        overflow: "auto"
      }}
    >
      <About />
    </div>
  );
}

export default ContentAbout;