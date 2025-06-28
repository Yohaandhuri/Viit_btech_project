/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_USERS_SPECIFIC, GET_USER } from "../Graphql/Queries";
import { REGISTER_USER } from "../Graphql/Mutations";
import FacultyModal from "./FacultyModal";
import AdminNavbar from "./AdminNavbar";
import { useParams } from "react-router-dom";
import "./AdminFaculty.css";

function AdminFaculty() {
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [action, setAction] = useState("add");
  const [facultyData, setFacultyData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [registerUser] = useMutation(REGISTER_USER);

  const { data: userData } = useQuery(GET_USER, {
    variables: { id: id },
  });

  const { loading, error, data } = useQuery(GET_USERS_SPECIFIC, {
    variables: { role: "TEACHER" },
  });

  const openAddModal = () => {
    setAction("add");
    setShowModal(true);
  };

  const openDisplayModal = (faculty) => {
    setAction("display");
    setFacultyData(faculty);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setAction("add");
    setFacultyData(null);
  };

  const handleAddFaculty = async (newFaculty) => {
    try {
      await registerUser({
        variables: {
          userInput: {
            ...newFaculty,
            creatorId: parseInt(id),
          },
        },
        refetchQueries: [
          { query: GET_USERS_SPECIFIC, variables: { role: "TEACHER" } },
        ],
      });

      alert("Faculty registered successfully!");
      handleCloseModal();
    } catch (err) {
      console.error("Registration error:", err.message);
      alert("Failed to register faculty");
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);
  };

  const filteredFaculty = data?.getUsersSpecific.filter((faculty) =>
    `${faculty.firstName} ${faculty.lastName} ${faculty.email}`
      .toLowerCase()
      .includes(searchQuery)
  );

  const sortedFaculty = filteredFaculty?.sort((a, b) => {
    if (!sortField) return 0;
    const fieldA = a[sortField]?.toLowerCase?.() || "";
    const fieldB = b[sortField]?.toLowerCase?.() || "";
    if (fieldA < fieldB) return sortDirection === "asc" ? -1 : 1;
    if (fieldA > fieldB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  if (loading) return <p>Loading faculty...</p>;
  if (error) return <p>Error loading faculty: {error.message}</p>;

  return (
    <>
      {userData && (
        <AdminNavbar
          firstName={userData.getUser.firstName}
          lastName={userData.getUser.lastName}
          userId={id}
        />
      )}
      <div className="admin-faculty-container">
        <div className="header-controls">
          <button className="add-faculty-btn" onClick={openAddModal}>
            Add Faculty
          </button>
          <input
            type="text"
            placeholder="Search faculty..."
            className="faculty-search"
            onChange={handleSearch}
          />
        </div>
        <table className="faculty-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("firstName")}>First Name</th>
              <th onClick={() => handleSort("lastName")}>Last Name</th>
              <th onClick={() => handleSort("email")}>Email</th>
            </tr>
          </thead>
          <tbody>
            {sortedFaculty?.map((faculty) => (
              <tr key={faculty.id} onClick={() => openDisplayModal(faculty)}>
                <td>{faculty.firstName}</td>
                <td>{faculty.lastName}</td>
                <td>{faculty.email}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <FacultyModal
          showModal={showModal}
          handleClose={handleCloseModal}
          action={action}
          facultyData={facultyData}
          handleSubmit={handleAddFaculty}
        />
      </div>
    </>
  );
}

export default AdminFaculty;