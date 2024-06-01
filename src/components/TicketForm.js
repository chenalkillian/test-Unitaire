// src/components/TicketForm.js
import React, { useState, useEffect } from 'react';

function TicketForm({ ticketId, onSave }) {
    const [eventId, setEventId] = useState('');
    const [userId, setUserId] = useState('');
    const [quantity, setQuantity] = useState('');

    useEffect(() => {
        if (ticketId) {
            // Remplacer par la route vers l'API
            fetch(`/api/tickets/${ticketId}`)
                .then(response => response.json())
                .then(data => {
                    setEventId(data.eventId);
                    setUserId(data.userId);
                    setQuantity(data.quantity);
                });
        }
    }, [ticketId]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const payload = { eventId, userId, quantity };
        const method = ticketId ? 'PUT' : 'POST';
        const url = ticketId ? `/api/tickets/${ticketId}` : '/api/tickets';

        // Remplacer par la route vers l'API
        fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then(response => response.json())
            .then(data => {
                onSave(data);
            });
    };

    return (
        <form onSubmit={handleSubmit} className={"d-flex flex-column align-items-center"}>
            <div className="mb-3 col-md-4">
                <label className="form-label">ID de l'Événement</label>
                <input type="text" className="form-control" value={eventId} onChange={e => setEventId(e.target.value)} required />
            </div>
            <div className="mb-3 col-md-4">
                <label className="form-label">ID de l'Utilisateur</label>
                <input type="text" className="form-control" value={userId} onChange={e => setUserId(e.target.value)} required />
            </div>
            <div className="mb-3 col-md-4">
                <label className="form-label">Quantité</label>
                <input type="number" className="form-control" value={quantity} onChange={e => setQuantity(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary mb-2">Enregistrer</button>
        </form>
    );
}

export default TicketForm;
