// src/App.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import { MemoryRouter } from 'react-router-dom';

// Mock components to prevent actual routing
jest.mock('./components/login/Login', () => () => <div>Login Component</div>);
jest.mock('./components/mainPage/mainPage', () => () => <div>MainPage Component</div>);
jest.mock('./components/shared/navbar', () => () => <div>Navbar</div>);
jest.mock('./components/register/register', () => () => <div>Register Component</div>);
jest.mock('./components/myTransactions/mytransactions', () => () => <div>MyTransactions Component</div>);

describe('App Component', () => {
  test('renders Navbar and routes', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    // Navbar should be present
    expect(screen.getByText(/Navbar/i)).toBeInTheDocument();

    // Check if route elements are present
    expect(screen.getByText(/MainPage Component/i)).toBeInTheDocument();
    expect(screen.getByText(/Register Component/i)).toBeInTheDocument();
    expect(screen.getByText(/MyTransactions Component/i)).toBeInTheDocument();
    expect(screen.getByText(/Login Component/i)).toBeInTheDocument();
  });
});
