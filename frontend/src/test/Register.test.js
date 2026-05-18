import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Register from '../pages/Register';
import { register } from '../services/api';

jest.mock('../services/api', () => ({
    register: jest.fn(),
}));

const renderWithRouter = (ui) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Register Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders register form correctly', () => {
        renderWithRouter(<Register />);
        expect(screen.getByPlaceholderText('Enter Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    });

    test('submits form on successful registration', async () => {
        register.mockResolvedValueOnce({
            data: { message: 'Registration successful! Please check your email for verification code.' }
        });

        renderWithRouter(<Register />);

        fireEvent.change(screen.getByPlaceholderText('Enter Name'), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'john@gmail.com' } });
        fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /create account/i }));

        await waitFor(() => {
            expect(register).toHaveBeenCalledWith({
                name: 'John Doe',
                email: 'john@gmail.com',
                password: 'password123'
            });
        });
    });

    test('displays error message on registration failure', async () => {
        register.mockRejectedValueOnce({
            response: { data: { message: 'Email already registered' } }
        });

        renderWithRouter(<Register />);

        fireEvent.change(screen.getByPlaceholderText('Enter Name'), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'john@gmail.com' } });
        fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /create account/i }));

        await waitFor(() => {
            expect(screen.getByText('Email already registered')).toBeInTheDocument();
        });
    });

    test('displays validation error on invalid email domain', async () => {
        renderWithRouter(<Register />);

        fireEvent.change(screen.getByPlaceholderText('Enter Name'), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /create account/i }));

        await waitFor(() => {
            expect(screen.getByText('Please use a valid email (Gmail, Yahoo, Hotmail, Outlook, iCloud)')).toBeInTheDocument();
        });
    });
});
