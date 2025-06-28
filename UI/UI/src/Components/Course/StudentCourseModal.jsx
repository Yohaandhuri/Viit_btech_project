/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { useQuery } from "@apollo/client";
import { GET_USER } from "../Graphql/Queries";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./StudentCourseModal.css";

function StudentCourseModal({ course, isMyCourse, onClose, onEnroll }) {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { data } = useQuery(GET_USER, {
    variables: { id: course.facultyId },
    skip: !course.facultyId,
  });

  const faculty = data?.getUser;

  const handleGoToCourse = () => {
    navigate(`/student/${userId}/course/${course.id}`, { state: { course } });
  };

  return (
    <div className="modal-overlay">
      <div className="course-modal">
        <h2 className="modal-header">{course.title}</h2>

        <div className="modal-section">
          <strong>Duration:</strong> {course.duration}
        </div>
        <div className="modal-section">
          <strong>Credits:</strong> {course.credits}
        </div>

        {faculty && (
          <div className="modal-section">
            <strong>Faculty:</strong> {faculty.firstName} {faculty.lastName} ({faculty.email})
          </div>
        )}

        <div className="modal-buttons">
          <div className="button-group">
            {!isMyCourse ? (
              <button className="modal-button enroll-button" onClick={() => onEnroll(course.id)}>
                Enroll
              </button>
            ) : (
              <button className="modal-button go-to-course-button" onClick={handleGoToCourse}>
                Go to Course
              </button>
            )}
            <button className="modal-button close-button" onClick={onClose}>
              X
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentCourseModal;
