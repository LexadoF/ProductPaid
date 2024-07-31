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

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const isAuth = useSelector((state: RootState)=> state.auth.isAuthenticated)
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ email, password }));
    dispatch(logout());
  };
console.log(isAuth)
  return (
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
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      </form>
    </Container>
  );
};

export default Login;
