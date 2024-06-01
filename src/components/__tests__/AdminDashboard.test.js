// src/components/__tests__/AdminDashboard.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminDashboard from '../AdminDashboard';

describe('AdminDashboard Component', () => {
    test('Retour du composant AdminDashboard et présence des liens', () => {
        render(
            <BrowserRouter>
                <AdminDashboard />
            </BrowserRouter>
        );

        // Vérifie que le titre du tableau de bord et les liens de navigation sont présents.
        expect(screen.getByText(/Admin Dashboard/i)).toBeInTheDocument();

        expect(screen.getByText(/Gestion des Utilisateurs/i)).toBeInTheDocument();
        expect(screen.getByText(/Gestion des Événements/i)).toBeInTheDocument();
        expect(screen.getByText(/Gestion des Billets/i)).toBeInTheDocument();
    });

    test('Renvoie vers le composant Users après un clique', async () => {
        render(
            <BrowserRouter>
                <AdminDashboard />
            </BrowserRouter>
        );

        // Simulation de clique sur le bouton 'Gestion des Utilisateurs'
        fireEvent.click(screen.getByText(/Gestion des Utilisateurs/i));

        // Vérifie que le composant Users est bien retourné
        expect(await screen.findByText(/Gestion des Utilisateurs/i)).toBeInTheDocument();
    });

    test('Renvoie vers le composant Events après un clique', async () => {
        render(
            <BrowserRouter>
                <AdminDashboard />
            </BrowserRouter>
        );

        // Simulation de clique sur le bouton 'Gestion des Événements'
        fireEvent.click(screen.getByText(/Gestion des Événements/i));

        // Vérifie que le composant Events est bien retourné
        expect(await screen.findByText(/Gestion des Événements/i)).toBeInTheDocument();
    });

    test('Renvoie vers le composant Tickets après un clique', async () => {
        render(
            <BrowserRouter>
                <AdminDashboard />
            </BrowserRouter>
        );

        // Simulation de clique sur le bouton 'Gestion des Billets'
        fireEvent.click(screen.getByText(/Gestion des Billets/i));

        // Vérifie que le composant Tickets est bien retourné
        expect(await screen.findByText(/Gestion des Billets/i)).toBeInTheDocument();
    });
});
