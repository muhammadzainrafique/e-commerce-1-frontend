import React, { useEffect, useState } from 'react';
import './LoginSignUp.css';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../../../Features/auth/authApiSlice';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../../Features/auth/authSlice';
import { useAddNewUserMutation } from '../../../Features/users/userApiSlice';
import toast from 'react-hot-toast';
import useAuth from '../../../hooks/useAuth';
const LoginSignUp = () => {
  const [activeTab, setActiveTab] = useState('tabButton1');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [full_name, set_full_name] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [loader, setLoader] = useState(false);
  const [submit, setHandleSubmit] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleTab = (tab) => {
    setActiveTab(tab);
  };
  const {role} = useAuth();
  const [login, { isLoading, isSuccess, isError, error, data }] =
    useLoginMutation({});

  const [
    addNewUser,
    {
      isLoading: addNewUserLoading,
      isSuccess: addNewUserSuccess,
      isError: addNewUserError,
      error: addNewUserErrorData,
      data: addNewUserData,
    },
  ] = useAddNewUserMutation();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      if (isLoading) {
        setLoader(true);
        console.log('Loading...');
      }
      if (isError) {
        setLoader(false);
        console.log('Error:', error);
      }
      
    } catch (error) {}
  };

  useEffect(()=>{
    if (isSuccess) {
      setLoader(false);
      dispatch(setCredentials(data.token));
      toast.success(`Welcome back!`);
      role!=="admin"?navigate("/"):navigate("/admin/dashboard");
      
    }
  },[role, isSuccess, navigate])

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    try {
      await addNewUser({ email, password, contact, address, full_name });
      if (addNewUserLoading) {
        setLoader(true);
        console.log('Loading...');
      }
      if (addNewUserError) {
        setLoader(false);
        console.log('Error:', error);
      }
      if (addNewUserSuccess) {
        setLoader(false);
        toast.success('User Registered Successfully');
        setActiveTab('tabButton1');
        console.log('Data:', addNewUserData);
      }
    } catch (error) {}
  };
  const content = (
    <>
      <div className="loginSignUpSection">
        <div className="loginSignUpContainer">
          <div className="loginSignUpTabs">
            <p
              onClick={() => handleTab('tabButton1')}
              className={activeTab === 'tabButton1' ? 'active' : ''}
            >
              Login
            </p>
            <p
              onClick={() => handleTab('tabButton2')}
              className={activeTab === 'tabButton2' ? 'active' : ''}
            >
              Register
            </p>
          </div>
          <div className="loginSignUpTabsContent">
            {/* tab1 */}

            {activeTab === 'tabButton1' && (
              <div className="loginSignUpTabsContentLogin">
                <form>
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="Email address *"
                    required
                  />
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Password *"
                    required
                  />
                  <div className="loginSignUpForgetPass">
                    <label>
                      <input type="checkbox" className="brandRadio" />
                      <p>Remember me</p>
                    </label>
                    <p>
                      <Link to="/resetPassword">Lost password?</Link>
                    </p>
                  </div>
                  <button disabled={loader} onClick={handleLoginSubmit}>
                    Log In
                  </button>
                </form>
                <div className="loginSignUpTabsContentLoginText">
                  <p>
                    No account yet?{' '}
                    <span onClick={() => handleTab('tabButton2')}>
                      Create Account
                    </span>
                  </p>
                </div>
              </div>
            )}

            {/* Tab2 */}

            {activeTab === 'tabButton2' && (
              <div className="loginSignUpTabsContentRegister">
                <form>
                  <input
                    onChange={(e) => set_full_name(e.target.value)}
                    type="text"
                    placeholder="Fullname *"
                    required
                  />
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="Email address *"
                    required
                  />
                  <input
                    onChange={(e) => setContact(e.target.value)}
                    type="text"
                    placeholder="Contact number *"
                    required
                  />
                  <input
                    onChange={(e) => setAddress(e.target.value)}
                    type="text"
                    placeholder="Address *"
                    required
                  />

                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Password *"
                    required
                  />
                  <p>
                    Your personal data will be used to support your experience
                    throughout this website, to manage access to your account,
                    and for other purposes described in our
                    <Link
                      to="/terms"
                      style={{ textDecoration: 'none', color: '#c32929' }}
                    >
                      {' '}
                      privacy policy
                    </Link>
                    .
                  </p>
                  <button onClick={handleSignUpSubmit}>Register</button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
  return content;
};

export default LoginSignUp;
