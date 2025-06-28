/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { EDIT_USER, RESET_PASSWORD } from "../Graphql/Mutations";
import "./FacultyModal.css";

function FacultyModal({
  showModal,
  handleClose,
  action,
  facultyData,
  handleSubmit,
}) {
  const { id } = useParams();
  const [mode, setMode] = useState(action);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [role, setRole] = useState("TEACHER");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [editUser] = useMutation(EDIT_USER);
  const [resetPassword] = useMutation(RESET_PASSWORD);

  useEffect(() => {
    setMode(action);
    if ((action === "display" || action === "edit") && facultyData) {
      setFirstName(facultyData.firstName);
      setLastName(facultyData.lastName);
      setEmail(facultyData.email);
      setDob(facultyData.dob);
      setPhoneNumber(facultyData.phoneNumber);
      setStatus(facultyData.status);
      setGender(facultyData.gender);
      setRole(facultyData.role);
    } else if (action === "add") {
      setFirstName("");
      setLastName("");
      setEmail("");
      setDob("");
      setPhoneNumber("");
      setStatus("ACTIVE");
      setGender("");
      setRole("TEACHER");
      setPassword("");
    }
  }, [action, facultyData]);

  if (!showModal) return null;

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const faculty = {
      firstName,
      lastName,
      email,
      dob,
      phoneNumber,
      status,
      gender,
      role,
      password,
    };
    handleSubmit(faculty);
  };

  const handleEditInfo = async () => {
    try {
      await editUser({
        variables: {
          editUserInput: {
            id: facultyData.id,
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
      alert("Faculty info updated successfully");
      setMode("display");
    } catch (err) {
      console.error(err);
      alert("Failed to update faculty info");
    }
  };

  const handleResetPassword = async () => {
    try {
      await resetPassword({
        variables: {
          resetPasswordInputDto: {
            userId: parseInt(facultyData.id),
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
      console.error(err);
      alert("Failed to reset password");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={handleClose}>
          X
        </button>

        {mode === "add" && (
          <>
            <h2>Add New Faculty</h2>
            <form onSubmit={handleFormSubmit}>
              <label>First Name:</label>
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />

              <label>Last Name:</label>
              <input value={lastName} onChange={(e) => setLastName(e.target.value)} required />

              <label>Email:</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />

              <label>Date of Birth:</label>
              <input value={dob} onChange={(e) => setDob(e.target.value)} type="date" required />

              <label>Phone Number:</label>
              <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
              
              <label>Gender:</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>

              <label>Password:</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />

              <button type="submit">Add Faculty</button>
            </form>
          </>
        )}

        {mode === "display" && facultyData && (
          <>
            <h2>Faculty Details</h2>
            <div className="faculty-details">
              <p><strong>First Name:</strong> {firstName}</p>
              <p><strong>Last Name:</strong> {lastName}</p>
              <p><strong>Email:</strong> {email}</p>
              <p><strong>Date of Birth:</strong> {dob ?? "NA"}</p>
              <p><strong>Phone Number:</strong> {phoneNumber ?? "NA"}</p>
              <p><strong>Gender:</strong> {gender}</p>
              <p><strong>Role:</strong> {facultyData.role}</p>
            </div>
            <div className="action-buttons">
              <button onClick={() => setMode("edit")}>Edit Info</button>
              <button onClick={() => setMode("reset")}>Reset Password</button>
            </div>
          </>
        )}

        {mode === "edit" && (
          <>
            <h2>Edit Faculty Info</h2>
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
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />

              <label>Date of Birth:</label>
              <input value={dob} onChange={(e) => setDob(e.target.value)} type="date" required />

              <label>Phone Number:</label>
              <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />

              <label>Gender:</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>

              <button type="submit">Update Info</button>
            </form>
          </>
        )}

        {mode === "reset" && (
          <>
            <h2>Reset Faculty Password</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleResetPassword();
              }}
            >
              <label>New Password:</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button type="submit">Reset Password</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default FacultyModal;
