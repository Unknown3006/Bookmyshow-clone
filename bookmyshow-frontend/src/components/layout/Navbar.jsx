import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">BookMyShow</Link>
      </div>
      
      <div className={styles.search}>
        <input 
          type="text" 
          placeholder="Search for Movies, Events, Plays, Sports and Activities"
        />
      </div>

      <div className={styles.location}>
        <select defaultValue="Mumbai">
          <option value="Mumbai">Mumbai</option>
          <option value="Delhi">Delhi</option>
          <option value="Bangalore">Bangalore</option>
          <option value="Chennai">Chennai</option>
        </select>
      </div>

      <div className={styles.auth}>
        {user ? (
          <>
            <Link to="/profile" className={styles.profileLink}>
              {user.name}
            </Link>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={styles.authBtn}>
              Login
            </Link>
            <Link to="/register" className={styles.authBtn}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 