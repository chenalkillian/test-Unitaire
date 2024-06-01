import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import Events from '../Events';

describe('Events Composant', () => {
    beforeEach(() => {
        global.fetch = jest.fn();  // Mock fetch
    });

    test('Rendu du composant et récupération des événements', async () => {
        global.fetch.mockResolvedValueOnce({
            json: () => Promise.resolve([{ id: 1, titre: 'Event 1', date: '2023-01-01' }])
        });

        await act(async () => {
            render(<Events />);
        });

        expect(await screen.findByText('Event 1')).toBeInTheDocument();
    });

    test("Suppression d'un évènement au clique du bouton", async () => {
        global.fetch
            .mockResolvedValueOnce({
                json: () => Promise.resolve([{ id: 1, titre: 'Event 1', date: '2023-01-01' }])
            })
            .mockResolvedValueOnce({
                json: () => Promise.resolve([])
            });

        await act(async () => {
            render(<Events />);
        });

        expect(await screen.findByText('Event 1')).toBeInTheDocument();

        await act(async () => {
            fireEvent.click(screen.getByText('Supprimer'));
        });

        await waitFor(() => expect(screen.queryByText('Event 1')).not.toBeInTheDocument());
    });

    test("Annule un évènement au clique du bouton d'annulation", async () => {
        global.fetch
            .mockResolvedValueOnce({
                json: () => Promise.resolve([{ id: 1, titre: 'Event 1', date: '2023-01-01' }])
            })
            .mockResolvedValueOnce({
                json: () => Promise.resolve({ id: 1, titre: 'Event 1', date: '2023-01-01', annulation: true, raison: 'Reason' })
            });

        await act(async () => {
            render(<Events />);
        });

        expect(await screen.findByText('Event 1')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Annuler'));

        fireEvent.change(screen.getByLabelText(/Raison de l'annulation/i), {
            target: { value: 'Reason' }
        });

        fireEvent.click(screen.getAllByText('Annuler l\'Événement')[1]); // Modification ici

        await waitFor(() => expect(screen.queryByText('Oui')).toBeInTheDocument());
        expect(screen.queryByText('Reason')).toBeInTheDocument();
    });

    test('Ouverture du formulaire de modification au clique du bouton', async () => {
        global.fetch.mockResolvedValueOnce({
            json: () => Promise.resolve([{ id: 1, titre: 'Event 1', date: '2023-01-01' }])
        });

        global.fetch.mockResolvedValueOnce({
            json: () => Promise.resolve({ id: 1, titre: 'Event 1', date: '2023-01-01', description: '', lieu: '', prix: '' })
        });

        await act(async () => {
            render(<Events />);
        });

        expect(await screen.findByText('Event 1')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Modifier'));

        expect(await screen.findByText('Modifier un Événement')).toBeInTheDocument();
    });

    test("Ajout d'un nouvel évènement en utilisant EventForm", async () => {
        global.fetch
            .mockResolvedValueOnce({
                json: () => Promise.resolve([])
            })
            .mockResolvedValueOnce({
                json: () => Promise.resolve({ id: 2, titre: 'New Event', date: '2023-01-02', description: '', lieu: '', prix: '' })
            })
            .mockResolvedValueOnce({
                json: () => Promise.resolve([{ id: 2, titre: 'New Event', date: '2023-01-02' }])
            });

        await act(async () => {
            render(<Events />);
        });

        fireEvent.click(screen.getByText('Ajouter un Événement'));

        fireEvent.change(screen.getByLabelText(/Titre/i), {
            target: { value: 'New Event' }
        });
        fireEvent.change(screen.getByLabelText(/Date/i), {
            target: { value: '2023-01-02' }
        });

        fireEvent.click(screen.getByText('Enregistrer'));

        await waitFor(() => expect(screen.getByText('New Event')).toBeInTheDocument());
    });
});
