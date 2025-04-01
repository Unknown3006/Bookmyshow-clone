import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyBookings, cancelBooking } from '../services/api';
import styles from './MyBookings.module.css';
import { format } from 'date-fns';
import LoadingSpinner from '../components/common/LoadingSpinner';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cancellingId, setCancellingId] = useState(null);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await getMyBookings();
            setBookings(response.data.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch bookings. Please try again later.');
            console.error('Error fetching bookings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) {
            return;
        }

        try {
            setCancellingId(bookingId);
            await cancelBooking(bookingId);
            fetchBookings(); // Refresh the bookings list
        } catch (err) {
            setError('Failed to cancel booking. Please try again later.');
            console.error('Error cancelling booking:', err);
        } finally {
            setCancellingId(null);
        }
    };

    const formatDateTime = (dateTimeString) => {
        try {
            const date = new Date(dateTimeString);
            return format(date, 'PPP p'); // Format: Month day, year at time (e.g., March 14, 2023 at 1:30 PM)
        } catch (error) {
            console.error('Date formatting error:', error);
            return dateTimeString;
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>My Bookings</h1>
            
            {error && <div className={styles.error}>{error}</div>}
            
            {bookings.length === 0 ? (
                <div className={styles.noBookings}>
                    <p>You don't have any bookings yet.</p>
                    <Link to="/" className={styles.browseLink}>Browse Movies</Link>
                </div>
            ) : (
                <div className={styles.bookingsList}>
                    {bookings.map((booking) => (
                        <div key={booking._id} className={styles.bookingCard}>
                            <div className={styles.movieInfo}>
                                <h2>{booking.show.movie.title}</h2>
                                <p className={styles.theater}>{booking.show.theater.name}</p>
                                <p className={styles.showtime}>
                                    {formatDateTime(booking.show.startTime)}
                                </p>
                            </div>
                            
                            <div className={styles.bookingDetails}>
                                <p><strong>Seats:</strong> {booking.seats.join(', ')}</p>
                                <p><strong>Total Amount:</strong> ₹{booking.totalAmount}</p>
                                <p className={styles.bookingDate}>
                                    <strong>Booked on:</strong> {formatDateTime(booking.createdAt)}
                                </p>
                                <p className={styles.status} data-status={booking.status.toLowerCase()}>
                                    Status: {booking.status}
                                </p>
                            </div>
                            
                            <div className={styles.actions}>
                                {booking.status === 'CONFIRMED' && (
                                    <button 
                                        className={styles.cancelButton}
                                        onClick={() => handleCancelBooking(booking._id)}
                                        disabled={cancellingId === booking._id}
                                    >
                                        {cancellingId === booking._id ? 'Cancelling...' : 'Cancel Booking'}
                                    </button>
                                )}
                                <Link 
                                    to={`/bookings/${booking._id}`} 
                                    className={styles.viewButton}
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings; 