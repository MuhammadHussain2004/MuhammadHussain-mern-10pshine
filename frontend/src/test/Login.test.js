import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import { login } from '../services/api';

// Mock the API module
jest.mock('../services/api', () => ({
    login: jest.fn(),
}));

const renderWithRouter = (ui) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Login Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    test('renders login form correctly', () => {
        renderWithRouter(<Login />);
        expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    test('allows user to type in credentials', () => {
        renderWithRouter(<Login />);
        const emailInput = screen.getByPlaceholderText('you@example.com');
        const passwordInput = screen.getByPlaceholderText('••••••••');

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(emailInput.value).toBe('test@example.com');
        expect(passwordInput.value).toBe('password123');
    });

    test('submits form and saves token on successful login', async () => {
        const mockResponse = {
            data: {
                token: 'fake-token-123',
                user: { id: 1, name: 'Test User', email: 'test@example.com' }
            }
        };
        login.mockResolvedValueOnce(mockResponse);

        renderWithRouter(<Login />);

        fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
        });

        expect(localStorage.getItem('token')).toBe('fake-token-123');
        expect(localStorage.getItem('user')).toBe(JSON.stringify(mockResponse.data.user));
    });

    test('displays error message on login failure', async () => {
        login.mockRejectedValueOnce({
            response: { data: { message: 'Invalid credentials' } }
        });

        renderWithRouter(<Login />);

        fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'wrong@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'wrongpass' } });
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
        });
    });
});
