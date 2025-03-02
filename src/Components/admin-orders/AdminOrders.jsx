import React, { useState } from "react";
import "./AdminOrders.css";
import { useGetOrdersQuery } from "../../Features/orders/orderApiSlice";
import { Link } from "react-router-dom";

const AdminOrders = () => {
  const { data: orders, isLoading, isError, error } = useGetOrdersQuery();
  const [filterStatus, setFilterStatus] = useState("pending");

  if (isLoading) return <p className="loading">Loading orders...</p>;
  if (isError) return <p className="error">Error: {error?.message}</p>;

  const filteredOrders = orders?.ids
    ?.map((id) => orders.entities[id])
    .filter((order) => order.order_status === filterStatus);

  return (
    <div className="admin-orders-container">
      <h2 className="admin-orders-title">Admin Orders</h2>

      <div className="filter-container">
        <label htmlFor="order-status">Filter by Status:</label>
        <select
          id="order-status"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <table className="admin-orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer Name</th>
            <th>Status</th>
            <th>Order Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders?.length > 0 ? (
            filteredOrders.map((order) => (
              <tr key={order.id}>
                <td><Link to={`/admin/orders-detail/${order.order_id}`}>{order.order_id}</Link></td>
                <td>{order.full_name}</td>
                <td className={`status ${order?.order_status?.toLowerCase()}`}>
                  {order.order_status}
                </td>
                <td>{new Date(order.order_date)?.toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="no-orders">No orders found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;
