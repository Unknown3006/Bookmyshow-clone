import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import { getShowById } from '../services/api';
import SeatSelector from '../components/booking/SeatSelector';
import styles from './ShowSelection.module.css';

const ShowSelection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  
  useEffect(() => {
    const fetchShow = async () => {
      try {
        setLoading(true);
        const response = await getShowById(id);
        setShow(response.data.data);
      } catch (err) {
        console.error('Error fetching show:', err);
        setError('Failed to load show details');
      } finally {
        setLoading(false);
      }
    };

    fetchShow();
  }, [id]);

  const handleSeatSelection = (seats) => {
    setSelectedSeats(seats);
  };

  const handleProceedToBooking = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat to continue.');
      return;
    }
    
    // Store selected seats in sessionStorage
    sessionStorage.setItem('selectedSeats', JSON.stringify(selectedSeats));
    sessionStorage.setItem('showId', id);
    
    navigate(`/booking/${id}`);
  };

  // Generate available dates (next 7 days)
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(new Date(), i);
    return {
      value: format(date, 'yyyy-MM-dd'),
      display: format(date, 'EEE, MMM d'),
      isToday: i === 0
    };
  });

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading show details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <h3>Something went wrong</h3>
        <p>{error}</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  // Mock data for demonstration
  const mockShow = {
    _id: id,
    movie: {
      _id: '123',
      title: 'Avengers: Endgame',
      posterUrl: 'https://via.placeholder.com/300x450?text=Avengers+Endgame',
      duration: 180,
      language: 'English',
      certification: 'U/A'
    },
    theater: {
      _id: '456',
      name: 'PVR Cinemas',
      location: 'Phoenix Mall, Mumbai'
    },
    showTime: '6:30 PM',
    showDate: '2023-03-31',
    price: {
      premium: 350,
      standard: 250
    }
  };

  const showData = show || mockShow;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.movieInfo}>
          <h1>{showData.movie.title}</h1>
          <p className={styles.details}>
            {showData.movie.certification} • {showData.movie.language} • {showData.movie.duration} mins
          </p>
        </div>
        <div className={styles.theaterInfo}>
          <h2>{showData.theater.name}</h2>
          <p>{showData.theater.location}</p>
          <p className={styles.showTime}>
            {format(new Date(showData.showDate), 'dd MMM, yyyy')} • {showData.showTime}
          </p>
        </div>
      </div>

      <div className={styles.dateSelector}>
        {dates.map((date) => (
          <button 
            key={date.value}
            className={`${styles.dateButton} ${date.value === showData.showDate ? styles.active : ''}`}
          >
            <div className={styles.day}>{date.display.split(',')[0]}</div>
            <div className={styles.date}>
              {date.display.split(',')[1]}
              {date.isToday && <span className={styles.today}>Today</span>}
            </div>
          </button>
        ))}
      </div>

      <SeatSelector 
        showData={showData} 
        selectedSeats={selectedSeats}
        onSeatSelect={handleSeatSelection}
      />

      <div className={styles.actionBar}>
        <div className={styles.summary}>
          <div className={styles.seatsSelected}>
            {selectedSeats.length > 0 ? (
              <>
                <span className={styles.count}>{selectedSeats.length}</span> 
                <span>
                  {selectedSeats.length === 1 ? 'Seat' : 'Seats'} Selected:
                </span>
                <span className={styles.seatsList}>
                  {selectedSeats.map(seat => seat.label).join(', ')}
                </span>
              </>
            ) : (
              'No seats selected'
            )}
          </div>
          <div className={styles.amount}>
            Total: <span>₹{selectedSeats.reduce((sum, seat) => sum + seat.price, 0)}</span>
          </div>
        </div>
        <button 
          className={styles.proceedButton}
          disabled={selectedSeats.length === 0}
          onClick={handleProceedToBooking}
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default ShowSelection; 