import React from "react";
import { Outlet } from "react-router-dom";
import styles from "./AdminLayout.module.css";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  return (
    <div className={styles.adminContainer}>
      {/* Sidebar remains fixed */}
      <AdminSidebar />
      
      {/* Dynamic Content Changes */}
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};
export default AdminLayout;
