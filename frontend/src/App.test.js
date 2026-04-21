import { render, screen } from '@testing-library/react';
import Login from './pages/Login';
import Register from './pages/Register';
import { BrowserRouter } from 'react-router-dom';

test('renders login page', () => {
    render(
        <BrowserRouter>
            <Login />
        </BrowserRouter>
    );
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
});

test('renders register page', () => {
    render(
        <BrowserRouter>
            <Register />
        </BrowserRouter>
    );
    expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
});