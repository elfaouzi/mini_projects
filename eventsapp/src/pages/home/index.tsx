import { useState, useEffect } from "react";
import axios from "axios";
import './HomePage.css';

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  image: string;
  ticketLimit: number;
  price: number;
  description: string;
}

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [numTickets, setNumTickets] = useState(1);

  useEffect(() => {
    axios.get("http://localhost:3001/events")
      .then(response => {response.data.sort((a: Event, b: Event) => new Date(b.date).getDate() - new Date(a.date).getDate()); setEvents(response.data);})
      .catch(error => console.error("Error fetching events:", error));
  }, []);

  const handleOpenModal = (event: Event) => {
    setSelectedEvent(event);
    setNumTickets(1);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  const handleReserve = async () => {
    if (selectedEvent && numTickets <= selectedEvent.ticketLimit) {
      // 1. Stock the reservation in JSON Server
      const reservation = {
        eventId: selectedEvent.id,
        ticketsReserved: numTickets,
        reservationDate: new Date().toISOString(),
        eventsName : selectedEvent.title,
        clientName : JSON.parse(localStorage.getItem("userData") || "{}").name,
        clientEmail : JSON.parse(localStorage.getItem("userData") || "{}").email
      };
  
      try {
        // Send the reservation data to your JSON Server
        const reservationResponse = await fetch('http://localhost:3001/reservations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reservation),
        });
  
        if (!reservationResponse.ok) {
          throw new Error('Failed to create reservation');
        }
  
        // 2. Update the event's ticket limit
        const updatedEvent = {
          ...selectedEvent,
          ticketLimit: selectedEvent.ticketLimit - numTickets,
        };
  
        // Send the updated event data to JSON Server
        const eventResponse = await fetch(`http://localhost:3001/events/${selectedEvent.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedEvent),
        });
  
        if (!eventResponse.ok) {
          throw new Error('Failed to update event');
        }
  
        // 3. Update the local state with the new ticket limit
        setEvents(prevEvents =>
          prevEvents.map(event =>
            event.id === selectedEvent.id ? updatedEvent : event
          )
        );
  
        // 4. Clear the selected event
        setSelectedEvent(null);
      } catch (error) {
        console.error('Error during reservation process:', error);
        alert('There was an issue with your reservation.');
      }
    } else {
      alert('Not enough tickets available for the reservation.');
    }
  };
  

  return (
    <div className="event-section">
      <h1 className="event-title">Discover Amazing Events</h1>
      <input
        type="text"
        placeholder="Search events..."
        className="event-search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="event-grid">
        {events.filter(event =>
          event.title.toLowerCase().includes(search.toLowerCase())
        ).map(event => (
          <div key={event.id} className="event-card">
            <img src={event.image} alt={event.title} className="event-image" />
            <div className="event-info">
              <h3>{event.title}</h3>
              <p>{event.date} / {event.location}</p>
              <p><strong>Tickets Left:</strong> {event.ticketLimit}</p>
              <p><strong>Price:</strong> ${event.price}</p>
              <p>{event.description}</p>
              <button
                className="reserve-btn"
                onClick={() => handleOpenModal(event)}
                disabled={event.ticketLimit === 0}
              >Reserve Now</button>
            </div>
          </div>
        ))}
      </div>

      {selectedEvent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Reserve Tickets for {selectedEvent.title}</h2>
            <p>Price per Ticket: ${selectedEvent.price}</p>
            <input
              type="number"
              min="1"
              max={selectedEvent.ticketLimit}
              value={numTickets}
              onChange={(e) => setNumTickets(Math.min(parseInt(e.target.value, 10), selectedEvent.ticketLimit))}
            />
            <p>Total Price: ${selectedEvent.price * numTickets}</p>
            <button onClick={handleReserve} className="confirm-btn">Confirm</button>
            <button onClick={handleCloseModal} className="cancel-btn">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}