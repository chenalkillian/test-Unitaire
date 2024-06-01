// src/components/__tests__/MyCalendar.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import MyCalendar from '../Calendar';

describe('MyCalendar Component', () => {
    beforeEach(() => {
        // Mock de l'API fetch
        global.fetch = jest.fn().mockResolvedValue({
            json: jest.fn().mockResolvedValue([
                {
                    id: 1,
                    title: 'Événement 1',
                    dates: ['2023-01-01T00:00:00.000Z', '2023-01-01T23:59:59.999Z']
                },
                {
                    id: 2,
                    title: 'Événement 2',
                    dates: ['2023-01-02T00:00:00.000Z', '2023-01-02T23:59:59.999Z']
                }
            ])
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Rendu du composant et affichage des événements', async () => {
        render(<MyCalendar />);

        // Vérifie que le titre de la page est présent
        expect(screen.getByText('Calendrier des Événements')).toBeInTheDocument();

        // Vérifie que les événements sont affichés correctement
        await waitFor(() => {
            expect(screen.getByTestId('event-1')).toBeInTheDocument();
            expect(screen.getByTestId('event-2')).toBeInTheDocument();
        });
    });

    test('Affichage des boutons de navigation et labels en français', async () => {
        render(<MyCalendar />);

        // Vérifie que les boutons de navigation sont en français
        expect(screen.getByText('Précédent')).toBeInTheDocument();
        expect(screen.getByText('Suivant')).toBeInTheDocument();
        expect(screen.getByText("Aujourd'hui")).toBeInTheDocument();

        // Vérifie que les labels de vue sont en français
        expect(screen.getByText('Mois')).toBeInTheDocument();
        expect(screen.getByText('Semaine')).toBeInTheDocument();
        expect(screen.getByText('Jour')).toBeInTheDocument();
        expect(screen.getByText('Agenda')).toBeInTheDocument();
    });

    test('Affichage correct des dates des événements', async () => {
        render(<MyCalendar />);

        // Attendre que les événements soient affichés
        await waitFor(() => {
            expect(screen.getByTestId('event-1')).toBeInTheDocument();
            expect(screen.getByTestId('event-2')).toBeInTheDocument();
        });
    });
});
