import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./AdminOrderDetail.css";
import { useGetOrderByIdQuery, useUpdateOrderStatusMutation } from "../../Features/orders/orderApiSlice";
import { selectAllProduct } from "../../Features/products/productApiSlice";
import { useSelector } from "react-redux";

const AdminOrderDetail = () => {
  const { id } = useParams();
  let order = null;
  let products = null;
  let user = null;
  const AllProducts = useSelector(selectAllProduct);
  const { data, isLoading, isError, error, isSuccess } = useGetOrderByIdQuery(id);
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [newStatus, setNewStatus] = useState("");

  if (isLoading) return <p className="loading">Loading order details...</p>;
  if (isError) return <p className="error">Error: {error?.message}</p>;
  if(isSuccess){
    order = data.entities?.undefined?.order
    products = data.entities?.undefined?.products
    user = data.entities?.undefined?.user
   console.log(user, order, products)
  }

  const handleStatusUpdate = async () => {
    if (!newStatus)  return;
    try {
      await updateOrderStatus({ id, order_status: newStatus }).unwrap();
      alert("Order status updated successfully!");
    } catch (err) {
      alert("Failed to update order status.");
    }
  };

  return (
    <div className="order-detail-container">
      <h2 className="order-detail-title">Order Details</h2>

      <div className="order-info">
        <p><strong>Order ID:</strong> {order?.order_id}</p>
        <p><strong>Customer Name:</strong> {user?.full_name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Phone:</strong> {user?.contact}</p>
        <p><strong>Address:</strong> {user?.address}</p>
        <p><strong>Order Date:</strong> {new Date(order?.order_date).toLocaleDateString()}</p>
        <p><strong>Total Price:</strong> ${order.total_price}</p>
        <p className={`status ${order?.order?.order_status?.toLowerCase()}`}>
          <strong>Status:</strong> {order?.order_status}
        </p>
      </div>

      <h3 className="order-items-title">Order Items</h3>
      <table className="order-items-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {products?.map((item) => {
            const product = AllProducts.find((p) => p.id === item.product_id);
            return (
              <tr key={item.order_item_id}>
                <td>{product?.name || "Unknown Product"}</td>
                <td>{item.quantity}</td>
                <td>${item.price*item.quantity}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="status-update">
        <label htmlFor="status-select">Update Status:</label>
        <select id="status-select" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
          <option value="">Select Status</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <button onClick={handleStatusUpdate}>Update</button>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
