// src/components/login/Login.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../app/store';
import Login from './Login';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Login Component', () => {
  test('renders login form', () => {
    render(
      <Provider store={store}>
        <Router>
          <Login />
        </Router>
      </Provider>
    );

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
  });

  test('shows error message on failed login', async () => {
    mockedAxios.post.mockRejectedValue({
      response: { status: 400 },
    });

    render(
      <Provider store={store}>
        <Router>
          <Login />
        </Router>
      </Provider>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

  });

  test('navigates to /store on successful login', async () => {
    mockedAxios.post.mockResolvedValue({
      status: 200,
      data: { token: 'fake-token' },
    });

    render(
      <Provider store={store}>
        <Router>
          <Login />
        </Router>
      </Provider>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      // Check if the user is redirected
      expect(window.location.pathname).toBe('/store');
    });
  });
});
