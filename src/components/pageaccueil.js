import React, { useState, useEffect } from 'react';
import './pageaccueil.css';
import jsPDF from 'jspdf';

function PageAccueil() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Effectuer une requête pour récupérer les événements
    fetch('http://localhost:8000/api/evenement')
      .then(response => response.json())
      .then(data => setEvents(data))
      .catch(error => console.error('Erreur lors de la récupération des événements :', error));
  }, []);

  const toggleDetails = (eventIndex) => {
    const updatedEvents = events.map((event, index) => {
      if (index === eventIndex) {
        return { ...event, showDetails: !event.showDetails };
      }
      return event;
    });
    setEvents(updatedEvents);
  };

  const incrementTickets = (eventIndex) => {
    setEvents(prevEvents => {
      return prevEvents.map((event, index) => {
        if (index === eventIndex) {
          return { ...event, tickets: event.tickets + 1 };
        }
        return event;
      });
    });
  };
  
  const decrementTickets = (eventIndex) => {
    setEvents(prevEvents => {
      return prevEvents.map((event, index) => {
        if (index === eventIndex) {
          return { ...event, tickets: event.tickets > 0 ? event.tickets - 1 : 0 };
        }
        return event;
      });
    });
  };
  
  const [isHidden, setIsHidden] = useState(false);


  const generateTicketPDF = (eventName, eventDate, eventLocation, eventDescription, eventTime, eventPrice, numTickets, eventId) => {
    
    const userRole = sessionStorage.getItem('Role');
    if (userRole) {
       
    const doc = new jsPDF();
    const formattedDate = new Date(eventDate).toLocaleDateString('fr-FR');
    const content = `
      Événement: ${eventName}
      Date: ${formattedDate} 
      Lieu: ${eventLocation}
      Description: ${eventDescription}
      Prix: ${eventPrice} €
      Nombre de billets: ${numTickets}
      Total: ${eventPrice * numTickets} €
    `;
    doc.text(content, 10, 10);
    doc.save('billet_evenement.pdf');
  
    // Effectuer la requête POST
    fetch('http://127.0.0.1:8000/api/billet/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        evenement_id_id: eventId,
        utilisateur_id_id: 1, // À adapter selon votre application
        quantite: numTickets
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur lors de la création du billet');
      }
      console.log('Billet créé avec succès');
    })
    .catch(error => {
      console.error('Erreur lors de la création du billet :', error);
    });
  
    } else {
        alert('connecter-vous d\' abord');
      };
    }
    
      
  return (
    <div className="page-accueil">
      <header>
        <h1>Bienvenue sur le site de la Mairie</h1>
      </header>
      <main>
        <section className="evenements">
          <h2>Événements à venir</h2>
          <div className="cartes-evenement">
            {events.length > 0 ? (
              events.map((event, index) => (
                <div key={event.id} className="carte-evenement">
                  <h3>{event.titre}</h3>
                  <p>Date : {new Date(event.date).toLocaleDateString()}</p>
                  <p>Lieu : {event.lieu}</p>
                  {event.annulation ? (
      <p>Événement annulé</p>
    ) : null}

                  <p>Plus d'infos : <a href="#" onClick={() => toggleDetails(index)}>Détails</a></p>
                  {event.showDetails && (
                    <div className="details">
                      <p>{event.description}</p>
                      <p>Prix : {event.prix} €</p>
                    </div>
                  )}
                  <div className="reservation">
                    
                    <button onClick={() => incrementTickets(index)}>Ajouter un billet</button>
                    <button onClick={() => decrementTickets(index)}>Retirer un billet</button>
                    <p>Nombre de billets : {event.tickets || 0}</p>
                    <p>Total : {event.tickets && event.prix ? event.tickets * event.prix : 0} €</p>
                    <button onClick={() => generateTicketPDF(event.titre, event.date, event.lieu, event.description, event.time, event.prix, event.tickets, event.id)}>Générer billet PDF</button>
                  </div>
                </div>
              ))
            ) : (
              <p>Chargement en cours...</p>
            )}
          </div>
        </section>
        <section className="apropos">
          <h2>À propos de nous</h2>
          <p>Bienvenue sur le site officiel de la Mairie, votre source d'informations sur les événements sociaux et culturels de notre ville.</p>
          <p>Explorez notre calendrier d'événements pour découvrir ce qui se passe près de chez vous et restez connecté avec la vie communautaire.</p>
          <p>N'hésitez pas à nous contacter pour toute question ou suggestion. Nous sommes là pour vous servir !</p>
        </section>
      </main>
      <footer>
        <p>&copy; {new Date().getFullYear()} Mairie de Paris</p>
      </footer>
    </div>
  );
  
}

export default PageAccueil;
