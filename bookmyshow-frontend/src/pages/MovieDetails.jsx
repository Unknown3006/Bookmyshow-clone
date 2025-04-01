import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieById, getShowsByMovie } from '../services/api';
import styles from './MovieDetails.module.css';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieAndShows = async () => {
      try {
        setLoading(true);
        const [movieRes, showsRes] = await Promise.all([
          getMovieById(id),
          getShowsByMovie(id, selectedDate.toISOString().split('T')[0])
        ]);

        setMovie(movieRes.data.data);
        setShows(showsRes.data.data);
      } catch (err) {
        setError('Failed to fetch movie details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieAndShows();
  }, [id, selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleBookNow = (showId) => {
    navigate(`/show/${showId}`);
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading movie details...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className={styles.error}>
        <h3>Oops! Something went wrong</h3>
        <p>{error || 'Movie not found'}</p>
        <button onClick={() => navigate('/')}>Go Back Home</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div 
        className={styles.banner}
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.9)), 
                           url(${movie.posterUrl})`
        }}
      >
        <div className={styles.movieInfo}>
          <div className={styles.poster}>
            <img src={movie.posterUrl} alt={movie.title} />
          </div>
          <div className={styles.details}>
            <h1>{movie.title}</h1>
            <div className={styles.rating}>
              <span>★</span> {movie.rating}/10
            </div>
            <div className={styles.metadata}>
              <span>{movie.duration} mins</span>
              <span>•</span>
              <span>{movie.language}</span>
              <span>•</span>
              <span>{movie.genre.join(', ')}</span>
            </div>
            <p className={styles.description}>{movie.description}</p>
            <div className={styles.cast}>
              <h3>Cast</h3>
              <p>{movie.cast.join(', ')}</p>
            </div>
            <div className={styles.crew}>
              <h3>Director</h3>
              <p>{movie.director}</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.showTimings}>
        <h2>Show Timings</h2>
        
        <div className={styles.dateSelector}>
          {[0, 1, 2, 3, 4].map(dayOffset => {
            const date = new Date();
            date.setDate(date.getDate() + dayOffset);
            return (
              <button
                key={dayOffset}
                className={`${styles.dateButton} ${
                  selectedDate.toDateString() === date.toDateString() ? styles.active : ''
                }`}
                onClick={() => handleDateChange(date)}
              >
                <span className={styles.day}>
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
                <span className={styles.date}>
                  {date.toLocaleDateString('en-US', { day: 'numeric' })}
                </span>
              </button>
            );
          })}
        </div>

        {shows.length > 0 ? (
          <div className={styles.theaters}>
            {shows.map(show => (
              <div key={show._id} className={styles.theater}>
                <div className={styles.theaterInfo}>
                  <h3>{show.theater.name}</h3>
                  <p>{show.theater.location}</p>
                </div>
                <div className={styles.times}>
                  {show.showTimes.map(time => (
                    <button
                      key={time}
                      className={styles.timeButton}
                      onClick={() => handleBookNow(show._id)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.noShows}>
            <p>No shows available for this date. Please try another date.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails; 