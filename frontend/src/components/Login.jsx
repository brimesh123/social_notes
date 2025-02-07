// frontend/src/components/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      setErrors(err.response.data.errors || []);
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
