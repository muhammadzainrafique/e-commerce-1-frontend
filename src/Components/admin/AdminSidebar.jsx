import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaUsers, FaBox, FaPlus, FaShoppingCart, FaUser, FaSignOutAlt } from "react-icons/fa";
import styles from "./AdminDashboard.module.css";
import { useSendLogoutMutation } from "../../Features/auth/authApiSlice";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const [sendLogout, { isLoading }] = useSendLogoutMutation(); // RTK Query mutation hook

  const handleLogout = async () => {
    try {
      await sendLogout().unwrap(); // Call API and wait for response
      navigate("/"); // Redirect to login after successful logout
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className={styles.sidebar}>
      <h2 className={styles.logo}>Admin Panel</h2>
      <p className={styles.welcome}>Welcome</p>
      <nav>
        <ul className={styles.navList}>
          <li><Link to="/admin/dashboard"><FaTachometerAlt className={styles.icon} /> Dashboard</Link></li>
          <li><Link to="/admin/users"><FaUsers className={styles.icon} /> View Users</Link></li>
          <li><Link to="/admin/products"><FaBox className={styles.icon} /> View Products</Link></li>
          <li><Link to="/admin/add-product"><FaPlus className={styles.icon} /> Add Product</Link></li>
          <li><Link to="/admin/orders"><FaShoppingCart className={styles.icon} /> View Orders</Link></li>
          <li><Link to="/admin/profile"><FaUser className={styles.icon} /> Profile</Link></li>
          <li>
            <button onClick={handleLogout} className={styles.logoutBtn} disabled={isLoading}>
              {isLoading ? "Logging out..." : <><FaSignOutAlt className={styles.icon} /> Logout</>}
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
