import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <h1>BookMyShow</h1>
      </div>
      <div className="search-bar">
        <input type="text" placeholder="Search for Movies, Events, Plays, Sports and Activities" />
        <button><i className="fa fa-search"></i></button>
      </div>
      <div className="nav-links">
        <button className="login-btn">Login</button>
        <div className="location">
          <i className="fa fa-map-marker"></i>
          <span>Mumbai</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 