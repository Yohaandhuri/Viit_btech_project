import { useQuery } from "@apollo/client";
import { GET_USER } from "../Graphql/Queries";
import { useParams } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import EditUserModal from "../EditUserModal";
import ResetPasswordModal from "../ResetPasswordModal";
import { useState } from "react";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { userId } = useParams();
  const { data: userData, loading, error } = useQuery(GET_USER, {
    variables: { id: userId },
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading admin data</p>;

  const user = userData.getUser;

  return (
    <div>
      {user && (
        <AdminNavbar
          firstName={user.firstName}
          lastName={user.lastName}
          userId={userId}
        />
      )}
      <div className="dashboard-body">
        <h2>Welcome to Admin Dashboard</h2>

        <div className="admin-info-grid">
          <div><strong>First Name:</strong> {user.firstName}</div>
          <div><strong>Last Name:</strong> {user.lastName}</div>
          <div><strong>Email:</strong> {user.email}</div>
          <div><strong>Phone:</strong> {user.phoneNumber}</div>
          <div><strong>Date of Birth:</strong> {user.dob}</div>
          <div><strong>Role:</strong> {user.role}</div>
        </div>

        <div className="admin-actions">
          <button onClick={() => setShowEditModal(true)}>Edit User</button>
          <button onClick={() => setShowResetModal(true)}>Reset Password</button>
        </div>
      </div>

      {showEditModal && (
        <EditUserModal
          user={user}
          onClose={() => setShowEditModal(false)}
          id={userId}
        />
      )}

      {showResetModal && (
        <ResetPasswordModal
          userId={userId}
          onClose={() => setShowResetModal(false)}
          role="ADMIN"
        />
      )}
    </div>
  );
};

export default AdminDashboard;
