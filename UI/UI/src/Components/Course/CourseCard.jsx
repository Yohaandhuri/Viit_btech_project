/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";
import "./CourseCard.css";

function CourseCard({ course, onClick }) {
  return (
    <div className="course-card" onClick={onClick}>
      <div className="course-title">{course.title}</div>
      <div className="course-duration">Duration: {course.duration}</div>
      <div className="course-credits">Credits: {course.credits}</div>
    </div>
  );
}

export default CourseCard;
