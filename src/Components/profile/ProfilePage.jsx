import React, { useState, useEffect } from 'react';
import './ProfilePage.css';
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from '../../Features/users/userApiSlice';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { full_name, user_id } = useAuth();
  const {
    isLoading,
    isError,
    error,
    isSuccess,
    data: user,
    refetch, // Get the refetch method
  } = useGetUserByIdQuery(user_id);

  const [
    updateUser,
    {
      isLoading: updateUserLoading,
      isError: updateUserIsError,
      isSuccess: updateUserSuccess,
      error: updateUserError,
    },
  ] = useUpdateUserMutation();

  // Initialize profile state
  const [profile, setProfile] = useState({
    full_name: '',
    contact: '',
    address: '',
    email: '',
  });

  useEffect(() => {
    if (isSuccess && user) {
      setProfile({
        full_name: user.full_name || '',
        contact: user.contact || '',
        address: user.address || '',
        email: user.email || '',
      });
    }
  }, [isSuccess, user]);

  useEffect(() => {
    if (updateUserSuccess) {
      toast.success('Profile updated successfully');
      // Manually trigger refetch to get the updated user data
      refetch();
    }
    if (updateUserIsError) {
      toast.error('Error updating profile');
    }
  }, [updateUserSuccess, updateUserIsError, refetch]); // Include refetch in the dependency array

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setProfile({ ...profile, profileImage: imageURL });
    }
  };

  const handleSaveChanges = async () => {
    try {
      // Add basic validation here if necessary (e.g., check if all fields are filled)
      if (!profile.full_name || !profile.email || !profile.contact) {
        toast.error('Please fill in all required fields');
        return;
      }
      await updateUser({ profile, user_id });
    } catch (err) {
      toast.error('Failed to save changes');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error?.message}</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1 className="welcome-message">
          Welcome, {profile.full_name || full_name}
        </h1>

        <div className="profile-header">
          <div className="profile-image-container">
            <img
              src={'https://avatars.githubusercontent.com/u/147074765?v=4'}
              alt="Profile"
              className="profile-image"
            />
            <label htmlFor="file-upload" className="image-upload-label">
              Change Picture
            </label>
            <input
              type="file"
              id="file-upload"
              className="file-upload"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </div>

        <div className="profile-form">
          <div className="form-group">
            <label htmlFor="full_name">Name:</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={profile.full_name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact">Contact Number:</label>
            <input
              type="tel"
              id="contact"
              name="contact"
              value={profile.contact}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={profile.address}
              onChange={handleChange}
            />
          </div>
        </div>

        <button
          onClick={handleSaveChanges}
          className="save-button"
          disabled={updateUserLoading}
        >
          {updateUserLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
