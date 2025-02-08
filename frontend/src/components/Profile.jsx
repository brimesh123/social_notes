// frontend/src/components/Profile.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css'; // Ensure you have your CSS imported
import { API_URL } from '../../src/config'; // Adjust path as needed


const Profile = () => {
  // Added 'passkey' to the profile state
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    mobile: '',
    profilePhoto: '',
    passkey: ''  // Optional passkey field
  });
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('${API_URL}/api/profile', {
          headers: { 'x-auth-token': token },
        });
        setProfile(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Handler for file uploads using Multer
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('photo', file);
      const res = await axios.post('${API_URL}/api/upload', formData, {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data',
        },
      });
      // Update the profilePhoto field with the URL returned from the server
      setProfile((prev) => ({ ...prev, profilePhoto: res.data.fileUrl }));
      setUploading(false);
    } catch (err) {
      console.error(err);
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('${API_URL}/api/profile', profile, {
        headers: { 'x-auth-token': token },
      });
      setProfile(res.data);
      setMessage('Profile updated successfully');
    } catch (err) {
      console.error(err);
      setMessage('Error updating profile');
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-photo-section">
          {profile.profilePhoto ? (
            <img src={profile.profilePhoto} alt="Profile" className="profile-photo" />
          ) : (
            <div className="profile-placeholder">No Photo</div>
          )}
        </div>
        <div className="profile-info">
          <h1>{profile.name || "Your Name"}</h1>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Mobile:</strong> {profile.mobile || "Not provided"}</p>
          {profile.passkey && profile.passkey.trim() !== '' && (
            <p><strong>Passkey Enabled</strong></p>
          )}
        </div>
      </div>
      <div className="profile-update-section">
        <h2>Update Profile</h2>
        {message && <p className="profile-message">{message}</p>}
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={profile.name} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="mobile">Mobile</label>
            <input 
              type="text" 
              id="mobile" 
              name="mobile" 
              value={profile.mobile} 
              onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <label htmlFor="passkey">Passkey (Optional)</label>
            <input 
              type="password" 
              id="passkey" 
              name="passkey" 
              value={profile.passkey} 
              onChange={handleChange} 
              placeholder="Set a passkey to secure your public notes"
            />
          </div>
          <div className="form-group">
            <label htmlFor="photo">Profile Photo</label>
            <input 
              type="file" 
              id="photo" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
            {uploading && <p className="uploading-text">Uploading...</p>}
          </div>
          <button type="submit" className="update-button">Update Profile</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
