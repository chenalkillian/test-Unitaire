// src/components/__tests__/UserForm.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import UserForm from '../UserForm';

describe('UserForm Composant', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    test('Affiche le formulaire de création initial', async () => {
        const handleSave = jest.fn();

        await act(async () => {
            render(<UserForm onSave={handleSave} />);
        });

        expect(screen.getByLabelText(/Email/i)).toHaveValue('');
        expect(screen.getByLabelText(/Mot de passe/i)).toHaveValue('');
        expect(screen.getByLabelText(/Rôles/i)).toHaveValue('');
    });

    test('Affiche les données d\'un utilisateur existant', async () => {
        const handleSave = jest.fn();
        const user = { id: 1, email: 'user@example.com', roles: ['ROLE_USER'] };

        global.fetch.mockResolvedValueOnce({
            json: () => Promise.resolve(user)
        });

        await act(async () => {
            render(<UserForm userId={user.id} onSave={handleSave} />);
        });

        expect(await screen.findByDisplayValue(user.email)).toBeInTheDocument();
        expect(await screen.findByDisplayValue('ROLE_USER')).toBeInTheDocument();
    });

    test('Soumet le formulaire pour la création d\'un utilisateur', async () => {
        const handleSave = jest.fn();

        await act(async () => {
            render(<UserForm onSave={handleSave} />);
        });

        fireEvent.change(screen.getByLabelText(/Email/i), {
            target: { value: 'newuser@example.com' },
        });
        fireEvent.change(screen.getByLabelText(/Mot de passe/i), {
            target: { value: 'password123' },
        });
        fireEvent.change(screen.getByLabelText(/Rôles/i), {
            target: { value: '' },
        });

        global.fetch.mockResolvedValueOnce({
            json: () => Promise.resolve({ id: 1, email: 'newuser@example.com', roles: ['ROLE_USER'] })
        });

        await act(async () => {
            fireEvent.submit(screen.getByText(/Enregistrer/i));
        });

        await waitFor(() => {
            expect(handleSave).toHaveBeenCalledWith({
                id: 1,
                email: 'newuser@example.com',
                password: 'password123',
                roles: ['ROLE_USER'],
            });
        });
    });

    test('Soumet le formulaire pour la mise à jour d\'un utilisateur', async () => {
        const handleSave = jest.fn();
        const user = { id: 1, email: 'user@example.com', roles: ['ROLE_USER'] };

        global.fetch.mockResolvedValueOnce({
            json: () => Promise.resolve(user)
        });

        await act(async () => {
            render(<UserForm userId={user.id} onSave={handleSave} />);
        });

        fireEvent.change(screen.getByLabelText(/Email/i), {
            target: { value: 'updateduser@example.com' },
        });
        fireEvent.change(screen.getByLabelText(/Rôles/i), {
            target: { value: 'ROLE_ADMIN' },
        });

        global.fetch.mockResolvedValueOnce({
            json: () => Promise.resolve({ id: user.id, email: 'updateduser@example.com', roles: ['ROLE_ADMIN'] })
        });

        await act(async () => {
            fireEvent.submit(screen.getByText(/Enregistrer/i));
        });

        await waitFor(() => {
            expect(handleSave).toHaveBeenCalledWith({
                id: user.id,
                email: 'updateduser@example.com',
                roles: ['ROLE_ADMIN'],
                password: ''
            });
        });
    });

    test('Vérifie que les champs obligatoires sont validés', async () => {
        const handleSave = jest.fn();

        await act(async () => {
            render(<UserForm onSave={handleSave} />);
        });

        await act(async () => {
            fireEvent.submit(screen.getByText(/Enregistrer/i));
        });

        await waitFor(() => expect(handleSave).not.toHaveBeenCalled());
    });
});
