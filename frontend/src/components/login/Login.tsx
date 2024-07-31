import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../../features/auth/authSlice';
import {
  Container,
  TextField,
  Button,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import './Login.css';
import { RootState } from '../../app/store';
import axios, { AxiosError } from 'axios';
import { URL_BASE } from '../../shared/constants/constants';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [jsonToken, setjsonToken] = useState('');
  const [errorMsg, seterrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated)
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    seterrorMsg('');
    axios.post(`${URL_BASE}auth/login`, {
      email: email,
      password: password
    }).then((res) => {
      if (res.status === 201 || res.status === 200) {
        setjsonToken(res.data.token);
        dispatch(login({ isAuthenticated: true, user: { email, token: jsonToken } }));
      }
      dispatch(logout());
    }).catch((err: AxiosError) => {
      {
        if (err.response?.status === 400) {
          seterrorMsg('Credenciales invalidas');
        }
      }
    });
    return;
  };
  return (
    <div className="login-container">
      <Container maxWidth="sm">
        <form onSubmit={handleSubmit} className="login-form">
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
            label="Contraseña"
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
          {errorMsg && <p className='errors-paragraph'>{errorMsg}</p>}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </form>
      </Container>
    </div>
  );
};

export default Login;
