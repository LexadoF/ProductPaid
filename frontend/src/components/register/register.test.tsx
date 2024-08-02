// src/components/register/Register.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../app/store';
import Register from './register';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Register Component', () => {
  test('renders register form', () => {
    render(
      <Provider store={store}>
        <Router>
          <Register />
        </Router>
      </Provider>
    );

    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
  });

  test('shows error message on failed registration', async () => {
    mockedAxios.post.mockRejectedValue({
      response: { status: 400 },
    });

    render(
      <Provider store={store}>
        <Router>
          <Register />
        </Router>
      </Provider>
    );

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } });
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: '123 Main St' } });
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    await waitFor(() => {
      expect(screen.getByText(/Registration failed/i)).toBeInTheDocument();
    });
  });

  test('navigates to /login on successful registration', async () => {
    mockedAxios.post.mockResolvedValue({
      status: 200,
    });

    render(
      <Provider store={store}>
        <Router>
          <Register />
        </Router>
      </Provider>
    );

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } });
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: '123 Main St' } });
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    await waitFor(() => {
      // Check if the user is redirected
      expect(window.location.pathname).toBe('/login');
    });
  });
});
