import React, { useEffect, useState } from 'react';
import './Navbar.css';

import { useSelector } from 'react-redux';

import logo from '../../Assets/logo.png';
import { Link,useNavigate } from 'react-router-dom';

import { RiMenu2Line } from 'react-icons/ri';
import { FiSearch } from 'react-icons/fi';
import { FaRegUser } from 'react-icons/fa6';
import { RiShoppingBagLine } from 'react-icons/ri';
import { MdOutlineClose } from 'react-icons/md';
import { FiHeart } from 'react-icons/fi';

// social Links imports Icons

import { FaFacebookF } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { FaInstagram } from 'react-icons/fa';
import { FaYoutube } from 'react-icons/fa';
import { FaPinterest } from 'react-icons/fa';
import Badge from '@mui/material/Badge';
import useAuth from '../../hooks/useAuth';
import { useGetCartItemsQuery } from '../../Features/Cart/cartApiSlice';
import { skipToken } from '@reduxjs/toolkit/query';
import {useSendLogoutMutation} from "../../Features/auth/authApiSlice"
const Navbar = () => {
  const [length, setLength] = useState(0);
  const cart = useSelector((state) => state.cart);
  const { full_name, email, user_id, role } = useAuth();
  console.log(full_name, email, user_id, role);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [sendLogout, ] = useSendLogoutMutation(); // RTK Query mutation hook

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    document.body.style.overflow = mobileMenuOpen ? 'auto' : 'hidden';
  };

  const handleLogout = async () => {
    try {
      await sendLogout().unwrap(); // Call API and wait for response
      navigate("/"); // Redirect to login after successful logout
      setLength(0);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const { isLoading, isError, error, data, isSuccess } = useGetCartItemsQuery(
    user_id || skipToken
  );

  useEffect(() => {
    if (isSuccess && data?.ids?.length >= 0) {
      setLength(data.ids.length);
    }
  }, [isSuccess, data]);
  return (
    <>
      {/* Desktop Menu */}
      <nav className="navBar">
        <div className="logoLinkContainer">
          <div className="logoContainer">
            <Link to="/" onClick={scrollToTop}>
              <img src={logo} alt="Logo" />
            </Link>
          </div>
          <div className="linkContainer">
            <ul>
              <li>
                <Link to="/" onClick={scrollToTop}>
                  HOME
                </Link>
              </li>
              <li>
                <Link to="/shop" onClick={scrollToTop}>
                  SHOP
                </Link>
              </li>
              <li>
                <Link to="/blog" onClick={scrollToTop}>
                  BLOG
                </Link>
              </li>
              <li>
                <Link to="/about" onClick={scrollToTop}>
                  ABOUT
                </Link>
              </li>
              <li>
                <Link to="/contact" onClick={scrollToTop}>
                  CONTACT
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="iconContainer">
          <FiSearch size={22} onClick={scrollToTop} />
          <Link
            to={full_name ? '/Profile' : '/loginSignUp'}
            onClick={scrollToTop}
          >
            <FaRegUser size={22} />
          </Link>
          <Link to="/cart" onClick={scrollToTop}>
            <Badge
              badgeContent={length}
              color="primary"
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
            >
              <RiShoppingBagLine size={22} />
            </Badge>
          </Link>
          
          <p>
           {full_name && ` Welcome, ${full_name}` }
          </p>
          {full_name && <Link
            to={'/'}
            onClick={handleLogout}
            style={{fontWeight:"bold"}}
          >Logout</Link>}

          {/* <RiMenu2Line size={22} /> */}
        </div>
      </nav>

      {/* Mobile Menu */}
      <nav>
        <div className="mobile-nav">
          {mobileMenuOpen ? (
            <MdOutlineClose size={22} onClick={toggleMobileMenu} />
          ) : (
            <RiMenu2Line size={22} onClick={toggleMobileMenu} />
          )}
          <div className="logoContainer">
            <Link to="/">
              <img src={logo} alt="Logo" />
            </Link>
          </div>
          <Link to="/cart">
            <Badge
              badgeContent={length}
              color="primary"
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
            >
              <RiShoppingBagLine size={22} color="black" />
            </Badge>
          </Link>
        </div>
        <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-menuTop">
            <div className="mobile-menuSearchBar">
              <div className="mobile-menuSearchBarContainer">
                <input type="text" placeholder="Search products" />
                <Link to="/shop">
                  <FiSearch size={22} onClick={toggleMobileMenu} />
                </Link>
              </div>
            </div>
            <div className="mobile-menuList">
              <ul>
                <li>
                  <Link to="/" onClick={toggleMobileMenu}>
                    HOME
                  </Link>
                </li>
                <li>
                  <Link to="/shop" onClick={toggleMobileMenu}>
                    SHOP
                  </Link>
                </li>
                <li>
                  <Link to="/blog" onClick={toggleMobileMenu}>
                    BLOG
                  </Link>
                </li>
                <li>
                  <Link to="/about" onClick={toggleMobileMenu}>
                    ABOUT
                  </Link>
                </li>
                <li>
                  <Link to="/contact" onClick={toggleMobileMenu}>
                    CONTACT
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mobile-menuFooter">
            <div className="mobile-menuFooterLogin">
              <Link to="/loginSignUp" onClick={toggleMobileMenu}>
                <FaRegUser />
                <p>My Account</p>
              </Link>
            </div>
            <div className="mobile-menuFooterLangCurrency">
              <div className="mobile-menuFooterLang">
                <p>Language</p>
                <select name="language" id="language">
                  <option value="english">United States | English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Germany">Germany</option>
                  <option value="French">French</option>
                </select>
              </div>
              <div className="mobile-menuFooterCurrency">
                <p>Currency</p>
                <select name="currency" id="currency">
                  <option value="USD">$ USD</option>
                  <option value="INR">₹ INR</option>
                  <option value="EUR">€ EUR</option>
                  <option value="GBP">£ GBP</option>
                </select>
              </div>
            </div>
            <div className="mobile-menuSocial_links">
              <FaFacebookF />
              <FaXTwitter />
              <FaInstagram />
              <FaYoutube />
              <FaPinterest />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
