import React from 'react'
import '../../css/dashboard/content.css'
import plusIco from "../../img/plus-svgrepo-com.svg";

function Course(courseData) {
  return (<div id="course-container">
  {/* Another div level here to prevent weird padding/margin problems */}
  <div id="course-area">
    {/* Course information */}
    <div className="course-info selectable-item">
      <div className="course-name cap-text">
        COMP 444
      </div>
      <div style={{flexGrow: 1}} /> {/* Grow to push away L and R sides */}
      <div className="course-data">
        <div className="course-gpa"><span className="color-good">3.3</span> GPA (75%)</div>
        <div className="course-credits">4 Credits</div>
      </div>
    </div>
    <div className="horizontal-line-bold" />
    {/* Show categories in a list */}
    <div className="category-list thin-scrollbar">
      {/* Sample Category 1: Quizzes */}
      <div className="category-item">
        {/* Category info */}
        <div className="category-header selectable-item">
          {/* Max width to allow name to expand, min-width to allow name to shrink */}
          <div className="category-header-box">
            <div className="category-header-top">
              <div className="category-name cap-text">Quizzes and other stuff that definitely won't fit in this tiny box forcing the text to ellipsis</div>
              <div className="category-weight">15/20 (<span className="color-mid">50%</span>)</div>
            </div>
            <div className="category-description cap-text">
              Thursday every week except im making a super long message that will definitely not fit in the allocated space and it would be good if something stopped me right now instead of displaying this entire run on sentence but actually I will keep going until any and all bugs involving long text will definitely show.
            </div>
          </div>
          <img src={plusIco} alt='Plus icon' />
        </div>
        <div className="horizontal-line" />
        {/* Grades in that category */}
        <div className="grade-list">
          <div className="grade-item selectable-item selected-item">
            <div className="grade-vert-box">
              <div className="grade-name cap-text">Quiz 1</div>
              <div className="grade-description cap-text">
                Once again, a super long description that will definitely not fit in the tiny space reserved for it in the course pane but that will still be made so that we get the opportunity to tweak the CSS so that it doesn't break in the event we do get a description that long.
              </div>
            </div>
            <div className="grade-vert-box">
              <div className="grade-score">4/8 (<span className="color-mid">50%</span>)</div>
              <div className="grade-weight">weight: 5</div>
            </div>
          </div>
          <div className="grade-item selectable-item">
            <div className="grade-vert-box">
              <div className="grade-name cap-text">Quiz 2</div>
              <div className="grade-description cap-text">
                Lorem ipsum dolor sit amet.
              </div>
            </div>
            <div className="grade-vert-box">
              <div className="grade-score">6/8 (<span className="color-good">75%</span>)</div>
              <div className="grade-weight">weight: 5</div>
            </div>
          </div>
          <div className="grade-item selectable-item">
            <div className="grade-vert-box" style={{flexGrow: 1}}>
              <div className="grade-name cap-text">Quiz 3</div>
              <div className="grade-description cap-text">
                Lorem ipsum dolor sit amet, consectetur.
              </div>
            </div>
            <div className="grade-vert-box">
              <div className="grade-score">6/8 (<span className="color-good">75%</span>)</div>
              <div className="grade-weight">weight: 5</div>
            </div>
          </div>
          <div className="grade-item selectable-item">
            <div className="grade-vert-box">
              <div className="grade-name cap-text">Quiz 3</div>
              <div className="grade-description cap-text">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi rhoncus sed mauris ac tincidunt. Mauris est eros, fringilla vitae eleifend non, lacinia eu enim. Vestibulum auctor gravida commodo. In sit amet lorem non massa ultrices commodo a sit amet neque.
              </div>
            </div>
            <div className="grade-vert-box">
              <div className="grade-score">2/8 (<span className="color-bad">25%</span>)</div>
              <div className="grade-weight">weight: 5</div>
            </div>
          </div>
        </div>
      </div>
      {/* Category info */}
      <div className="category-item">
        <div className="category-header selectable-item">
          <div className="category-header-box">
            <div className="category-header-top">
              <div className="category-name cap-text">Assignments</div>
              <div className="category-weight">15/20 (<span className="color-mid">50%</span>)</div>
            </div>
            <div className="category-description cap-text">
              Due tuesday every week.
            </div>
          </div>
          <img src={plusIco} alt='Plus icon' />
        </div>
        <div className="horizontal-line" />
        {/* Grades in that category */}
        <div className="grade-list">
          <div className="grade-item selectable-item">
            <div className="grade-vert-box">
              <div className="grade-name cap-text">Assignment 1</div>
              <div className="grade-description cap-text">
                Assignmnent 1 description
              </div>
            </div>
            <div className="grade-vert-box">
              <div className="grade-score">4/8 (<span className="color-mid">50%</span>)</div>
              <div className="grade-weight">weight: 5</div>
            </div>
          </div>
          <div className="grade-item selectable-item">
            <div className="grade-vert-box">
              <div className="grade-name cap-text">Assignment 2</div>
              <div className="grade-description cap-text">
                Assignmnent 2 description
              </div>
            </div>
            <div className="grade-vert-box">
              <div className="grade-score">6/8 (<span className="color-good">75%</span>)</div>
              <div className="grade-weight">weight: 5</div>
            </div>
          </div>
          <div className="grade-item selectable-item">
            <div className="grade-vert-box">
              <div className="grade-name cap-text">Assignment 3</div>
              <div className="grade-description cap-text">
                Assignmnent 3 description
              </div>
            </div>
            <div className="grade-vert-box">
                <div className="grade-score">6/8 (<span className="color-good">75%</span>)</div>
              <div className="grade-weight">weight: 5</div>
            </div>
          </div>
          <div className="grade-item selectable-item">
            <div className="grade-vert-box">
              <div className="grade-name cap-text">Assignment 4</div>
              <div className="grade-description cap-text">
                Assignmnent 4 description
              </div>
            </div>
            <div className="grade-vert-box">
              <div className="grade-score">2/8 (<span className="color-bad">25%</span>)</div>
              <div className="grade-weight">weight: 5</div>
            </div>
          </div>
        </div>
      </div>
      {/* Category info */}
      <div className="category-item">
        <div className="category-header selectable-item">
          <div className="category-header-box">
            <div className="category-header-top">
              <div className="category-name cap-text">Exams</div>
              <div className="category-weight">15/20 (<span className="color-mid">50%</span>)</div>
            </div>
            <div className="category-description cap-text">
              Due tuesday every week.
            </div>
          </div>
          <img src={plusIco} alt='Plus icon' />
        </div>
        <div className="horizontal-line" />
        {/* Grades in that category */}
        <div className="grade-list">
          <div className="grade-item selectable-item">
            <div className="grade-vert-box">
              <div className="grade-name cap-text">Exam 1</div>
              <div className="grade-description cap-text">
                Assignmnent 1 description
              </div>
            </div>
            <div className="grade-vert-box">
              <div className="grade-score">4/8 (<span className="color-mid">50%</span>)</div>
              <div className="grade-weight">weight: 5</div>
            </div>
          </div>
          <div className="grade-item selectable-item">
            <div className="grade-vert-box">
              <div className="grade-name cap-text">Exam 2</div>
              <div className="grade-description cap-text">
                Assignmnent 2 description
              </div>
            </div>
            <div className="grade-vert-box">
              <div className="grade-score">6/8 (<span className="color-good">75%</span>)</div>
              <div className="grade-weight">weight: 5</div>
            </div>
          </div>
          <div className="grade-item selectable-item">
            <div className="grade-vert-box">
              <div className="grade-name cap-text">Exam 3</div>
              <div className="grade-description cap-text">
                Assignmnent 3 description
              </div>
            </div>
            <div className="grade-vert-box">
              <div className="grade-score">6/8 (<span className="color-good">75%</span>)</div>
              <div className="grade-weight">weight: 5</div>
            </div>
          </div>
          <div className="grade-item selectable-item">
            <div className="grade-vert-box">
              <div className="grade-name cap-text">Exam 4</div>
              <div className="grade-description cap-text">
                Assignmnent 4 description
              </div>
            </div>
            <div className="grade-vert-box">
              <div className="grade-score">2/8 (<span className="color-bad">25%</span>)</div>
              <div className="grade-weight">weight: 5</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
);
}

export default Course;