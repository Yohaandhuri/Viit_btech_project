/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import "./CoursePage.css";
import { GET_ALL_COURSES, GET_USER } from "../Graphql/Queries";
import CourseModal from "./CourseModal";
import { useParams } from "react-router-dom";
import AdminNavbar from "../Admin/AdminNavbar";

const CoursePage = () => {
  const { id } = useParams();
  console.log("IDtest",id);
  
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [mode, setMode] = useState("view");

  const {
    data: coursesData,
    loading: coursesLoading,
    error: coursesError,
  } = useQuery(GET_ALL_COURSES);

  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useQuery(GET_USER, {
    variables: { id },
  });

  // ✅ Early return only after all hooks are defined
  if (coursesLoading || userLoading) return <p>Loading...</p>;
  if (coursesError || userError) return <p>Error loading data</p>;

  const handleCardClick = (course) => {
    setSelectedCourse(course);
    setMode("view");
    setShowModal(true);
  };

  const handleAddClick = () => {
    setSelectedCourse(null);
    setMode("add");
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedCourse(null);
  };

  return (
    <>
    {userData && <AdminNavbar firstName={userData.getUser.firstName} lastName={userData.getUser.lastName} userId={id} />}
      <div className="course-page">
        <h2>Course Management</h2>
        <button className="add-course-btn" onClick={handleAddClick}>Add Course</button>

        <div className="course-card-container">
          {coursesData.getAllCourses.map((course) => (
            <div key={course.id} className="course-card" onClick={() => handleCardClick(course)}>
              <h3>{course.title}</h3>
              <p>{course.duration} weeks</p>
            </div>
          ))}
        </div>

        <CourseModal show={showModal} onClose={handleClose} mode={mode} course={selectedCourse} />
      </div>
    </>
  );
};

export default CoursePage;
