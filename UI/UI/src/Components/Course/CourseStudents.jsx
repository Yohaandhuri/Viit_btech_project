/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_COURSE_STUDENTS } from "../Graphql/Queries";
import "./CourseStudents.css";

function CourseStudents({ courseId }) {
  const { data, loading, error } = useQuery(GET_COURSE_STUDENTS, {
    variables: { courseId },
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);

  if (loading) return <p>Loading students...</p>;
  if (error) return <p>Error loading students: {error.message}</p>;

  const filteredStudents = data.getCourseStudents
    .filter((student) =>
      `${student.firstName} ${student.lastName} ${student.email} ${student.roleId}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortField) return 0;
      const valA = a[sortField];
      const valB = b[sortField];
      return sortAsc
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });

  const handleSort = (field) => {
    setSortField(field);
    setSortAsc(sortField === field ? !sortAsc : true);
  };

  return (
    <div className="students-table-container">
      <input
        type="text"
        placeholder="Search students..."
        className="search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <table className="students-table">
        <thead>
          <tr>
            <th onClick={() => handleSort("firstName")}>First Name</th>
            <th onClick={() => handleSort("lastName")}>Last Name</th>
            <th onClick={() => handleSort("email")}>Email</th>
            <th onClick={() => handleSort("roleId")}>Role ID</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) => (
            <tr key={student.id}>
              <td>{student.firstName}</td>
              <td>{student.lastName}</td>
              <td>{student.email}</td>
              <td>{student.roleId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CourseStudents;
