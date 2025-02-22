import React, { useState } from "react";
import styles from "./AdminUsers.module.css";
import { FaTrash, FaFilter } from "react-icons/fa";
import toast from "react-hot-toast";
import { useGetUsersQuery, useDeleteUserMutation } from "../../../Features/users/userApiSlice";

const AdminUsers = () => {
  const { data: users, isLoading, isError } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  // Default checked columns
  const [visibleColumns, setVisibleColumns] = useState({
    user_id:false,
    full_name: true,
    contact: false,
    email: true,
    role: true,
    address: false,
    created_at: false,
    updated_at: false,
  });

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser({ id }).unwrap();
        toast.success("User deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete user!");
      }
    }
  };

  const toggleColumn = (column) => {
    setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }));
  };

  const filteredUsers = users?.ids?.map((id) => users.entities[id]).filter((user) =>
    user?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user?.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <p className={styles.loading}>Loading users...</p>;
  if (isError) return <p className={styles.error}>Failed to load users</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Manage Users</h2>

      {/* Search Bar */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          className={styles.searchBox}
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className={styles.filterBtn} onClick={() => setShowFilter(!showFilter)}>
          <FaFilter />
        </button>
      </div>

      {/* Column Visibility Dropdown */}
      {showFilter && (
        <div className={styles.filterDropdown}>
          {Object.keys(visibleColumns).map((column) => (
            <label key={column} className={styles.filterOption}>
              <input
                type="checkbox"
                checked={visibleColumns[column]}
                onChange={() => toggleColumn(column)}
              />
              {column.replace("_", " ").toUpperCase()}
            </label>
          ))}
        </div>
      )}

      {/* Users Table */}
      <table className={styles.table}>
        <thead>
          <tr>
            {visibleColumns.user_id && <th>ID</th>}
            {visibleColumns.full_name && <th>Full Name</th>}
            {visibleColumns.contact && <th>Contact</th>}
            {visibleColumns.email && <th>Email</th>}
            {visibleColumns.role && <th>Role</th>}
            {visibleColumns.address && <th>Address</th>}
            {visibleColumns.created_at && <th>Created At</th>}
            {visibleColumns.updated_at && <th>Updated At</th>}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr key={user.id}>
                {visibleColumns.user_id && <td>{user.user_id}</td>}
                {visibleColumns.full_name && <td>{user.full_name}</td>}
                {visibleColumns.contact && <td>{user.contact}</td>}
                {visibleColumns.email && <td>{user.email}</td>}
                {visibleColumns.role && (
                  <td className={user.role === "admin" ? styles.adminRole : styles.customerRole}>
                    {user.role}
                  </td>
                )}
                {visibleColumns.address && <td>{user.address || "N/A"}</td>}
                {visibleColumns.created_at && <td>{new Date(user.created_at).toLocaleString()}</td>}
                {visibleColumns.updated_at && <td>{new Date(user.updated_at).toLocaleString()}</td>}
                <td>
                  <button className={styles.deleteBtn} onClick={() => handleDelete(user.id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className={styles.noResults}>No users found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
