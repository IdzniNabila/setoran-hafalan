import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api';

const Login = () => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await authService.login(user, pass);
      localStorage.setItem('token', res.data.access_token);
      navigate('/dashboard');
    } catch (err) {
      alert("Login Gagal! Periksa NIM/NIP dan Password.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4" style={{ width: '400px' }}>
        <h3 className="text-center fw-bold mb-4">Setoran Hafalan</h3>
        <form onSubmit={handleLogin}>
          <input className="form-control mb-3" placeholder="Username" onChange={e => setUser(e.target.value)} />
          <input className="form-control mb-3" type="password" placeholder="Password" onChange={e => setPass(e.target.value)} />
          <button className="btn btn-primary w-100">Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default Login;