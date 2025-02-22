import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "./PreviousOrders.module.css";
import useAuth from "../../hooks/useAuth";
import { useGetUserOrdersQuery } from "../../Features/orders/orderApiSlice";
import { selectProductById, selectAllProduct } from "../../Features/products/productApiSlice";

const PreviousOrders = () => {
  const { user_id } = useAuth();
  const { data, isLoading, isError,isSuccess } = useGetUserOrdersQuery(user_id);
  const orders = data?.entities ? Object.values(data.entities) : [];;
  

  useEffect(()=>{

  },[isSuccess]);
  

  // Get all products from Redux store
  const products = useSelector(selectAllProduct);
  console.log({products});
  

  if (isLoading) return <div className={styles.loading}>Loading orders...</div>;
  if (isError) return <div className={styles.error}>Failed to load orders.</div>;

  return (
    <div className={styles.ordersContainer}>
      <h2 className={styles.heading}>Previous Orders</h2>
      {orders?.length > 0 ? (
        orders.map((order) => (
          <div key={order.order_id} className={styles.orderCard}>
            <div className={styles.orderHeader}>
              <p><strong>Order ID:</strong> {order.order_id}</p>
              <p><strong>Status:</strong> {order.order_status || "N/A"}</p>
            </div>
            <p><strong>Tracking ID:</strong> {order.tracking_id || "Not available"}</p>
            <p><strong>Total Price:</strong> ${order.total_price}</p>
            <p><strong>Order Date:</strong> {new Date(order.order_date).toLocaleString()}</p>

            <div className={styles.productsList}>
              <h3>Products:</h3>
              {order.products.map((productItem) => {
                const product = products.find((p) => p.id === productItem.product_id); // Use the selector function
                console.log({product})
                return (
                  <div key={productItem.order_item_id} className={styles.productItem}>
                    <p><strong>Name:</strong> {product ? product.name : "Unknown Product"}</p>
                    <p><strong>Quantity:</strong> {productItem.quantity}</p>
                    <p><strong>Price:</strong> ${productItem.price}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      ) : (
        <p className={styles.noOrders}>No previous orders found.</p>
      )}
    </div>
  );
};

export default PreviousOrders;
