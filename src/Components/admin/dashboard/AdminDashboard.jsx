import React from "react";
import styles from  "../AdminDashboard.module.css";
import AdminOrders from "../../admin-orders/AdminOrders";

const AdminDashboard = () => {
  

  return (
    <div className={styles.adminContainer}>
      {/* <AdminSidebar /> */}
      <AdminOrders/>
    </div>
  );
};

export default AdminDashboard;
