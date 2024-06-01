// src/components/Calendar.js
import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/fr';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

moment.locale('fr');

const messages = {
    allDay: 'Toute la journée',
    previous: 'Précédent',
    next: 'Suivant',
    today: "Aujourd'hui",
    month: 'Mois',
    week: 'Semaine',
    day: 'Jour',
    agenda: 'Agenda',
    date: 'Date',
    time: 'Heure',
    event: 'Événement',
    noEventsInRange: 'Aucun événement dans cette plage de dates.',
    showMore: total => `+ ${total} plus`,
};

const MyCalendar = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetch('/api/events')
            .then(response => response.json())
            .then(data => {
                const formattedEvents = data.map(event => ({
                    id: event.id,
                    title: event.title,
                    start: new Date(event.dates[0]),
                    end: new Date(event.dates[event.dates.length - 1]),
                    allDay: true
                }));
                setEvents(formattedEvents);
            });
    }, []);

    return (
        <div className="container my-4 col-md-12">
            <h2 className="text-center my-4">Calendrier des Événements</h2>
            <div className="col-md-8">
                <div className="calendar" style={{ height: '500px', width: '100%' }}>
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        messages={messages}
                        style={{ height: '100%', width: '100%' }}
                    />
                </div>
            </div>
            <div className="event-list">
                <h3 className="text-center my-4">Liste des Événements</h3>
                <ul>
                    {events.map(event => (
                        <li key={event.id} data-testid={`event-${event.id}`}>
                            {event.title}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default MyCalendar;
