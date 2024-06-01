// src/components/__tests__/Users.test.js
import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import Users from '../Users';

// On crée un mock du composant UserForm pour isoler les tests sur le composant Users.
// Ce mock retourne un bouton qui simule l'ajout ou la mise à jour d'un utilisateur.
jest.mock('../UserForm', () => ({ userId, onSave }) => (
    <div data-testid="user-form">
        <button onClick={() => onSave({ id: userId || 'new', email: 'test@example.com', roles: ['ROLE_USER'] })}>
            {userId ? 'Update' : 'Add'} User
        </button>
    </div>
));

describe('Users Component', () => {
    // Réinitialisation du fetch avant chaque test
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    test('Récupère et affiche les utilisateurs', async () => {
        // Simulation de la réponse du fetch
        global.fetch.mockResolvedValue({
            json: jest.fn().mockResolvedValue([{ id: 1, email: 'user@example.com', roles: ['ROLE_USER'] }]),
        });

        await act(async () => {
            render(<Users />);
        });

        // Vérifie que l'email de l'utilisateur est bien retourné.
        expect(await screen.findByText('user@example.com')).toBeInTheDocument();
        expect(await screen.findByText('ROLE_USER')).toBeInTheDocument();
    });

    test('Supprime un utilisateur au clic du bouton', async () => {
        global.fetch
            .mockResolvedValueOnce({
                json: jest.fn().mockResolvedValue([{ id: 1, email: 'user@example.com', roles: ['ROLE_USER'] }]),
            })
            .mockResolvedValueOnce({
                json: jest.fn().mockResolvedValue([]),
            })
            .mockResolvedValueOnce({
                ok: true,
            });

        await act(async () => {
            render(<Users />);
        });

        expect(await screen.findByText('user@example.com')).toBeInTheDocument();
        expect(await screen.findByText('ROLE_USER')).toBeInTheDocument();

        await act(async () => {
            fireEvent.click(screen.getByText('Supprimer'));
        });

        expect(screen.queryByText('user@example.com')).not.toBeInTheDocument();
    });

    test('Ouvre le formulaire pour ajouter un utilisateur', async () => {
        global.fetch.mockResolvedValue({
            json: jest.fn().mockResolvedValue([{ id: 1, email: 'user@example.com', roles: ['ROLE_USER'] }]),
        });

        await act(async () => {
            render(<Users />);
        });

        fireEvent.click(screen.getByText('Ajouter un Utilisateur'));

        expect(screen.getByTestId('user-form')).toBeInTheDocument();
        expect(screen.getByText('Add User')).toBeInTheDocument();
    });

    test('Ouvre le formulaire pour modifier un utilisateur', async () => {
        global.fetch.mockResolvedValue({
            json: jest.fn().mockResolvedValue([{ id: 1, email: 'user@example.com', roles: ['ROLE_USER'] }]),
        });

        await act(async () => {
            render(<Users />);
        });

        await waitFor(() => screen.getByText('user@example.com'));

        fireEvent.click(screen.getByText('Modifier'));

        expect(screen.getByTestId('user-form')).toBeInTheDocument();
        expect(screen.getByText('Update User')).toBeInTheDocument();
    });

    test('Ajoute un nouvel utilisateur via le formulaire', async () => {
        global.fetch
            .mockResolvedValueOnce({
                json: jest.fn().mockResolvedValue([{ id: 1, email: 'user@example.com', roles: ['ROLE_USER'] }]),
            })
            .mockResolvedValueOnce({
                json: jest.fn().mockResolvedValue([{ id: 1, email: 'user@example.com', roles: ['ROLE_USER'] }, { id: 2, email: 'test@example.com', roles: ['ROLE_USER'] }]),
            });

        await act(async () => {
            render(<Users />);
        });

        fireEvent.click(screen.getByText('Ajouter un Utilisateur'));
        fireEvent.click(screen.getByText('Add User'));

        expect(await screen.findByText('test@example.com')).toBeInTheDocument();
    });

    test('Met à jour un utilisateur via le formulaire', async () => {
        global.fetch
            .mockResolvedValueOnce({
                json: jest.fn().mockResolvedValue([{ id: 1, email: 'user@example.com', roles: ['ROLE_USER'] }]),
            })
            .mockResolvedValueOnce({
                json: jest.fn().mockResolvedValue([{ id: 1, email: 'updated@example.com', roles: ['ROLE_USER'] }]),
            });

        await act(async () => {
            render(<Users />);
        });

        await waitFor(() => screen.getByText('user@example.com'));

        fireEvent.click(screen.getByText('Modifier'));
        fireEvent.click(screen.getByText('Update User'));

        expect(await screen.findByText('updated@example.com')).toBeInTheDocument();
    });
});
