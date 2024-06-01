import React, { useState, useEffect } from 'react';
import EventForm from './EventForm';

function Events() {
    const [events, setEvents] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [showCancelForm, setShowCancelForm] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [eventToCancel, setEventToCancel] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8000/api/evenement/')
            .then(response => response.json())
            .then(data => {
                const eventsWithDates = data.map(event => ({
                    ...event,
                    date: event.date || '',
                }));
                setEvents(eventsWithDates);
            });
    }, []);

    const handleDelete = (id) => {
        fetch(`http://localhost:8000/api/evenement/${id}/delete`, { method: 'DELETE' })
            .then(() => setEvents(events.filter(event => event.id !== id)));
    };

    const handleSave = (event) => {
        setSelectedEventId(null);
        fetch('http://localhost:8000/api/evenement')
            .then(response => response.json())
            .then(data => {
                const eventsWithDates = data.map(event => ({
                    ...event,
                    date: event.date || '',
                }));
                setEvents(eventsWithDates);
            });
    };

    const handleCancel = (id) => {
        setEventToCancel(id);
        setShowCancelForm(true);
    };

    const handleUncancel = (id) => {
        fetch(`http://localhost:8000/api/evenement/${id}/desannuler`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                setEvents(events.map(event => (event.id === id ? data : event)));
            });
    };

    const submitCancelForm = () => {
        fetch(`http://localhost:8000/api/evenement/${eventToCancel}/annuler`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reason: cancelReason }),
        })
            .then(response => response.json())
            .then(data => {
                setEvents(events.map(event => (event.id === eventToCancel ? data : event)));
                setShowCancelForm(false);
                setCancelReason('');
                setEventToCancel(null);
            });
    };

    return (
        <div>
            <h2>Gestion des Événements</h2>
            <table className="table table-striped my-4">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Titre</th>
                    <th>Date</th>
                    <th>Annulé</th>
                    <th>Raison</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {events.map(event => {
                    const formattedDate = new Date(event.date).toLocaleDateString('fr-FR');
                    return (
                        <tr key={event.id}>
                            <td>{event.id}</td>
                            <td>{event.titre}</td>
                            <td>{formattedDate}</td>
                            <td>{event.annulation ? 'Oui' : 'Non'}</td>
                            <td>{event.raison}</td>
                            <td>
                                <a className="btn btn-danger btn-sm"
                                   onClick={() => handleDelete(event.id)}>Supprimer</a>
                                <a className="btn btn-primary btn-sm mx-2"
                                   onClick={() => setSelectedEventId(event.id)}>Modifier</a>
                                <a className="btn btn-warning btn-sm" onClick={() => handleCancel(event.id)}>Annuler</a>
                                {event.annulation && (
                                    <a className="btn btn-success btn-sm mx-2" onClick={() => handleUncancel(event.id)}>Confirmer</a>
                                )}
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
            <div className={"d-flex col-md-12 justify-content-center gap-4"}>
                <div className={"col-md-8"}>
                    <h3 className="text-center">{selectedEventId ? 'Modifier' : 'Ajouter'} un Événement</h3>
                    <EventForm eventId={selectedEventId} onSave={handleSave} />
                </div>
                <div className={"col-md-4"}>
                    {showCancelForm && (
                        <div className={"d-flex flex-column my-4"}>
                            <h4>Annuler l'Événement</h4>
                            <div className="mb-3">
                                <label htmlFor="cancelReason" className="form-label">Raison de l'annulation</label>
                                <textarea
                                    id="cancelReason"
                                    className="form-control"
                                    value={cancelReason}
                                    onChange={e => setCancelReason(e.target.value)}
                                />
                            </div>
                            <a className="btn btn-primary" onClick={submitCancelForm}>Annuler l'Événement</a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Events;
