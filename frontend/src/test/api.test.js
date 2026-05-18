import axios from 'axios';
import {
    register,
    login,
    verifyEmail,
    getNotes,
    createNote,
    updateNote,
    deleteNote
} from '../services/api';

jest.mock('axios', () => {
    const mockAxiosInstance = {
        interceptors: {
            request: { use: jest.fn() },
        },
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
    };
    return {
        create: jest.fn(() => mockAxiosInstance),
    };
});

describe('API Services', () => {
    let mockAxiosInstance;

    beforeAll(() => {
        // Retrieve the mocked instance so we can assert on it
        mockAxiosInstance = axios.create();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('register calls post with correct data', async () => {
        const data = { name: 'Test', email: 'test@example.com', password: 'pass' };
        mockAxiosInstance.post.mockResolvedValueOnce({ data: 'success' });

        const response = await register(data);
        expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/register', data);
        expect(response).toEqual({ data: 'success' });
    });

    test('login calls post with correct data', async () => {
        const data = { email: 'test@example.com', password: 'pass' };
        mockAxiosInstance.post.mockResolvedValueOnce({ data: 'token' });

        const response = await login(data);
        expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/login', data);
        expect(response).toEqual({ data: 'token' });
    });

    test('getNotes calls get to /notes', async () => {
        mockAxiosInstance.get.mockResolvedValueOnce({ data: [] });

        const response = await getNotes();
        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/notes');
        expect(response).toEqual({ data: [] });
    });

    test('createNote calls post to /notes with data', async () => {
        const data = { title: 'Note 1', content: 'Content 1' };
        mockAxiosInstance.post.mockResolvedValueOnce({ data: 'created' });

        const response = await createNote(data);
        expect(mockAxiosInstance.post).toHaveBeenCalledWith('/notes', data);
        expect(response).toEqual({ data: 'created' });
    });

    test('updateNote calls put to /notes/:id with data', async () => {
        const id = '123';
        const data = { title: 'Updated' };
        mockAxiosInstance.put.mockResolvedValueOnce({ data: 'updated' });

        const response = await updateNote(id, data);
        expect(mockAxiosInstance.put).toHaveBeenCalledWith(`/notes/${id}`, data);
        expect(response).toEqual({ data: 'updated' });
    });

    test('deleteNote calls delete to /notes/:id', async () => {
        const id = '123';
        mockAxiosInstance.delete.mockResolvedValueOnce({ data: 'deleted' });

        const response = await deleteNote(id);
        expect(mockAxiosInstance.delete).toHaveBeenCalledWith(`/notes/${id}`);
        expect(response).toEqual({ data: 'deleted' });
    });
});

