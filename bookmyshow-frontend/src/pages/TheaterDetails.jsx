import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import { getTheaterById, getShowsByTheater } from '../services/api';
import MovieCard from '../components/common/MovieCard';
import styles from './TheaterDetails.module.css';

const TheaterDetails = () => {
  const { id } = useParams();
  const [theater, setTheater] = useState(null);
  const [shows, setShows] = useState([]);
  const [moviesByDate, setMoviesByDate] = useState({});
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Generate dates for next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(new Date(), i);
    return {
      value: format(date, 'yyyy-MM-dd'),
      display: format(date, 'EEE, MMM d'),
      isToday: i === 0
    };
  });

  useEffect(() => {
    const fetchTheaterData = async () => {
      try {
        setLoading(true);
        
        // Fetch theater details
        const theaterResponse = await getTheaterById(id);
        setTheater(theaterResponse.data.data);
        
        // Fetch shows for selected date
        const showsResponse = await getShowsByTheater(id, selectedDate);
        setShows(showsResponse.data.data);
        
        // Group shows by movie
        const groupedByMovie = {};
        showsResponse.data.data.forEach(show => {
          const movieId = show.movie._id;
          if (!groupedByMovie[movieId]) {
            groupedByMovie[movieId] = {
              movie: show.movie,
              shows: []
            };
          }
          groupedByMovie[movieId].shows.push(show);
        });
        
        setMoviesByDate(groupedByMovie);
      } catch (err) {
        console.error("Error fetching theater data:", err);
        setError("Failed to load theater details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTheaterData();
  }, [id, selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading theater details...</p>
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

  // Mock data for demonstration
  const mockTheater = {
    _id: id,
    name: 'PVR Cinemas',
    location: 'Phoenix Mall, Mumbai',
    address: '462, Senapati Bapat Marg, Lower Parel, Mumbai - 400013',
    facilities: ['Dolby Atmos', 'IMAX', 'Food Court', 'Parking', 'Wheelchair Accessible'],
    screens: 8,
    seatCategories: ['Recliner', 'Premium', 'Executive'],
    rating: 4.5,
    imageUrl: 'https://via.placeholder.com/1000x400?text=PVR+Cinemas'
  };

  // Mock movie data
  const mockMovies = {
    '1': {
      movie: {
        _id: '1',
        title: 'Avengers: Endgame',
        posterUrl: 'https://via.placeholder.com/300x450?text=Avengers+Endgame',
        language: 'English',
        format: '3D',
        certification: 'U/A'
      },
      shows: [
        { _id: 's1', showTime: '09:00 AM', screen: 'Screen 1' },
        { _id: 's2', showTime: '12:30 PM', screen: 'Screen 2' },
        { _id: 's3', showTime: '04:00 PM', screen: 'Screen 1' },
        { _id: 's4', showTime: '07:30 PM', screen: 'Screen 3' },
        { _id: 's5', showTime: '11:00 PM', screen: 'Screen 2' }
      ]
    },
    '2': {
      movie: {
        _id: '2',
        title: 'Tenet',
        posterUrl: 'https://via.placeholder.com/300x450?text=Tenet',
        language: 'English',
        format: 'IMAX',
        certification: 'U/A'
      },
      shows: [
        { _id: 's6', showTime: '10:00 AM', screen: 'Screen 4' },
        { _id: 's7', showTime: '01:30 PM', screen: 'Screen 4' },
        { _id: 's8', showTime: '05:00 PM', screen: 'Screen 5' },
        { _id: 's9', showTime: '08:30 PM', screen: 'Screen 5' }
      ]
    }
  };

  const theaterData = theater || mockTheater;
  const moviesData = Object.keys(moviesByDate).length > 0 ? moviesByDate : mockMovies;

  return (
    <div className={styles.container}>
      <div 
        className={styles.banner}
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.9)), 
                           url(${theaterData.imageUrl || 'https://via.placeholder.com/1000x400?text=Theater'})`
        }}
      >
        <div className={styles.theaterInfo}>
          <h1>{theaterData.name}</h1>
          <p className={styles.location}>{theaterData.location}</p>
          <div className={styles.rating}>
            <span className={styles.ratingValue}>★ {theaterData.rating}</span>
            <span className={styles.reviews}>Based on 1000+ reviews</span>
          </div>
          <p className={styles.address}>{theaterData.address}</p>
          
          <div className={styles.facilities}>
            {theaterData.facilities.map((facility, index) => (
              <span key={index} className={styles.facility}>{facility}</span>
            ))}
          </div>
        </div>
      </div>
      
      <div className={styles.dateSelector}>
        {dates.map((date) => (
          <button 
            key={date.value}
            className={`${styles.dateButton} ${date.value === selectedDate ? styles.active : ''}`}
            onClick={() => handleDateChange(date.value)}
          >
            <div className={styles.day}>{date.display.split(',')[0]}</div>
            <div className={styles.date}>
              {date.display.split(',')[1]}
              {date.isToday && <span className={styles.today}>Today</span>}
            </div>
          </button>
        ))}
      </div>
      
      <div className={styles.moviesSection}>
        <h2>Movies & Showtimes</h2>
        
        {Object.keys(moviesData).length > 0 ? (
          <div className={styles.moviesList}>
            {Object.values(moviesData).map((movieData) => (
              <div key={movieData.movie._id} className={styles.movieItem}>
                <div className={styles.movieDetails}>
                  <img 
                    src={movieData.movie.posterUrl || 'https://via.placeholder.com/100x150?text=Movie'} 
                    alt={movieData.movie.title}
                    className={styles.poster}
                  />
                  <div className={styles.movieInfo}>
                    <h3>{movieData.movie.title}</h3>
                    <div className={styles.tags}>
                      <span className={styles.certification}>{movieData.movie.certification}</span>
                      <span className={styles.language}>{movieData.movie.language}</span>
                      {movieData.movie.format && (
                        <span className={styles.format}>{movieData.movie.format}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className={styles.showTimes}>
                  {movieData.shows.map((show) => (
                    <Link 
                      key={show._id} 
                      to={`/show/${show._id}`}
                      className={styles.showTime}
                    >
                      <div className={styles.time}>{show.showTime}</div>
                      <div className={styles.screen}>{show.screen}</div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.noShows}>
            <p>No shows available for this date. Please select another date.</p>
          </div>
        )}
      </div>
      
      <div className={styles.infoSection}>
        <h2>Theater Information</h2>
        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <h3>Amenities</h3>
            <ul>
              {theaterData.facilities.map((facility, index) => (
                <li key={index}>{facility}</li>
              ))}
            </ul>
          </div>
          
          <div className={styles.infoCard}>
            <h3>Seating</h3>
            <p>{theaterData.screens} Screens</p>
            <p>Seating types:</p>
            <ul>
              {theaterData.seatCategories.map((category, index) => (
                <li key={index}>{category}</li>
              ))}
            </ul>
          </div>
          
          <div className={styles.infoCard}>
            <h3>Parking</h3>
            <p>Paid parking available at the mall</p>
            <p>Valet services available</p>
          </div>
          
          <div className={styles.infoCard}>
            <h3>Food & Beverages</h3>
            <p>Food court at the premises</p>
            <p>In-theater food service</p>
            <p>Alcohol not permitted</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TheaterDetails; 