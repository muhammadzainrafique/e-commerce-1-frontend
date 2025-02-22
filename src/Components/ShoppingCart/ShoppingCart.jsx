import React, { useState } from "react";
import styles from "./Cart.module.css"; // Import the CSS module
import useAuth from "../../hooks/useAuth";
import {
  useGetCartItemsQuery,
  useDeleteCartItemMutation,
  useUpdateCartItemMutation,
} from "../../Features/Cart/cartApiSlice";
import {
  useCreateOrderMutation
} from "../../Features/orders/orderApiSlice";


import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const { user_id: userId } = useAuth();
  const navigate = useNavigate();
  const { data: cartItems, isLoading, isError } = useGetCartItemsQuery(userId);
  const [deleteCartItem] = useDeleteCartItemMutation();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [createOrder] = useCreateOrderMutation();
  const [orderMessage, setOrderMessage] = useState("");

  if (isLoading) return <div className={styles.loading}>Loading cart...</div>;
  if (isError) return <div className={styles.error}>Failed to load cart items.</div>;

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity < 1) return;
    updateCartItem({
      cart_id: item.id,
      initialCartItemData: { quantity: newQuantity },
    });
  };

  const handleOrderNow = async () => {
    if (!cartItems?.ids.length) return;

    const orderData = {
      user_id: userId,
      items: cartItems.ids.map((id) => ({
        product_id: cartItems.entities[id].product_id,
        quantity: cartItems.entities[id].quantity,
        price: cartItems.entities[id].price,
      })),
      total_price: totalPrice,
    };

    try {
      await createOrder(orderData);
      setOrderMessage("✅ Your order is created!");
      
      // Remove items from the cart
      cartItems.ids.forEach(async (id) => {
        await deleteCartItem({ id });
      });
    } catch (error) {
      setOrderMessage("❌ Order failed! Please try again.");
    }
  };

  const totalQuantity = cartItems?.ids.reduce((total, id) => total + cartItems.entities[id].quantity, 0) || 0;
  const totalPrice = cartItems?.ids.reduce((total, id) => total + cartItems.entities[id].price * cartItems.entities[id].quantity, 0) || 0;

  return (
    <div className={styles.cartContainer}>
      <h2 className={styles.cartTitle}>Your Shopping Cart</h2>
      <h2 className={styles.cartTitle}>
        <Link to={'/prev-orders'}>Previous Orders</Link>
      </h2>

      {orderMessage && <p className={styles.orderMessage}>{orderMessage}</p>}

      {cartItems?.ids.length === 0 ? (
        <p className={styles.emptyCart}>Your cart is empty.</p>
      ) : (
        <div>
          <div className={styles.cartList}>
            {cartItems?.ids?.map((id) => {
              const item = cartItems.entities[id];
              return (
                <div key={id} className={styles.cartItem}>
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className={styles.cartImage}
                    onClick={() => navigate(`/product/${item.product_id}`)}
                  />
                  <div className={styles.cartDetails}>
                    <h3 className={styles.cartItemName}>{item.name}</h3>
                    <p className={styles.cartPrice}>${item.price}</p>
                  </div>
                  <div className={styles.quantityControls}>
                    <button onClick={() => handleQuantityChange(item, item.quantity - 1)} className={styles.quantityButton}>-</button>
                    <span className={styles.quantity}>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item, item.quantity + 1)} className={styles.quantityButton}>+</button>
                  </div>
                  <button className={styles.deleteButton} onClick={() => deleteCartItem({ id: item.id })}>
                    Remove
                  </button>
                </div>
              );
            })}
          </div>

          <div className={styles.cartSummary}>
            <p>Total Items: <span>{totalQuantity}</span></p>
            <p>Total Price: <span>${totalPrice.toFixed(2)}</span></p>
          </div>

          <button className={styles.orderButton} onClick={handleOrderNow}>
            Order Now
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
