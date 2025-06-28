// eslint-disable-next-line no-unused-vars
import React from "react";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_USER } from "../Graphql/Queries";
import { useParams } from "react-router-dom";
import StudentNavbar from "./StudentNavbar";
import Announcements from "../Announcements";
import Chat from "../Chat";
import Quiz from "../Quiz";
import Notes from "../Notes";
import "./StudentCoursePage.css"

function StudentCoursePage() {
  // eslint-disable-next-line no-unused-vars
  const {studentId,courseId} = useParams()
  const location = useLocation();
  const course = location.state?.course;
  const { data: userData } = useQuery(GET_USER, {
      variables: { id: studentId }, // Hardcoded userId for now
    });
  console.log(userData);
  console.log("studentId",studentId);
  const { data: facultyData } = useQuery(GET_USER, {
    variables: { id: course.facultyId },
  });
  const [showFacultyModal, setShowFacultyModal] = useState(false);

  
  const [activeSection, setActiveSection] = useState("announcements");
  return (
    <div>
      {userData && <StudentNavbar firstName={userData.getUser.firstName} lastName={userData.getUser.lastName} id={studentId}/>}
      <div className="course-info">
        <h2>Course: {course.title}</h2>
        <p>Course ID: {course.id}</p>
        {facultyData && (
          <p className="faculty-info">
            Faculty:{" "}
            <span
              className="faculty-name"
              onClick={() => setShowFacultyModal(true)}
            >
              {facultyData.getUser.firstName} {facultyData.getUser.lastName}
            </span>
          </p>
        )}
      </div>

      {showFacultyModal && facultyData && (
        <div className="modal-overlay" onClick={() => setShowFacultyModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Faculty Details:</h3>
            <p><strong>Name:</strong> {facultyData.getUser.firstName} {facultyData.getUser.lastName}</p>
            <p><strong>Email:</strong> {facultyData.getUser.email}</p>
            <p><strong>Phone:</strong> {facultyData.getUser.phoneNumber}</p>
            <p><strong>Gender:</strong> {facultyData.getUser.gender}</p>
            <p><strong>Date of Birth:</strong> {facultyData.getUser.dob}</p>
            <button onClick={() => setShowFacultyModal(false)}>Close</button>
          </div>
        </div>
      )}
            

      <div className="tabs">
        <button
          className={activeSection === "announcements" ? "active" : ""}
          onClick={() => setActiveSection("announcements")}
        >
          Announcements
        </button>
        <button
          className={activeSection === "chat" ? "active" : ""}
          onClick={() => setActiveSection("chat")}
        >
          Comments
        </button>
        <button
          className={activeSection === "quiz" ? "active" : ""}
          onClick={() => setActiveSection("quiz")}
        >
          Quiz
        </button>
        <button
          className={activeSection === "notes" ? "active" : ""}
          onClick={() => setActiveSection("notes")}
        >
          Notes
        </button>
      </div>

      <div className="content">
        {activeSection === "announcements" && <Announcements course={course} userId={studentId}/>}
        {activeSection === "chat" && <Chat course={course} userId={studentId}/>}
        {activeSection === "quiz" && <Quiz course={course} userId={studentId}/>}
        {activeSection === "notes" && <Notes course={course} userId={studentId}/>}
      </div>
    </div>
  );
}

export default StudentCoursePage;