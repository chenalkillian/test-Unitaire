// src/components/Tickets.js
import React, { useState, useEffect } from 'react';
import TicketForm from './TicketForm';

function Tickets() {
    const [tickets, setTickets] = useState([]);
    const [selectedTicketId, setSelectedTicketId] = useState(null);

    useEffect(() => {
        // Remplacer par la route vers l'API
        fetch('/api/tickets')
            .then(response => response.json())
            .then(data => setTickets(data));
    }, []);

    const handleDelete = (id) => {
        // Remplacer par la route vers l'API
        fetch(`/api/tickets/${id}`, { method: 'DELETE' })
            .then(() => setTickets(tickets.filter(ticket => ticket.id !== id)));
    };

    const handleSave = (ticket) => {
        setSelectedTicketId(null);
        // Sert à réactualiser la liste des billets
        fetch('/api/tickets')
            .then(response => response.json())
            .then(data => setTickets(data));
    };

    return (
        <div>
            <h2>Gestion des Billets</h2>
            <table className="table table-striped my-4">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>ID de l'Événement</th>
                    <th>ID de l'Utilisateur</th>
                    <th>Quantité</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {tickets.map(ticket => (
                    <tr key={ticket.id}>
                        <td>{ticket.id}</td>
                        <td>{ticket.eventId}</td>
                        <td>{ticket.userId}</td>
                        <td>{ticket.quantity}</td>
                        <td>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(ticket.id)}>Supprimer</button>
                            <button className="btn btn-primary btn-sm" onClick={() => setSelectedTicketId(ticket.id)}>Modifier</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <h3 className={"text-center"}>{selectedTicketId ? 'Modifier' : 'Ajouter'} un Billet</h3>
            <TicketForm ticketId={selectedTicketId} onSave={handleSave} />
        </div>
    );
}

export default Tickets;
