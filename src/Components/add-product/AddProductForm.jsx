import React, { useState, useCallback, useEffect } from "react";
import styles from "./AddProductForm.module.css";
import { useAddNewProductMutation } from "../../Features/products/productApiSlice";
import useAuth from "../../hooks/useAuth";

const AddProductForm = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [image_url, setImageUrl] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { user_id } = useAuth();
  const [addNewProduct, {
    isSuccess,
    isError,
    error
  }] = useAddNewProductMutation();

  // Handle Image URL Input Change
  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value);
    setPreview(e.target.value); // Set preview from URL input
  };

  // Handle Form Submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const submissionData = {
        name,
        price,
        description,
        stock,
        image_url, // Send the image URL
      };
       await addNewProduct(submissionData).unwrap();
    } catch (error) {
      setMessage("Network error! Try again later.");
    }
   

    setLoading(false);
  }, [addNewProduct, name, price, description, stock, image_url, user_id]);
  useEffect(()=>{
    if (isSuccess) {
      setMessage("Product added successfully!");
      setName("");
      setPrice("");
      setDescription("");
      setStock("");
      setImageUrl("");
      setPreview(null);
    } else {
      setMessage(error?.message || "Something went wrong!");
    }
  },[isSuccess, isError])
  return (
    <div className={styles.addProductContainer}>
      <h2 className={styles.heading}>Add New Product</h2>
      {message && <p className={styles.message}>{message}</p>}

      <form onSubmit={handleSubmit}>
        {/* Name Field */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Name</label>
          <input
            type="text"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Price Field */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Price</label>
          <input
            type="number"
            className={styles.input}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        {/* Stock Field */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Stock</label>
          <input
            type="number"
            className={styles.input}
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </div>

        {/* Description Field */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Description</label>
          <textarea
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* Image URL Field */}
        <div className={styles.formGroup}>
          <label className={styles.label}>Image URL</label>
          <input
            type="text"
            className={styles.input}
            value={image_url}
            onChange={handleImageUrlChange}
            required
          />
          {preview && <img src={preview} alt="Preview" className={styles.imagePreview} />}
        </div>

        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProductForm;
