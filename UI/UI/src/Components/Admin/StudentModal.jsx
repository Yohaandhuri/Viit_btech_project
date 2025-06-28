/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { useMutation, gql } from "@apollo/client";
import { useParams } from "react-router-dom";
import "./StudentModal.css";
import { EDIT_USER,RESET_PASSWORD } from "../Graphql/Mutations";

function StudentModal({
  showModal,
  handleClose,
  action,
  studentData,
  handleSubmit,
}) {
  const { id } = useParams();
  console.log("USERID",id);
  
  const [mode, setMode] = useState(action);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [role, setRole] = useState("STUDENT");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [sem, setSem] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [editUser] = useMutation(EDIT_USER);
  const [resetPassword] = useMutation(RESET_PASSWORD);

  useEffect(() => {
    setMode(action); // Sync mode with the current action
  
    if ((action === "display" || action === "edit") && studentData) {
      setFirstName(studentData.firstName);
      setLastName(studentData.lastName);
      setEmail(studentData.email);
      setDob(studentData.dob);
      setPhoneNumber(studentData.phoneNumber);
      setStatus(studentData.status);
      setGender(studentData.gender);
      setRole(studentData.role);
      setSem(studentData.sem);
    } else if (action === "add") {
      setFirstName("");
      setLastName("");
      setEmail("");
      setDob("");
      setPhoneNumber("");
      setStatus("ACTIVE");
      setGender("");
      setRole("STUDENT");
      setPassword("");
      setSem("");
      setNewPassword("");
    }
  }, [action, studentData]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const student = {
      firstName,
      lastName,
      email,
      dob,
      phoneNumber,
      status,
      gender,
      role,
      password,
      sem,
    };
    handleSubmit(student);
  };

  const handleEditInfo = async () => {
    try {
      await editUser({
        variables: {
          editUserInput: {
            id: studentData.id,
            firstName,
            lastName,
            email,
            dob,
            phoneNumber,
            gender,
            updatedBy: parseInt(id),
          },
        },
      });
      alert("User info updated successfully");
      setMode("display");
    } catch (err) {
      console.error(err.message);
      alert("Failed to update info");
    }
  };

  const handleResetPassword = async () => {
    try {
      await resetPassword({
        variables: {
          resetPasswordInputDto: {
            userId: parseInt(studentData.id),
            role: "ADMIN",
            editedBy: parseInt(id),
            newPassword,
          },
        },
      });
      alert("Password reset successfully");
      setMode("display");
      setNewPassword("");
    } catch (err) {
      console.error(err.message);
      alert("Failed to reset password");
    }
  };

  if (!showModal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={handleClose}>
          X
        </button>

        {mode === "add" && (
          <>
            <h2>Add New Student</h2>
            <form onSubmit={handleFormSubmit}>
              <label>First Name:</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />

              <label>Last Name:</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />

              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <label>Date of Birth:</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
              />

              <label>Gender:</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>

              <label>Phone Number:</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />

              <label>Student Sem:</label>
              <input
                type="number"
                value={sem}
                onChange={(e) => setSem(e.target.value)}
                placeholder="Semester (1-8)"
                min={1}
                max={8}
                required
              />

              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button type="submit">Add Student</button>
            </form>
          </>
        )}

        {mode === "display" && studentData && (
          <>
            <h2>Student Details</h2>
            <div className="student-details">
              <p><strong>First Name:</strong> {firstName}</p>
              <p><strong>Last Name:</strong> {lastName}</p>
              <p><strong>Email:</strong> {email}</p>
              <p><strong>Date of Birth:</strong> {dob ?? "NA"}</p>
              <p><strong>Phone Number:</strong> {phoneNumber ?? "NA"}</p>
              <p><strong>Gender:</strong> {gender}</p>
              <p><strong>Role Number:</strong> {studentData?.roleId ?? "NA"}</p>
            </div>
            <div className="action-buttons">
              <button onClick={() => setMode("edit")}>Edit Info</button>
              <button onClick={() => setMode("reset")}>Reset Password</button>
            </div>
          </>
        )}

        {mode === "edit" && (
          <>
            <h2>Edit Student Info</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditInfo();
              }}
            >
              <label>First Name:</label>
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              <label>Last Name:</label>
              <input value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              <label>Email:</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} required />
              <label>Date of Birth:</label>
              <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
              <label>Phone Number:</label>
              <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              <label>Gender:</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
              <button type="submit">Save Changes</button>
            </form>
          </>
        )}

        {mode === "reset" && (
          <>
            <h2>Reset Password</h2>
            <label>New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button onClick={handleResetPassword}>Reset Password</button>
          </>
        )}
      </div>
    </div>
  );
}

export default StudentModal;
