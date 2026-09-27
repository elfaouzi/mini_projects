import React, { useState, useEffect } from 'react';
import './Navbar.css';

export default function Navbar() {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const [showDropdown, setShowDropdown] = useState(false);
  const [reservations, setReservations] = useState<any[]>([]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  // Fetch reservations for the current user (filtering by clientEmail)
  const fetchReservations = async () => {
    try {
      const response = await fetch(`http://localhost:3001/reservations?clientEmail=${userData.email}`);
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  // Toggle dropdown and fetch reservations if opening
  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  // When the dropdown is shown, fetch reservations.
  useEffect(() => {
    if (showDropdown) {
      fetchReservations();
    }
  }, [showDropdown]);

  // Cancel (delete) a reservation from the JSON server and update state
  const handleCancelReservation = async (
    reservationId: string,
    eventId: string,
    ticketsReserved: number
  ) => {
    try {
      // Delete the reservation
      await fetch(`http://localhost:3001/reservations/${reservationId}`, {
        method: 'DELETE',
      });
  
      // Get the event data
      const eventResponse = await fetch(`http://localhost:3001/events/${eventId}`);
      const eventData = await eventResponse.json();
  
      // Update the ticket limit by adding back the reserved tickets
      const updatedEvent = {
        ...eventData,
        ticketLimit: eventData.ticketLimit + ticketsReserved,
      };
  
      // Send the updated event data back to the server
      await fetch(`http://localhost:3001/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEvent),
      });
  
      // Update local reservations state by filtering out the deleted reservation
      setReservations((prev) => prev.filter((r) => r.id !== reservationId));
      window.location.reload();
    } catch (error) {
      console.error("Error cancelling reservation:", error);
    }
  };
  

  return (
    <div className="navbar-container">
      <nav>
        <div>
          <span className="logo">Eventify</span>
        </div>
        <div>
        </div>
        <div className="nav-links-container">
          {
            !isAdmin && (
              <div className="dropdown-container">
                <i
                  className="fa-solid fa-cart-shopping icon"
                  onClick={toggleDropdown}
                ></i>
                {showDropdown && (
                  <div className="dropdown-menu">
                    {reservations.length > 0 ? (
                      reservations.map((reservation) => (
                        <div key={reservation.id} className="dropdown-item">
                          <div className="dropdown-item-info">
                            <p>
                              {reservation.ticketsReserved} ticket(s) 
                                for {reservation.eventsName}
                            </p>
                          </div>
                          <button
                            onClick={() => handleCancelReservation(reservation.id, reservation.eventId, reservation.ticketsReserved)}
                          >
                            Cancel
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="no-reservations">No reservations found</p>
                    )}
                  </div>
                )}
              </div>
            )
          }
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>
    </div>
  );
}
