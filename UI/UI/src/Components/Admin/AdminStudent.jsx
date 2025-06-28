/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_USERS_SPECIFIC, GET_USER } from "../Graphql/Queries";
import { REGISTER_USER } from "../Graphql/Mutations";
import StudentModal from "./StudentModal";
import AdminNavbar from "./AdminNavbar";
import { useParams } from "react-router-dom";
import "./AdminStudent.css";

function AdminStudent() {
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [action, setAction] = useState("add");
  const [studentData, setStudentData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("firstName");
  const [sortOrder, setSortOrder] = useState("asc");

  const [registerUser] = useMutation(REGISTER_USER);
  const { loading, error, data, refetch } = useQuery(GET_USERS_SPECIFIC, {
    variables: { role: "STUDENT" },
  });

  const { data: userData } = useQuery(GET_USER, {
    variables: { id: id }, 
  });

  const openAddModal = () => {
    setAction("add");
    setShowModal(true);
  };

  const openDisplayModal = (student) => {
    setAction("display");
    setStudentData(student);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setAction("add");
    setStudentData(null);
  };

  const handleAddStudent = async (newStudent) => {
    try {
      await registerUser({
        variables: {
          userInput: {
            firstName: newStudent.firstName,
            lastName: newStudent.lastName,
            email: newStudent.email,
            dob: newStudent.dob,
            phoneNumber: newStudent.phoneNumber,
            gender: newStudent.gender,
            role: newStudent.role,
            status: newStudent.status,
            password: newStudent.password,
            creatorId: parseInt(id),
            sem: parseInt(newStudent.sem),
          },
        },
      });
      alert("Student registered successfully!");
      refetch();
      handleCloseModal();
    } catch (err) {
      console.error("Registration error:", err.message);
      alert("Failed to register student");
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredAndSortedStudents = data?.getUsersSpecific
    .filter((student) => {
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      return fullName.includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      const valA = a[sortField]?.toString().toLowerCase() || "";
      const valB = b[sortField]?.toString().toLowerCase() || "";
      return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });

  if (loading) return <p>Loading students...</p>;
  if (error) return <p>Error loading students: {error.message}</p>;

  return (
    <>
      {userData && <AdminNavbar firstName={userData.getUser.firstName} lastName={userData.getUser.lastName} userId={id} />}
      <div className="admin-student-container">
        <div className="toolbar">
          <button className="add-student-btn" onClick={openAddModal}>
            Add Student
          </button>

          <input
            type="text"
            className="search-bar"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <table className="student-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("firstName")}>First Name</th>
              <th onClick={() => handleSort("lastName")}>Last Name</th>
              <th onClick={() => handleSort("email")}>Email</th>
              <th onClick={() => handleSort("sem")}>Semester</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedStudents.map((student) => (
              <tr key={student.id} onClick={() => openDisplayModal(student)}>
                <td>{student.firstName}</td>
                <td>{student.lastName}</td>
                <td>{student.email}</td>
                <td>{student.sem}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <StudentModal
          showModal={showModal}
          handleClose={handleCloseModal}
          action={action}
          studentData={studentData}
          handleSubmit={handleAddStudent}
        />
      </div>
    </>
  );
}

export default AdminStudent;
