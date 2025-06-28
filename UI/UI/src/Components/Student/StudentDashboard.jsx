import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_USER_COURSES, GET_USER, GET_ALL_COURSES_BY_SEM } from "../Graphql/Queries";
import { ENROLL_STUDENTS_TO_COURSE } from "../Graphql/Mutations";
import StudentNavbar from "./StudentNavbar";
import CourseCard from "../Course/CourseCard";
import StudentCourseModal from "../Course/StudentCourseModal";
import { useParams } from "react-router-dom";
import EditUserModal from "../EditUserModal";
import ResetPasswordModal from "../ResetPasswordModal";
import QueryBox from "../QueryBox";
import "./StudentDashboard.css";

function StudentDashboard() {
  const { userId } = useParams();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isMyCourse, setIsMyCourse] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [isQueryOpen, setIsQueryOpen] = useState(false);


  const { data: userData, loading: userLoading } = useQuery(GET_USER, {
    variables: { id: userId },
  });

  const { data: allCoursesData, refetch: refetchAllCourses } = useQuery(GET_ALL_COURSES_BY_SEM, {
    skip: userLoading || !userData?.getUser?.sem,
    variables: { sem: userData?.getUser?.sem },
  });

  const { data: userCoursesData, refetch: refetchUserCourses } = useQuery(GET_USER_COURSES, {
    variables: { userId },
  });

  const [enrollStudent] = useMutation(ENROLL_STUDENTS_TO_COURSE, {
    onCompleted: () => {
      refetchAllCourses();
      refetchUserCourses();
      setSelectedCourse(null);
    },
  });

  const handleCourseClick = (course, fromMyCourses = false) => {
    setSelectedCourse(course);
    setIsMyCourse(fromMyCourses);
  };

  const handleEnroll = async (courseId) => {
    await enrollStudent({
      variables: {
        courseId,
        studentIds: userId,
      },
    });
  };

  const availableCourses = allCoursesData?.getAllCoursesBySem.filter(
    (course) =>
      !userCoursesData?.getUserCourses.some((userCourse) => userCourse.id === course.id)
  );

  const student = userData?.getUser;
  console.log("TESTEST", student);

  return (
    <div className="student-dashboard">
      {student && <StudentNavbar firstName={student.firstName} lastName={student.lastName} id={userId} />}
      {/* Student Info Section */}
      {student && (
        <div className="student-info">
          <h2>Student Information</h2>
          <div className="student-info-grid">
            <p><strong>Name:</strong> {student.firstName} {student.lastName}</p>
            <p><strong>Email:</strong> {student.email}</p>
            <p><strong>Semester:</strong> {student.sem}</p>
            <p><strong>Role Number:</strong> {student.roleId}</p>
            <p><strong>DOB:</strong> {student.dob}</p>
            <p><strong>Phone:</strong> {student.phoneNumber}</p>
            <p><strong>Status:</strong> {student.status}</p>
            <p><strong>Gender:</strong> {student.gender}</p>
          </div>
          {/* Edit User and Reset Password Buttons */}
          <div className="user-actions">
            <button onClick={() => setIsEditUserModalOpen(true)}>Edit User</button>
            <button onClick={() => setIsResetPasswordModalOpen(true)}>Reset Password</button>
          </div>
        </div>
      )}

      {/* Courses Section */}
      <div className="course-sections">
        <div className="course-column">
          <h3>All Courses of Sem {student?.sem}</h3>
          <div className="course-cards">
            {availableCourses?.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onClick={() => handleCourseClick(course, false)}
              />
            ))}
          </div>
        </div>

        <div className="course-column">
          <h3>My Courses</h3>
          <div className="course-cards">
            {userCoursesData?.getUserCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onClick={() => handleCourseClick(course, true)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modal for editing user */}
      {isEditUserModalOpen && (
        <EditUserModal
          user={student}
          onClose={() => setIsEditUserModalOpen(false)}
          id={userId}
        />
      )}

      {/* Modal for resetting password */}
      {isResetPasswordModalOpen && (
        <ResetPasswordModal
          userId={userId}
          onClose={() => setIsResetPasswordModalOpen(false)}
          role={student.role}
        />
      )}

      {/* Modal */}
      {selectedCourse && (
        <StudentCourseModal
          course={selectedCourse}
          isMyCourse={isMyCourse}
          onClose={() => setSelectedCourse(null)}
          onEnroll={handleEnroll}
        />
      )}

    <button className="chat-toggle-button" onClick={() => setIsQueryOpen(true)}>
      💬
    </button>

      {isQueryOpen && <QueryBox onClose={() => setIsQueryOpen(false) } userId={userId} />}
    </div>
  );
}

export default StudentDashboard;
