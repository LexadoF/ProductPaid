import React, { useEffect, useState } from 'react';
import { Container, TextField, Button, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../login/Login.css'
import { URL_BASE } from '../../shared/constants/constants';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if(isAuth) navigate('/store');
  }, [isAuth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const res = await axios.post(`${URL_BASE}users/create`, {
        name,
        email,
        password,
        address,
      });
      if (res.status === 201 || res.status === 200) {
        alert('Por favor inicie sesión');
        navigate('/login');
      }
    } catch (err: any) {
      if (err.response?.status === 400 || err.response?.status === 401) {
        setErrorMsg('Registration failed');
      }
    }
  };

  return (
    <div className="login-container">
      <Container maxWidth="sm">
        <form onSubmit={handleSubmit} className="login-form">
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Address"
            variant="outlined"
            fullWidth
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            margin="normal"
          />
          {errorMsg && <p className="errors-paragraph">{errorMsg}</p>}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Register
          </Button>
        </form>
      </Container>
    </div>
  );
};

export default Register;
