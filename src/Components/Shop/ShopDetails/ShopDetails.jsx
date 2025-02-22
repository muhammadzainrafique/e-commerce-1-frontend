import React, { useState } from 'react';
import './ShopDetails.css';

import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../../Features/Cart/cartSlice';
import Filter from '../Filters/Filter';
import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { IoFilterSharp, IoClose } from 'react-icons/io5';
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa6';
import { FaCartPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { selectAllProduct } from '../../../Features/products/productApiSlice';
import { useAddCartItemMutation } from '../../../Features/Cart/cartApiSlice';
import useAuth from '../../../hooks/useAuth';

const ShopDetails = () => {
  const dispatch = useDispatch();
  const allProducts = useSelector(selectAllProduct);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const [wishList, setWishList] = useState({});

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  const cartItems = useSelector((state) => state.cart.items);

  // Calculate total pages
  const totalPages = Math.ceil(allProducts.length / productsPerPage);

  // Calculate the products for the current page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = allProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handleWishlistClick = (productID) => {
    setWishList((prevWishlist) => ({
      ...prevWishlist,
      [productID]: !prevWishlist[productID],
    }));
  };

  const [addCartItem, { isLoading, isError, error, isSuccess, data }] =
    useAddCartItemMutation();
  const { user_id } = useAuth();
  const handleAddToCart = async (product) => {
    if (!user_id) {
      toast.error('Please login to add to cart');
      return;
    }
    await addCartItem({
      user_id,
      product_id: product.product_id,
      quantitiy: 1,
    });
    if (isSuccess) {
      toast.success('Added to cart');
    }
    // const productInCart = cartItems.find(
    //   (item) => item.productID === product.productID
    // );

    // if (productInCart && productInCart.quantity >= 20) {
    //   toast.error('Product limit reached', {
    //     duration: 2000,
    //     style: { backgroundColor: '#ff4b4b', color: 'white' },
    //     iconTheme: { primary: '#fff', secondary: '#ff4b4b' },
    //   });
    // } else {
    //   dispatch(addToCart(product));
    //   toast.success(`Added to cart!`, {
    //     duration: 2000,
    //     style: { backgroundColor: '#07bc0c', color: 'white' },
    //     iconTheme: { primary: '#fff', secondary: '#07bc0c' },
    //   });
    // }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    scrollToTop();
  };

  return (
    <div className="shopDetails">
      <div className="shopDetailMain">
        <div className="shopDetails__left">
          <Filter />
        </div>
        <div className="shopDetails__right">
          <div className="shopDetailsProducts">
            <div className="shopDetailsProductsContainer">
              {currentProducts.map((product) => (
                <div className="sdProductContainer" key={product.id}>
                  {/* Product Content */}
                  <div className="sdProductImages">
                    <Link
                      to={`/product/${product.product_id}`}
                      onClick={scrollToTop}
                    >
                      <img
                        src={product.image_url}
                        alt=""
                        className="sdProduct_front"
                      />
                      <img
                        src={product.image_url}
                        alt=""
                        className="sdProduct_back"
                      />
                    </Link>
                    <h4 onClick={() => handleAddToCart(product)}>
                      Add to Cart
                    </h4>
                  </div>
                  <div
                    className="sdProductImagesCart"
                    onClick={() => handleAddToCart(product)}
                  >
                    <FaCartPlus />
                  </div>
                  <div className="sdProductInfo">
                    <h5>
                      <Link
                        style={{ textDecoration: 'none', color: 'black' }}
                        to={`/product/${product.product_id}`}
                        onClick={scrollToTop}
                      >
                        {product.name}
                      </Link>
                    </h5>

                    <p>${product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div className="shopDetailsPagination">
            <div className="sdPaginationPrev">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <FaAngleLeft /> Prev
              </button>
            </div>
            <div className="sdPaginationNumber">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  className={currentPage === index + 1 ? 'active' : ''}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <div className="sdPaginationNext">
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next <FaAngleRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDetails;
