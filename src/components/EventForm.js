import React, { useState, useEffect } from 'react';

function EventForm({ eventId, onSave }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dates, setDates] = useState(['']);
    const [location, setLocation] = useState('');
    const [price, setPrice] = useState('');
    const [maximum, setMaximum] = useState('');
    const [cancelled, setCancelled] = useState(false);
    const [reason, setReason] = useState('');
    const [isHidden, setIsHidden] = useState(false);

    useEffect(() => {
        const userRole = sessionStorage.getItem('Role');
        if (userRole === "ROLE_USER" || !userRole) {
            setIsHidden(true);
        } else {
            setIsHidden(false);
            if (eventId) {
                fetch(`http://localhost:8000/api/evenement/${eventId}`)
                    .then(response => response.json())
                    .then(data => {
                        setTitle(data.titre);
                        setDescription(data.description);
                        setDates([data.date] || ['']);
                        setLocation(data.lieu);
                        setPrice(data.prix);
                        setMaximum(data.maximum);
                        setCancelled(data.annulation);
                        setReason(data.raison);
                    })
                    .catch(error => {
                        console.error('Erreur lors de la récupération des données:', error);
                    });
            }
        }
    }, [eventId]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const payload = { titre: title, description, date: dates[0], lieu: location, prix: price, maximum, annulation: cancelled, raison: reason };
        const method = eventId ? 'PUT' : 'POST';
        const url = eventId ? `http://localhost:8000/api/evenement/${eventId}/update` : 'http://localhost:8000/api/evenement/create';

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

    const handleDateChange = (index, value) => {
        const newDates = dates.slice();
        newDates[index] = value;
        setDates(newDates);
    };

    const addDateField = () => {
        setDates([...dates, '']);
    };

    const removeDateField = (index) => {
        const newDates = dates.slice();
        newDates.splice(index, 1);
        setDates(newDates);
    };

    if (isHidden) {
        return <div>Accès refusé</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="d-flex flex-column">
            <div className="mb-3">
                <label htmlFor="title" className="form-label">Titre</label>
                <input id="title" type="text" className="form-control" value={title}
                       onChange={e => setTitle(e.target.value)} required/>
            </div>
            <div className="mb-3">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea id="description" className="form-control" value={description}
                          onChange={e => setDescription(e.target.value)} required/>
            </div>
            <div className="mb-3">
                <label className="form-label">Dates</label>
                {dates.map((date, index) => (
                    <div key={index} className="d-flex align-items-center">
                        <label htmlFor={`date-${index}`} className="visually-hidden">Date {index + 1}</label>
                        <input
                            id={`date-${index}`}
                            type="datetime-local"
                            className="form-control"
                            value={date}
                            onChange={e => handleDateChange(index, e.target.value)}
                            required
                        />
                        {dates.length > 1 && (
                            <a type="button" className="btn btn-danger btn-sm ms-2"
                                    onClick={() => removeDateField(index)}>
                                Supprimer
                            </a>
                        )}
                    </div>
                ))}
                <a type="button" className="btn btn-secondary btn-sm mt-2" onClick={addDateField}>
                    Ajouter une date
                </a>
            </div>
            <div className="mb-3">
                <label htmlFor="location" className="form-label">Lieu</label>
                <input id="location" type="text" className="form-control" value={location}
                       onChange={e => setLocation(e.target.value)} required/>
            </div>
            <div className="mb-3">
                <label htmlFor="price" className="form-label">Prix</label>
                <input id="price" type="number" className="form-control" value={price}
                       onChange={e => setPrice(e.target.value)} required/>
            </div>
            <div className="mb-3">
                <label htmlFor="maximum" className="form-label">Limite</label>
                <input id="maximum" type="number" className="form-control" value={maximum}
                       onChange={e => setMaximum(e.target.value)} required/>
            </div>
            <div className="mb-3">
                <label htmlFor="cancelled" className="form-label mx-2">Annulé</label>
                <input id="cancelled" type="checkbox" className="form-check-input" checked={cancelled}
                       onChange={e => setCancelled(e.target.checked)}/>
            </div>
            {cancelled && (
                <div className="mb-3">
                    <label htmlFor="reason" className="form-label">Raison</label>
                    <textarea id="reason" className="form-control" value={reason}
                              onChange={e => setReason(e.target.value)} required/>
                </div>
            )}
            <button type="submit" className="btn btn-primary mb-2 text-center">Enregistrer</button>
        </form>
    );
}

export default EventForm;
