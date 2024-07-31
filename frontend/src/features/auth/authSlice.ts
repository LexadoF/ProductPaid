import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  email: string,
  token: string
}

interface AuthState {
  isAuthenticated: boolean;
  user: User;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: {
    email: '',
    token: ''
  },
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AuthState>) => {
      state.isAuthenticated = true;
      state.user = {
        email: action.payload.user.email,
        token: action.payload.user.token
      };
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = {
        email: '',
        token: ''
      };
    },
  },
});

export const { login, logout } = authSlice.actions;
