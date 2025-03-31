import React from 'react';
import './Hero.css';

const Hero = ({ movie }) => {
  // If no movie is provided, use this default movie
  const defaultMovie = {
    title: "The Latest Blockbuster",
    description: "Experience the thrill of the latest movies on the big screen. Book your tickets now!",
    posterUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  };

  const featuredMovie = movie || defaultMovie;

  return (
    <div className="hero" style={{ backgroundImage: `url(${featuredMovie.posterUrl})` }}>
      <div className="hero-content">
        <h1>{featuredMovie.title}</h1>
        <p>{featuredMovie.description}</p>
        <button className="book-now-btn">Book Now</button>
      </div>
    </div>
  );
};

export default Hero; 