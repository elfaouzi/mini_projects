import { useState, useEffect } from "react";
import axios from "axios";
import "./DashboardPage.css";
import React from "react";

interface Reservation {
  id: string;
  eventId: string;
  ticketsReserved: number;
  reservationDate: string;
  clientName: string;
  clientEmail: string;
}

interface Event {
  id: string;
  title: string;
  price: number;
  date: string;
  location: string;
  image: string;
  ticketLimit: number;
  description: string;
  createdAt: string;

}

interface ReservationProps {
  reservations: Reservation[];
  events: Event[];
}

const ReservationList: React.FC<ReservationProps> = ({ reservations, events }) => {
  // Helper function to get event name by eventId
  const getEventDetails = (eventId: string) => {
    return events.find((event) => event.id === eventId);
  };

  // Calculate total revenue for all reservations
  const totalRevenue = reservations.reduce((total, reservation) => {
    const event = getEventDetails(reservation.eventId);
    if (event) {
      total += event.price * reservation.ticketsReserved;
    }
    return total;
  }, 0);

  return (
    <div className="reservation-dashboard">
      <div className="reservation-header">
        <h2>Reservations List</h2>
        <p>Total Revenue: ${totalRevenue.toFixed(2)}</p>
      </div>
      <div className="reservation-list">
        {reservations.length > 0 ? (
          reservations.map((reservation) => {
            const event = getEventDetails(reservation.eventId);
            return event ? (
              <div key={reservation.id} className="reservation-card">
                <div className="reservation-details">
                  <h3>{event.title}</h3>
                  <p>
                    <strong>Client:</strong> {reservation.clientName} <br />
                    <strong>Email:</strong> {reservation.clientEmail}
                  </p>
                  <p>
                    <strong>Reserved Tickets:</strong> {reservation.ticketsReserved}
                  </p>
                  
                  <p>
                    <strong>Total Cost:</strong> $
                    {(event.price * reservation.ticketsReserved).toFixed(2)}
                  </p>
                </div>
              </div>
            ) : null;
          })
        ) : (
          <p className="no-reservations">No reservations available</p>
        )}
      </div>
    </div>
  );
};

export default ReservationList;


const API_URL = "http://localhost:3001/events";
interface EventsListProps {
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
}

const EventsList = ({ events, setEvents }: EventsListProps) => {

  const handleDeleteEvent = async (id: string) => {
    try {
      // Step 1: Fetch reservations for this event
      const { data: reservations } = await axios.get(`http://localhost:3001/reservations?eventId=${id}`);
      console.log(reservations); 
      // Step 2: Delete all reservations concurrently
      if(reservations.length > 0) {
      await Promise.all(
        reservations.map((reservation: { id: string }) =>
          axios.delete(`http://localhost:3001/reservations/${reservation.id}`)
        )
      );
      }
      
      // Step 3: Delete the event itself
      await axios.delete(`${API_URL}/${id}`);
  
      // Step 4: Update state to remove the deleted event
      setEvents(events.filter(event => event.id !== id));
    } catch (error) {
      console.error("Error deleting event and related reservations:", error);
    }
  };
  

  

  return (
    <div className="dashboard-event-list">
      {events.length > 0 ? (
        events.map((event) => (
          <div key={event.id} className="dashboard-event-card">
            <div className="dashboard-event-image-container">
              <img src={event.image} alt={event.title} className="dashboard-event-image" />
            </div>
            <div className="dashboard-event-info">
              <h3 className="dashboard-event-title">{event.title}</h3>
              <p className="dashboard-event-details">
                <span>{event.date}</span> - <span>{event.location}</span>
              </p>
              <div className="dashboard-event-tickets">
                <p><strong>Tickets:</strong> {event.ticketLimit}</p>
                <p><strong>Price:</strong> ${event.price}</p>
              </div>
              <p className="dashboard-event-description">{event.description}</p>
              <button className="dashboard-delete-btn" onClick={() => handleDeleteEvent(event.id)}>Delete</button>
            </div>
          </div>
        ))
      ) : (
        <p className="dashboard-no-events">No events available</p>
      )}
    </div>
  );
};


  

