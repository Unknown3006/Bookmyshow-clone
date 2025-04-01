import React from 'react';
import { Link } from 'react-router-dom';
import styles from './MovieCard.module.css';

const MovieCard = ({ movie }) => {
  if (!movie) {
    return null;
  }

  const {
    _id,
    id,
    title = 'Untitled Movie',
    posterUrl,
    rating = 0,
    duration = 120,
    genre = ['Drama'],
    language = 'English'
  } = movie;

  const movieId = _id || id;

  return (
    <Link to={`/movie/${movieId}`} className={styles.card}>
      <div className={styles.poster}>
        <img 
          src={posterUrl || 'https://via.placeholder.com/300x450?text=No+Poster'} 
          alt={title}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x450?text=No+Poster';
          }}
        />
        {rating > 0 && (
          <div className={styles.rating}>
            <span>★</span> {rating.toFixed(1)}
          </div>
        )}
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.details}>
          {duration} mins • {language}
        </p>
        <p className={styles.genre}>
          {Array.isArray(genre) ? genre.join(' • ') : genre}
        </p>
        <button className={styles.bookButton}>
          Book Now
        </button>
      </div>
    </Link>
  );
};

export default MovieCard; 