import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./AdminUpdateProduct.module.css"; 
import { useGetProductByIdQuery, useUpdateProductMutation } from "../../Features/products/productApiSlice";

const AdminUpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading, isError } = useGetProductByIdQuery(id);
  const [updateProduct] = useUpdateProductMutation();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    image_url: "",
  });

  // Populate form with product details
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        price: product.price || "",
        stock: product.stock || "",
        image_url: product.image_url || "",
      });
    }
  }, [product]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProduct({ id, formData });
    navigate("/admin/products");
  };

  if (isLoading) return <p>Loading product details...</p>;
  if (isError) return <p className={styles.error}>Error fetching product</p>;

  return (
    <div className={styles.updateProductContainer}>
      <h2>Update Product</h2>
      <form onSubmit={handleSubmit} className={styles.updateForm}>
        <div className={styles.formGroup}>
          <label>Product Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Price ($):</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Stock:</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Image URL:</label>
          <input
            type="text"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
        
        {/* Show Image Preview if URL is available */}
        {formData.image_url && (
          <div className={styles.imagePreview}>
            <img
              src={formData.image_url}
              alt="Product Preview"
              className={styles.previewImg}
            />
          </div>
        )}

        <button type="submit" className={styles.updateBtn}>
          Update Product
        </button>
      </form>
    </div>
  );
};

export default AdminUpdateProduct;