export const DashbordPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showReservations, setShowReservations] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [newEvent, setNewEvent] = useState<Omit<Event, "id">>({
    title: "",
    date: "",
    location: "",
    image: "",
    ticketLimit: 0,
    price: 0,
    description: "",
    createdAt: '',
  });

  // Base URL for json-server
  

  // Fetch events from db.json
  useEffect(() => {
    axios.get(API_URL)
      .then(response => {response.data.sort((a: Event, b: Event) => new Date(a.date).getTime() - new Date(b.date).getTime()); setEvents(response.data);})
      .catch(error => console.error("Error fetching events:", error));
    axios.get("http://localhost:3001/reservations")
      .then(response =>{response.data.sort((a: Reservation, b: Reservation) => new Date(a.reservationDate).getTime() - new Date(b.reservationDate).getTime()); setReservations(response.data);})
      .catch(error => console.error("Error fetching reservations:", error));
  }, []);

  // Add event to db.json
  const handleAddEvent = () => {
    if (newEvent.title && newEvent.date && newEvent.location && newEvent.image) {
      setEvents([...events, {
        ...newEvent, createdAt: new Date().toISOString(),
        id: ""
      }]);
      axios.post(API_URL, newEvent)
        .then(response => {
          setEvents([...events, response.data]);
          setNewEvent({ title: "", date: "", location: "", image: "", ticketLimit: 0, price: 0, description: "" , createdAt: ''});
          setShowModal(false);
        })
        .catch(error => console.error("Error adding event:", error));
    }
  };

  

  // Convert uploaded image to Base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setNewEvent(prev => ({ ...prev, image: reader.result as string }));
      };
    }
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setNewEvent({ title: "", date: "", location: "", image: "", ticketLimit: 0, price: 0, description: "" , createdAt: ''});
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Admin Dashboard</h1>
<div className="dashboard-buttons">
<button onClick={() => setShowModal(true)} className="open-popup-btn">
  Add Event
</button>
      <button onClick={() => setShowReservations(!showReservations)} className="open-popup-btn">
  {showReservations ? "Show Events" : "Show Reservations"}
</button>
</div>
     

{showModal && (
  <div className="popup-overlay">
    <div className="event-form-popup">
      <div className="event-form">
        <input 
          type="text" 
          placeholder="Event Title" 
          value={newEvent.title} 
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} 
          className="input-field"
        />
        <div className="input-row">
        <input 
          type="date" 
          value={newEvent.date} 
          onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} 
          className="input-field"
        />
         <input 
            type="text" 
            placeholder="Location" 
            value={newEvent.location} 
            onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} 
            className="input-field"
          />
          </div>
       
        <div className="input-row">
         
          <input 
            type="text" 
            pattern="[0-9]*"
            placeholder="Ticket Limit" 
            value={newEvent.ticketLimit === 0 ? "" : newEvent.ticketLimit} 
            onChange={(e) => {e.target.value = e.target.value.replace(/[^0-9]/g, ''); setNewEvent({ ...newEvent, ticketLimit: Number(e.target.value) })}}
            className="input-field"
          />
          <input 
            type="text" 
            pattern="[0-9]*"
            placeholder="Price ($)" 
            value={newEvent.price === 0 ? "" : newEvent.price} 
            onChange={(e) => {e.target.value = e.target.value.replace(/[^0-9]/g, ''); setNewEvent({ ...newEvent, price: Number(e.target.value) })}}
            className="input-field"
          />
        </div>

        <textarea 
          placeholder="Description" 
          value={newEvent.description} 
          onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} 
          className="textarea-field"
        />
        <div className="file-upload-container">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload} 
            className="file-upload"
          />
          {newEvent.image && <img src={newEvent.image} alt="Preview" className="image-preview" />}
        </div>
        <div className="form-buttons">
          <button onClick={handleAddEvent} className="submit-btn">Add Event</button>
          <button onClick={() => handleCloseModal()} className="close-popup-btn">Close</button>
        </div>
      </div>
    </div>
  </div>
)}

{showReservations ? <ReservationList reservations={reservations} events={events} />
:<EventsList events={events} setEvents={setEvents} />}



    </div>
  );
};
