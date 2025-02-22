import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminProducts.css"; 
import { useGetAllProductsQuery, useDeleteProductMutation } from "../../Features/products/productApiSlice";

const AdminProducts = () => {
  const navigate = useNavigate();
  const { data: products, isLoading, isError, error } = useGetAllProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();
  const [search, setSearch] = useState("");

  // Convert products from normalized state (if applicable)
  const allProducts = products?.ids?.map((id) => products.entities[id]) || [];

  // Filter products only when the user types in the search box
  const filteredProducts = search
    ? allProducts.filter((product) =>
        product.name?.toLowerCase().includes(search.toLowerCase())
      )
    : allProducts;

  return (
    <div className="admin-products-container">
      <h2>Admin Products</h2>

      <input
        type="text"
        placeholder="Search Products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {isLoading && <p>Loading products...</p>}
      {isError && <p className="error">{error?.message || "Failed to fetch products"}</p>}

      <div className="products-list">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} style={{color:"black"}} className="product-card">
              <img src={product.image_url} alt={product.productName} className="product-image" />
              <h3>{product.name || "Unnamed Product"}</h3>
              <p>Price: ${product.price || "N/A"}</p>
              <p>Stock: {product.stock || "N/A"}</p>
              <div className="actions">
                <button onClick={() => navigate(`/admin/update-product/${product.id}`)} className="update-btn">
                  Update
                </button>
                <button onClick={() => deleteProduct({ id: product.id })} className="delete-btn">
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-products">No products found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
