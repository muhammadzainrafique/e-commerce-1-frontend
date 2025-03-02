import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Import Pages
import Home from "./Pages/Home";
import About from "./Pages/About";
import Shop from "./Pages/Shop";
import Contact from "./Pages/Contact";
import Blog from "./Pages/Blog";
import ProductDetails from "./Pages/ProductDetails";
import NotFound from "./Pages/NotFound";
import Authentication from "./Pages/Authentication";
import ResetPass from "./Components/Authentication/Reset/ResetPass";
import BlogDetails from "./Components/Blog/BlogDetails/BlogDetails";
import TermsConditions from "./Pages/TermsConditions";

// Customer Pages
import ShoppingCart from "./Components/ShoppingCart/ShoppingCart";
import ProfilePage from "./Components/profile/ProfilePage";

// Admin Pages
import AdminLayout from "./Components/admin/AdminLayout";
import AdminDashboard from "./Components/admin/dashboard/AdminDashboard";
// import AdminUsers from "./Components/admin/users/AdminUsers";
import AdminProducts from "./Components/admin-products/AdminProducts";
import AddProductForm from "./Components/add-product/AddProductForm";
// import AdminOrders from "./Components/admin/orders/AdminOrders";
import AdminUpdateProduct from "./Components/update-product/AdminUpdateProduct";

// Components
import Header from "./Components/Header/Navbar";
import Footer from "./Components/Footer/Footer";
import Popup from "./Components/PopupBanner/Popup";
import ScrollToTop from "./Components/ScrollButton/ScrollToTop";
import { Toaster } from "react-hot-toast";

// Hooks
import useAuth from "./hooks/useAuth";
import AdminUsers from "./Components/admin/users/AdminUsers";
import PreviousOrders from "./Components/prev-orders/PreviousOrders";
import AdminOrders from "./Components/admin-orders/AdminOrders";
import AdminOrderDetail from "./Components/admin-order-detail/AdminOrderDetail";

// Private Route Component
const PrivateRoute = ({ children, allowedRoles, userRole }) => {
  if (!userRole) {
    return <Navigate to="/loginSignUp" replace />;
  }
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  const { role } = useAuth(); // Get user role from authentication hook
  console.log(role);

  return (
    <>
      <Popup />
      <ScrollToTop />
      <BrowserRouter>
        {role !== "admin" && <Header />}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/loginSignUp" element={<Authentication />} />
          <Route path="/resetPassword" element={<ResetPass />} />
          <Route path="/blogDetails" element={<BlogDetails />} />
          <Route path="/terms" element={<TermsConditions />} />
          

          
          <Route
            path="/cart"
            element={
              <PrivateRoute allowedRoles={["customer"]} userRole={role}>
                <ShoppingCart />
              </PrivateRoute>
            }
          />

            <Route
            path="/prev-orders"
            element={
              <PrivateRoute allowedRoles={["customer"]} userRole={role}>
                <PreviousOrders/>
              </PrivateRoute>
            }
          />


          {/* Admin Layout with Sidebar */}
          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRoles={["admin"]} userRole={role}>
                <AdminLayout />
              </PrivateRoute>
            }
            
          >
            
          



            <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/orders-detail/:id" element={<AdminOrderDetail />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="products" element={<AdminProducts />} />
            {/* <Route path="orders" element={<AdminOrders />} /> */}
            <Route path="add-product" element={<AddProductForm />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="update-product/:id" element={<AdminUpdateProduct />} />
          </Route>

          {/* Customer Private Routes */}
          <Route
            path="/profile"
            element={
              <PrivateRoute allowedRoles={["customer", "admin"]} userRole={role}>
                <ProfilePage />
              </PrivateRoute>
            }
          />

          {/* Not Found Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        {role !== "admin" && <Footer />}
        <Toaster />
      </BrowserRouter>
    </>
  );
};

export default App;
