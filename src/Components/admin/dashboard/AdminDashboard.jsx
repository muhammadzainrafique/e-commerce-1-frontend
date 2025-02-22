import React from "react";
import styles from  "../AdminDashboard.module.css";
import AdminSidebar from "../AdminSidebar";

const AdminDashboard = () => {
  const latestOrders = [
    { id: 1, customer: "John Doe", total: "$250", status: "Shipped" },
    { id: 2, customer: "Jane Smith", total: "$180", status: "Processing" },
    { id: 3, customer: "Sam Wilson", total: "$320", status: "Delivered" },
    { id: 4, customer: "Emma Brown", total: "$150", status: "Pending" },
    { id: 5, customer: "Chris Evans", total: "$400", status: "Shipped" },
  ];

  return (
    <div className={styles.adminContainer}>
      <AdminSidebar />
      <div className={styles.content}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        <h2 className={styles.subtitle}>Latest 5 Orders</h2>
        <table className={styles.orderTable}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {latestOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.total}</td>
                <td className={styles[order.status.toLowerCase()]}>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
