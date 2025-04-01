import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format, parseISO, isPast } from 'date-fns';
import { getMyBookings, cancelBooking } from '../services/api';
import { useAuth } from '../context/AuthContext';
import styles from './MyBookings.module.css';

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'past'

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await getMyBookings();
        setBookings(response.data.data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load your bookings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      return;
    }

    try {
      setCancellingId(bookingId);
      await cancelBooking(bookingId);
      
      // Update bookings list
      setBookings(bookings.map(booking => 
        booking._id === bookingId 
          ? { ...booking, status: 'cancelled' } 
          : booking
      ));
    } catch (err) {
      console.error('Error cancelling booking:', err);
      alert('Failed to cancel booking. Please try again.');
    } finally {
      setCancellingId(null);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const showDate = parseISO(`${booking.show.showDate}T${booking.show.showTime}`);
    const isPastShow = isPast(showDate);

    if (filter === 'upcoming') return !isPastShow && booking.status !== 'cancelled';
    if (filter === 'past') return isPastShow || booking.status === 'cancelled';
    return true; // 'all'
  });

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading your bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <h3>Something went wrong</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  // Generate some mock data for demonstration
  const mockBookings = [
    {
      _id: 'b1',
      show: {
        _id: 's1',
        showDate: '2023-04-05',
        showTime: '18:30',
        screen: 'Audi 3',
        theater: {
          _id: 't1',
          name: 'PVR Cinemas',
          location: 'Phoenix Mall, Mumbai'
        },
        movie: {
          _id: 'm1',
          title: 'Avengers: Endgame',
          posterUrl: 'https://via.placeholder.com/150x225?text=Avengers'
        }
      },
      seats: ['A1', 'A2', 'A3'],
      amount: 1050,
      bookingDate: '2023-04-01T10:30:00Z',
      status: 'confirmed',
      paymentMethod: 'card'
    },
    {
      _id: 'b2',
      show: {
        _id: 's2',
        showDate: '2023-05-10',
        showTime: '21:15',
        screen: 'IMAX',
        theater: {
          _id: 't2',
          name: 'INOX',
          location: 'R City Mall, Ghatkopar'
        },
        movie: {
          _id: 'm2',
          title: 'Tenet',
          posterUrl: 'https://via.placeholder.com/150x225?text=Tenet'
        }
      },
      seats: ['J12', 'J13'],
      amount: 900,
      bookingDate: '2023-05-05T15:45:00Z',
      status: 'confirmed',
      paymentMethod: 'upi'
    },
    {
      _id: 'b3',
      show: {
        _id: 's3',
        showDate: '2023-03-15',
        showTime: '14:30',
        screen: 'Screen 2',
        theater: {
          _id: 't1',
          name: 'PVR Cinemas',
          location: 'Phoenix Mall, Mumbai'
        },
        movie: {
          _id: 'm3',
          title: 'The Batman',
          posterUrl: 'https://via.placeholder.com/150x225?text=Batman'
        }
      },
      seats: ['D5', 'D6', 'D7', 'D8'],
      amount: 1400,
      bookingDate: '2023-03-10T09:20:00Z',
      status: 'completed',
      paymentMethod: 'card'
    }
  ];

  const displayBookings = bookings.length > 0 ? filteredBookings : mockBookings;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>My Bookings</h1>
        <div className={styles.filters}>
          <button 
            className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`${styles.filterBtn} ${filter === 'upcoming' ? styles.active : ''}`}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming
          </button>
          <button 
            className={`${styles.filterBtn} ${filter === 'past' ? styles.active : ''}`}
            onClick={() => setFilter('past')}
          >
            Past
          </button>
        </div>
      </div>

      {displayBookings.length > 0 ? (
        <div className={styles.bookingsList}>
          {displayBookings.map(booking => {
            const showDate = parseISO(`${booking.show.showDate}T${booking.show.showTime}`);
            const isPastShow = isPast(showDate);
            const canCancel = !isPastShow && booking.status === 'confirmed';
            
            return (
              <div 
                key={booking._id} 
                className={`${styles.bookingCard} ${booking.status === 'cancelled' ? styles.cancelled : ''}`}
              >
                {booking.status === 'cancelled' && (
                  <div className={styles.cancelledBadge}>Cancelled</div>
                )}
                <div className={styles.cardLeft}>
                  <img 
                    src={booking.show.movie.posterUrl} 
                    alt={booking.show.movie.title}
                    className={styles.poster}
                  />
                </div>
                
                <div className={styles.cardMiddle}>
                  <h3>{booking.show.movie.title}</h3>
                  <p className={styles.theater}>
                    {booking.show.theater.name}, {booking.show.theater.location}
                  </p>
                  <p className={styles.showDetails}>
                    {format(parseISO(booking.show.showDate), 'dd MMM, yyyy')} • {booking.show.showTime} • {booking.show.screen}
                  </p>
                  <div className={styles.bookingDetails}>
                    <div className={styles.detail}>
                      <span className={styles.label}>Seats:</span>
                      <span className={styles.value}>{booking.seats.join(', ')}</span>
                    </div>
                    <div className={styles.detail}>
                      <span className={styles.label}>Amount:</span>
                      <span className={styles.value}>₹{booking.amount}</span>
                    </div>
                    <div className={styles.detail}>
                      <span className={styles.label}>Booking ID:</span>
                      <span className={styles.value}>{booking._id}</span>
                    </div>
                    <div className={styles.detail}>
                      <span className={styles.label}>Booked on:</span>
                      <span className={styles.value}>
                        {format(parseISO(booking.bookingDate), 'dd MMM, yyyy')} at {format(parseISO(booking.bookingDate), 'hh:mm a')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className={styles.cardRight}>
                  {canCancel && (
                    <button 
                      className={styles.cancelBtn}
                      onClick={() => handleCancelBooking(booking._id)}
                      disabled={cancellingId === booking._id}
                    >
                      {cancellingId === booking._id ? 'Cancelling...' : 'Cancel Booking'}
                    </button>
                  )}
                  
                  <a 
                    href={`#ticket-${booking._id}`} 
                    className={styles.viewTicketBtn}
                    onClick={(e) => {
                      e.preventDefault();
                      // In a real app, this would open a ticket modal or navigate to a ticket page
                      alert('Ticket functionality would be implemented here');
                    }}
                  >
                    View Ticket
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🎬</div>
          <h3>No bookings found</h3>
          <p>You haven't made any bookings yet.</p>
          <Link to="/" className={styles.browseBtn}>Browse Movies</Link>
        </div>
      )}
    </div>
  );
};

export default MyBookings; 