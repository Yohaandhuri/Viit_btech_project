/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import Select from "react-select";
import { GET_USERS_SPECIFIC, GET_ALL_COURSES ,GET_USER} from "../Graphql/Queries";
import { SAVE_COURSE, ASSIGN_FACULTY_TO_COURSE } from "../Graphql/Mutations";
import "./CourseModal.css";

const CourseModal = ({ show, onClose, mode, course }) => {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [credits, setCredits] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [year, setYear] = useState("");
  const [sem, setSem] = useState("");
  const [selectedFacultyId, setSelectedFacultyId] = useState("");

  const { data: facultyData } = useQuery(GET_USERS_SPECIFIC, {
    variables: { role: "TEACHER" },
  });

  const {
    data: facultyDetails,
    loading: facultyLoading,
    error: facultyError,
  } = useQuery(GET_USER, {
    variables: { id: facultyId },
    skip: !facultyId, // skip the query if facultyId is not set
  });

  const [saveCourse] = useMutation(SAVE_COURSE, {
    onCompleted: () => {
      alert("Course saved successfully!");
      onClose();
    },
    onError: (err) => {
      alert("Error saving course: " + err.message);
    },
    refetchQueries: [{ query: GET_ALL_COURSES }],
  });

  const [assignFacultyToCourse] = useMutation(ASSIGN_FACULTY_TO_COURSE, {
    onCompleted: () => {
      alert("Faculty assigned successfully!");
      setFacultyId(selectedFacultyId);
      onClose();
    },
    onError: (err) => {
      alert("Error assigning faculty: " + err.message);
    },
    refetchQueries: [{ query: GET_ALL_COURSES }],
  });

  useEffect(() => {
    if (mode === "view" && course) {
      setTitle(course.title);
      setDuration(course.duration);
      setCredits(course.credits);
      setFacultyId(course.facultyId || "");
      setYear(course.year || "");
      setSem(course.sem?.toString() || "");
    } else {
      setTitle("");
      setDuration("");
      setCredits("");
      setFacultyId("");
      setYear("");
      setSem("");
    }
    setSelectedFacultyId("");
  }, [mode, course]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const parsedSem = parseInt(sem, 10);
    if (parsedSem < 1 || parsedSem > 8) {
      alert("Semester must be between 1 and 8");
      return;
    }

    if (!/^\d{4}$/.test(year)) {
      alert("Year must be in YYYY format");
      return;
    }

    saveCourse({
      variables: {
        course: {
          title,
          duration,
          credits,
          facultyId: facultyId || null,
          year,
          sem: parsedSem,
        },
      },
    });
  };

  const handleFacultyChange = (selectedOption) => {
    setSelectedFacultyId(selectedOption ? selectedOption.value : "");
  };

  const handleAssignFaculty = () => {
    if (!selectedFacultyId) {
      alert("Please select a faculty before saving.");
      return;
    }
    assignFacultyToCourse({
      variables: {
        courseId: course.id,
        facultyId: selectedFacultyId,
      },
    });
  };

  const facultyOptions = facultyData?.getUsersSpecific?.map(faculty => ({
    label: `${faculty.firstName} ${faculty.lastName} (${faculty.email})`,
    value: faculty.id,
  })) || [];

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>X</button>

        {mode === "view" ? (
          <>
            <h2>Course Details</h2>
            <p><strong>Title:</strong> {title}</p>
            <p><strong>Duration(in weeks):</strong> {duration} weeks</p>
            <p><strong>Credits:</strong> {credits}</p>
            <p><strong>Year:</strong> {year}</p>
            <p><strong>Semester:</strong> {sem}</p>

            {facultyId && facultyDetails ? (
                <>
                  <p><strong>Faculty Name:</strong> {facultyDetails.getUser.firstName} {facultyDetails.getUser.lastName}</p>
                  <p><strong>Faculty Email:</strong> {facultyDetails.getUser.email}</p>
                </>
              ) : (
              <>
                <div>
                  <label htmlFor="faculty">Assign Faculty</label>
                  <Select
                    id="faculty"
                    options={facultyOptions}
                    onChange={handleFacultyChange}
                    placeholder="Search by email"
                    getOptionLabel={(e) => `${e.label}`}
                  />
                </div>
                <button onClick={handleAssignFaculty}>Assign Faculty</button>
              </>
            )}
          </>
        ) : (
          <>
            <h2>Add New Course</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Course Title"
                required
              />
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Duration (in weeks)"
                required
              />
              <input
                type="text"
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
                placeholder="Credits"
                required
              />
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="Year (e.g. 2025)"
                pattern="\d{4}"
                title="Enter year in YYYY format"
                required
              />
              <input
                type="number"
                value={sem}
                onChange={(e) => setSem(e.target.value)}
                placeholder="Semester (1-8)"
                min={1}
                max={8}
                required
              />

              <div>
                <label htmlFor="faculty">Select Faculty</label>
                <Select
                  id="faculty"
                  options={facultyOptions}
                  onChange={(selected) => setFacultyId(selected ? selected.value : "")}
                  placeholder="Search by email"
                  getOptionLabel={(e) => `${e.label}`}
                />
              </div>

              <button type="submit">Save Course</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default CourseModal;
