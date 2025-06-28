/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_FACULTY_COURSES, GET_USER } from "../Graphql/Queries";
import { useNavigate, useParams } from "react-router-dom";
import FacultyNavbar from "./FacultyNavbar";
import EditUserModal from "../EditUserModal"; // Import the Edit User Modal
import ResetPasswordModal from "../ResetPasswordModal"; // Import the Reset Password Modal
import "./FacultyDashboard.css";
import QueryBox from "../QueryBox";

function FacultyDashboard() {
  const { userId } = useParams();
  const [activeSection, setActiveSection] = useState("announcements");
  const [showEditModal, setShowEditModal] = useState(false); // State for Edit User Modal
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false); // State for Reset Password Modal
  const [isQueryOpen, setIsQueryOpen] = useState(false);
  const navigate = useNavigate();

  const { data: userData } = useQuery(GET_USER, {
    variables: { id: userId },
  });

  const { data, loading, error } = useQuery(GET_FACULTY_COURSES, {
    variables: { facultyId: userId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleCourseClick = (course) => {
    navigate(`/faculty/${userId}/course/${course.id}`, { state: { course } });
  };

  const faculty = userData?.getUser;

  return (
    <div className="faculty-dashboard">
      {faculty?.role === "TEACHER" && (
        <FacultyNavbar
          firstName={faculty.firstName}
          lastName={faculty.lastName}
          id={userId}
        />
      )}

      {/* Faculty Info Section */}
      <div className="faculty-info">
        <h2>Faculty Information</h2>
        <div className="faculty-info-grid">
          <p><strong>Name:</strong> {faculty.firstName} {faculty.lastName}</p>
          <p><strong>Email:</strong> {faculty.email}</p>
          <p><strong>Role Number:</strong> {faculty.roleId}</p>
          <p><strong>Date of Birth:</strong> {faculty.dob}</p>
          <p><strong>Phone:</strong> {faculty.phoneNumber}</p>
          <p><strong>Status:</strong> {faculty.status}</p>
          <p><strong>Gender:</strong> {faculty.gender}</p>
        </div>

        {/* Button to trigger Edit Modal */}
        <button onClick={() => setShowEditModal(true)}>Edit Faculty Info</button>
        {/* Button to trigger Reset Password Modal */}
        <button onClick={() => setShowResetPasswordModal(true)}>Reset Password</button>
      </div>

      {/* Courses Section */}
      <div className="my-courses">
        <h3>My Courses</h3>
        <div className="course-list">
          {data?.getFacultyCourses?.map((course) => (
            <div
              key={course.id}
              onClick={() => handleCourseClick(course)}
              className="course-card"
            >
              <h4>{course.title}</h4>
              <p><strong>Semester:</strong> {course.sem}</p>
              <p><strong>Credits:</strong> {course.credits}</p>
              <p><strong>Duration:</strong> {course.duration}</p>
              <p><strong>Year:</strong> {course.year}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Edit User Modal */}
      {showEditModal && (
        <EditUserModal
          user={faculty}
          onClose={() => setShowEditModal(false)}
          id={userId}
        />
      )}

      {/* Reset Password Modal */}
      {showResetPasswordModal && (
        <ResetPasswordModal
          userId={userId}
          onClose={() => setShowResetPasswordModal(false)}
          role="TEACHER" // Assuming "TEACHER" role for faculty
        />
      )}

      <button className="chat-toggle-button" onClick={() => setIsQueryOpen(true)}>
        💬
      </button>
      {isQueryOpen && <QueryBox onClose={() => setIsQueryOpen(false)} userId={userId}/>}
    </div>
  );
}

export default FacultyDashboard;
