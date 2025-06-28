import { useState } from "react";
import { useMutation } from "@apollo/client";
import { EDIT_USER } from "./Graphql/Mutations";
import "./Modal.css";

const EditUserModal = ({ user, onClose, id }) => {
  const {
    firstName,
    lastName,
    email,
    dob,
    phoneNumber,
    gender,
    updatedBy,
  } = user;

  const [formData, setFormData] = useState({
    id,
    firstName,
    lastName,
    email,
    dob,
    phoneNumber,
    gender,
    updatedBy,
  });

  const [editUser] = useMutation(EDIT_USER, {
    onCompleted: () => {
      alert("User updated successfully!");
      onClose();
    },
    onError: (err) => alert("Update failed: " + err.message),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    editUser({
      variables: {
        editUserInput: {
          id: id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          dob: formData.dob,
          phoneNumber: formData.phoneNumber,
          gender: formData.gender,
          updatedBy: parseInt(id),
        },
      },
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit User</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <div className="input-field">
              <label htmlFor="firstName">First Name</label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
              />
            </div>
            <div className="input-field">
              <label htmlFor="lastName">Last Name</label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
              />
            </div>
          </div>

          <div className="input-group">
            <div className="input-field">
              <label htmlFor="email">Email</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
              />
            </div>
            <div className="input-field">
              <label htmlFor="phoneNumber">Phone</label>
              <input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Phone"
              />
            </div>
          </div>

          <div className="input-group">
            <div className="input-field">
              <label htmlFor="dob">Date of Birth</label>
              <input
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                placeholder="Date of Birth"
              />
            </div>
            <div className="input-field">
              <label htmlFor="gender">Gender</label>
              <input
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                placeholder="Gender"
              />
            </div>
          </div>

          <button type="submit">Save Changes</button>
          <button type="button" onClick={onClose} className="cancel-btn">
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
