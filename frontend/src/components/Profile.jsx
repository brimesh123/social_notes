// frontend/src/components/Profile.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState({ name: '', email: '', mobile: '', profilePhoto: '' });
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/profile', {
          headers: { 'x-auth-token': token }
        });
        setProfile(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, [token]);

  const onChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('http://localhost:5000/api/profile', profile, {
        headers: { 'x-auth-token': token }
      });
      setProfile(res.data);
      setMessage('Profile updated successfully');
    } catch (err) {
      console.error(err);
      setMessage('Error updating profile');
    }
  };

  return (
    <div>
      <h1>Profile Setup</h1>
      {message && <p>{message}</p>}
      <form onSubmit={onSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={profile.name} onChange={onChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={profile.email} disabled />
        </div>
        <div>
          <label>Mobile:</label>
          <input type="text" name="mobile" value={profile.mobile} onChange={onChange} />
        </div>
        <div>
          <label>Profile Photo URL:</label>
          <input type="text" name="profilePhoto" value={profile.profilePhoto} onChange={onChange} />
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;
