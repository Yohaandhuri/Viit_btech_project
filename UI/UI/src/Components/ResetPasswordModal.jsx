import { useState } from "react";
import { useMutation } from "@apollo/client";
import { RESET_PASSWORD } from "./Graphql/Mutations";
import "./Modal.css";

const ResetPasswordModal = ({ userId, onClose, role }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [resetPassword] = useMutation(RESET_PASSWORD, {
    onCompleted: () => {
      alert("Password reset successful!");
      onClose();
    },
    onError: (err) => alert("Reset failed: " + err.message),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    resetPassword({
      variables: {
        resetPasswordInputDto: {
          oldPassword,
          newPassword,
          userId: parseInt(userId),
          role: role,
          editedBy: parseInt(userId),
        },
      },
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-field">
            <label htmlFor="oldPassword">Old Password</label>
            <input
              type="password"
              id="oldPassword"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-field">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">Reset</button>
          <button type="button" onClick={onClose} className="cancel-btn">
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
