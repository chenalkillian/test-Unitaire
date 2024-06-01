import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import EventForm from '../EventForm';

describe('EventForm Component', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    test('Rendu du formulaire et remplissage des champs', async () => {
        await act(async () => {
            render(<EventForm onSave={jest.fn()} />);
        });

        // Vérifie que les champs de saisie sont présents.
        expect(screen.getByLabelText(/Titre/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Lieu/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Prix/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Limite/i)).toBeInTheDocument();

        // Simule la saisie dans les champs de formulaire.
        fireEvent.change(screen.getByLabelText(/Titre/i), {
            target: { value: 'New Event' },
        });
        fireEvent.change(screen.getByLabelText(/Description/i), {
            target: { value: 'Event Description' },
        });
        fireEvent.change(screen.getByLabelText('Date 1'), {
            target: { value: '2023-01-01T10:00' },
        });
        fireEvent.change(screen.getByLabelText(/Lieu/i), {
            target: { value: 'Event Location' },
        });
        fireEvent.change(screen.getByLabelText(/Prix/i), {
            target: { value: '50' },
        });
        fireEvent.change(screen.getByLabelText(/Limite/i), {
            target: { value: '100' },
        });

        // Vérifie que les champs de saisie contiennent les valeurs correctes après la saisie.
        expect(screen.getByLabelText(/Titre/i).value).toBe('New Event');
        expect(screen.getByLabelText(/Description/i).value).toBe('Event Description');
        expect(screen.getByLabelText('Date 1').value).toBe('2023-01-01T10:00');
        expect(screen.getByLabelText(/Lieu/i).value).toBe('Event Location');
        expect(screen.getByLabelText(/Prix/i).value).toBe('50');
        expect(screen.getByLabelText(/Limite/i).value).toBe('100');
    });

    test('Ajout et suppression de champs de date', async () => {
        await act(async () => {
            render(<EventForm onSave={jest.fn()} />);
        });

        // Ajoute un nouveau champ de date
        fireEvent.click(screen.getByText(/Ajouter une date/i));

        // Vérifie qu'il y a maintenant deux champs de date
        expect(screen.getAllByLabelText(/Date/i).length).toBe(2);

        // Remplit les champs de date
        fireEvent.change(screen.getByLabelText('Date 1'), {
            target: { value: '2023-01-01T10:00' },
        });
        fireEvent.change(screen.getByLabelText('Date 2'), {
            target: { value: '2023-01-02T10:00' },
        });

        // Vérifie les valeurs des champs de date
        expect(screen.getByLabelText('Date 1').value).toBe('2023-01-01T10:00');
        expect(screen.getByLabelText('Date 2').value).toBe('2023-01-02T10:00');

        // Supprime un champ de date
        fireEvent.click(screen.getAllByText(/Supprimer/i)[1]);

        // Vérifie qu'il ne reste plus qu'un champ de date
        expect(screen.getAllByLabelText(/Date/i).length).toBe(1);
        expect(screen.getByLabelText('Date 1').value).toBe('2023-01-01T10:00');
    });

    test('Soumission du formulaire et appel de onSave', async () => {
        const handleSave = jest.fn();

        await act(async () => {
            render(<EventForm onSave={handleSave} />);
        });

        // Simule la saisie dans les champs de formulaire.
        fireEvent.change(screen.getByLabelText(/Titre/i), {
            target: { value: 'New Event' },
        });
        fireEvent.change(screen.getByLabelText(/Description/i), {
            target: { value: 'Event Description' },
        });
        fireEvent.change(screen.getByLabelText('Date 1'), {
            target: { value: '2023-01-01T10:00' },
        });
        fireEvent.change(screen.getByLabelText(/Lieu/i), {
            target: { value: 'Event Location' },
        });
        fireEvent.change(screen.getByLabelText(/Prix/i), {
            target: { value: '50' },
        });
        fireEvent.change(screen.getByLabelText(/Limite/i), {
            target: { value: '100' },
        });

        global.fetch.mockResolvedValueOnce({
            json: () => Promise.resolve({
                id: 1, titre: 'New Event', description: 'Event Description', date: '2023-01-01T10:00', lieu: 'Event Location', prix: '50', maximum: '100', annulation: false, raison: ''
            }),
        });

        await act(async () => {
            fireEvent.click(screen.getByText('Enregistrer'));
        });

        expect(handleSave).toHaveBeenCalledWith({
            id: 1,
            titre: 'New Event',
            description: 'Event Description',
            date: '2023-01-01T10:00',
            lieu: 'Event Location',
            prix: '50',
            maximum: '100',
            annulation: false,
            raison: '',
        });
    });

    test('Récupération et pré-remplissage des données lorsque eventId est fourni', async () => {
        global.fetch.mockResolvedValueOnce({
            json: () => Promise.resolve({
                id: 1, titre: 'Existing Event', description: 'Existing Description', date: '2023-01-01T10:00', lieu: 'Existing Location', prix: '100', maximum: '200', annulation: true, raison: 'Existing Reason'
            }),
        });

        const handleSave = jest.fn();

        await act(async () => {
            render(<EventForm eventId={1} onSave={handleSave} />);
        });

        expect(await screen.findByDisplayValue('Existing Event')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Existing Description')).toBeInTheDocument();
        expect(screen.getByDisplayValue('2023-01-01T10:00')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Existing Location')).toBeInTheDocument();
        expect(screen.getByDisplayValue('100')).toBeInTheDocument();
        expect(screen.getByDisplayValue('200')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Existing Reason')).toBeInTheDocument();
        expect(screen.getByLabelText(/Annulé/i)).toBeChecked();
    });
});
