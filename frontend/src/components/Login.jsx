// frontend/src/components/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../../src/config'; // Adjust path as needed


const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const onChange = (e) => {
    console.log(`Input changed: ${e.target.name} = ${e.target.value}`);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting login form with data:', formData);

    try {
      const res = await axios.post('https://social-notes.onrender.com/api/auth/login', formData);
      console.log('Login successful, received response:', res.data);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      console.error('Error during login request:', err);
      if (err.response) {
        console.error('Error response data:', err.response.data);
        setErrors(err.response.data.errors || []);
      } else {
        console.error('No response from server:', err);
        setErrors([{ msg: 'No response from server. Please try again later.' }]);
      }
    }
  };

  return (
    <div className="form-container">
      <h1>Login</h1>
      {errors.map((error, idx) => (
        <p key={idx} className="error">{error.msg}</p>
      ))}
      <form onSubmit={onSubmit} className="form">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          placeholder="Email"
          required
          className="form-input"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={onChange}
          placeholder="Password"
          required
          className="form-input"
        />
        <button type="submit" className="form-button">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register here.</Link>
      </p>
    </div>
  );
};

export default Login;
