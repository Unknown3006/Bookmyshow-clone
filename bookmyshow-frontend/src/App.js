import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import './App.css';

function MovieList() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/movies', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          mode: 'cors'
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        
        const data = await response.json();
        if (data && data.data) {
          setMovies(data.data);
        } else {
          throw new Error('Invalid data format received from server');
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
        setError(error.message || 'Failed to load movies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleBookNow = (movieId) => {
    try {
      navigate(`/book/${movieId}`);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleViewShows = (theaterId) => {
    try {
      navigate(`/theater/${theaterId}`);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading">Loading movies...</div>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <div className="error">
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-btn">
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <main>
      <Hero movie={movies.length > 0 ? movies[0] : null} />
      <section className="movie-list">
        <h2>Now Showing</h2>
        {movies.length === 0 ? (
          <div className="no-movies">
            <p>No movies available. Please check back later.</p>
          </div>
        ) : (
          <div className="movie-grid">
            {movies.map(movie => (
              <div className="movie-card" key={movie._id}>
                <div className="movie-poster">
                  <img 
                    src={movie.posterUrl || 'https://via.placeholder.com/150x225?text=No+Poster'} 
                    alt={movie.title}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150x225?text=No+Poster';
                    }}
                  />
                </div>
                <div className="movie-info">
                  <h3>{movie.title}</h3>
                  <p className="movie-genre">{movie.genre ? movie.genre.join(', ') : 'No genre specified'}</p>
                  <button 
                    onClick={() => handleBookNow(movie._id)} 
                    className="book-now-btn"
                    type="button"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="theater-list">
        <h2>Popular Theaters</h2>
        <div className="theater-grid">
          {[
            { id: 'pvr', name: 'PVR Cinemas', location: 'Mumbai' },
            { id: 'inox', name: 'INOX', location: 'Mumbai' },
            { id: 'cinepolis', name: 'Cinepolis', location: 'Mumbai' }
          ].map(theater => (
            <div className="theater-card" key={theater.id}>
              <h3>{theater.name}</h3>
              <p>{theater.location}</p>
              <button 
                onClick={() => handleViewShows(theater.id)} 
                className="view-shows-btn"
                type="button"
              >
                View Shows
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function BookingPage() {
  const navigate = useNavigate();
  return (
    <div className="booking-page">
      <h2>Book Your Tickets</h2>
      <button onClick={() => navigate('/')} className="back-btn">
        Back to Movies
      </button>
    </div>
  );
}

function TheaterPage() {
  const navigate = useNavigate();
  return (
    <div className="theater-page">
      <h2>Theater Shows</h2>
      <button onClick={() => navigate('/')} className="back-btn">
        Back to Movies
      </button>
    </div>
  );
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<MovieList />} />
          <Route path="/book/:movieId" element={<BookingPage />} />
          <Route path="/theater/:theaterId" element={<TheaterPage />} />
        </Routes>
        <footer>
          <p>&copy; 2024 BookMyShow Clone</p>
        </footer>
      </div>
    </Router>
  );
}

export default App; 