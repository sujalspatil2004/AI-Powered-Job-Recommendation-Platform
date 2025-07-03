import React from 'react';
import { render, screen } from '@testing-library/react';
import Login from '../Login/index.jsx';

describe('Login Component', () => {
  it('renders login form', () => {
    render(<Login />);
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });
});
