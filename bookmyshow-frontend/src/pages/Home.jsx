import React, { useState, useEffect } from 'react';
import { getNowShowing, getComingSoon, getTheatersByCity } from '../services/api';
import MovieCard from '../components/common/MovieCard';
import styles from './Home.module.css';

const Home = () => {
  const [nowShowing, setNowShowing] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching data...');
        
        const [nowShowingRes, comingSoonRes, theatersRes] = await Promise.all([
          getNowShowing(),
          getComingSoon(),
          getTheatersByCity('Mumbai') // Default city
        ]);

        console.log('Now Showing Response:', nowShowingRes);
        console.log('Coming Soon Response:', comingSoonRes);
        console.log('Theaters Response:', theatersRes);

        // Safely set the data with fallbacks
        setNowShowing(nowShowingRes?.data?.data || []);
        setComingSoon(comingSoonRes?.data?.data || []);
        setTheaters(theatersRes?.data?.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading amazing movies for you...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <h3>Oops! Something went wrong</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      {nowShowing[0] && (
        <div 
          className={styles.hero}
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.9)), 
                             url(${nowShowing[0].posterUrl || 'https://via.placeholder.com/1200x600'})`
          }}
        >
          <div className={styles.heroContent}>
            <h1>{nowShowing[0].title}</h1>
            <p>{nowShowing[0].description || 'No description available'}</p>
            <div className={styles.heroInfo}>
              <span>{nowShowing[0].duration || '120'} mins</span>
              <span>•</span>
              <span>{nowShowing[0].language || 'English'}</span>
              <span>•</span>
              <span>{(nowShowing[0].genre || []).join(', ') || 'Drama'}</span>
            </div>
            <button className={styles.bookNowBtn}>Book Now</button>
          </div>
        </div>
      )}

      {/* Now Showing Section */}
      <section className={styles.section}>
        <h2>Now Showing</h2>
        <div className={styles.movieGrid}>
          {nowShowing.length > 0 ? (
            nowShowing.map(movie => (
              <MovieCard key={movie._id || movie.id} movie={movie} />
            ))
          ) : (
            <p>No movies currently showing</p>
          )}
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className={styles.section}>
        <h2>Coming Soon</h2>
        <div className={styles.movieGrid}>
          {comingSoon.length > 0 ? (
            comingSoon.map(movie => (
              <MovieCard key={movie._id || movie.id} movie={movie} />
            ))
          ) : (
            <p>No upcoming movies</p>
          )}
        </div>
      </section>

      {/* Theaters Section */}
      <section className={styles.section}>
        <h2>Popular Theaters in Mumbai</h2>
        <div className={styles.theaterGrid}>
          {theaters.length > 0 ? (
            theaters.map(theater => (
              <div key={theater._id || theater.id} className={styles.theaterCard}>
                <h3>{theater.name}</h3>
                <p>{theater.location}</p>
                <div className={styles.facilities}>
                  {(theater.facilities || []).map(facility => (
                    <span key={facility}>{facility}</span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p>No theaters available</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home; 