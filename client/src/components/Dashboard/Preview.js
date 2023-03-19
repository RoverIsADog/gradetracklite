import React from "react";
import '../../css/dashboard/preview.css'
import gradeIco from "../../img/abacus-svgrepo-com.svg";
import weightIco from "../../img/weight-svgrepo-com.svg";
import dateIco from "../../img/time-svgrepo-com.svg";
import categoryIco from "../../img/bookshelf-library-svgrepo-com.svg";
import courseIco from "../../img/education-books-apple-svgrepo-com.svg";
import descriptionIco from "../../img/open-book-svgrepo-com.svg";

function Preview(previewItem) {
  return (
    <>
      <div className="card thin-scrollbar" id="preview-card">
        <div className="preview-name">Quiz 1 and more text to test overflow</div>
        <div className="horizontal-line" />
        {/* Grade entry */}
        <div className="preview-item preview-inline">
          <div className="preview-inline-left">
            <img className="preview-item-ico" src={gradeIco} alt='grade' />
            <div className="preview-item-name">Grade</div>
          </div>
          <div className="preview-inline-right">
            <div>(50%)&nbsp;</div>
            <label htmlFor="points-actual" />
            <input className="input-small" type="text" name="points-actual" defaultValue={4} />
            <div>&nbsp;/&nbsp;</div>
            <label htmlFor="points-max" />
            <input className="input-small" type="text" name="points-max" defaultValue={8} />
          </div>
        </div>
        {/* Weight entry */}
        <div className="preview-item preview-inline">
          <div className="preview-inline-left">
            <img className="preview-item-ico" src={weightIco} alt='weight' />
            <div className="preview-item-name">Weight</div>
          </div>
          <div className="preview-inline-right">
            <label htmlFor="weight" />
            <input className="input-small" type="text" name="weight" defaultValue={5} />
          </div>
        </div>
        {/* Date entry */}
        <div className="preview-item preview-inline">
          <div className="preview-inline-left">
            <img className="preview-item-ico" src={dateIco} alt='date' />
            <div className="preview-item-name">Date</div>
          </div>
          <div className="preview-inline-right">
            <label htmlFor="weight" />
            <input className="input-large" type="date" name="date" defaultValue="2023-01-22" />
          </div>
        </div>
        {/* Category entry */}
        <div className="preview-item preview-inline">
          <div className="preview-inline-left">
            <img className="preview-item-ico" src={categoryIco} alt='category' />
            <div className="preview-item-name">Category</div>
          </div>
          <div className="preview-inline-right">
            <div className="cap-text" style={{ paddingLeft: "1rem", WebkitLineClamp: 3 }}>
              Quizzes and other stuff that definitely won't fit in this small space and will probably lead to overflow just to test.
            </div>
          </div>
        </div>
        {/* Course entry */}
        <div className="preview-item preview-inline">
          <div className="preview-inline-left">
            <img className="preview-item-ico" src={courseIco} alt='course' />
            <div className="preview-item-name">Course</div>
          </div>
          <div className="preview-inline-right">
            <div className="cap-text" style={{ paddingLeft: "1rem", WebkitLineClamp: 3 }}>
              COMP 444
            </div>
          </div>
        </div>
        {/* Course entry */}
        <div className="preview-item preview-vertical">
          <div className="preview-vertical-about">
            <img className="preview-item-ico" src={descriptionIco} alt='description' />
            <div className="preview-item-name">Description</div>
          </div>
          <textarea className="thin-scrollbar" style={{transition: 0}} name="grade-description" rows={6} defaultValue={"Once again, a super long description that will definitely not fit in the tiny space reserved for it in the course pane but that will still be made so that we get the opportunity to tweak the CSS so that it doesn't break in the event we do get a description that long."} />
        </div>
      </div>
    </>
  );
}

export default Preview;
