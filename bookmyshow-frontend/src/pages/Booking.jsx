import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { getShowById, createBooking } from '../services/api';
import { useAuth } from '../context/AuthContext';
import styles from './Booking.module.css';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    upiId: '',
    walletNumber: ''
  });
  const [formErrors, setFormErrors] = useState({});
  
  useEffect(() => {
    const fetchShowAndSeats = async () => {
      try {
        setLoading(true);
        
        // Get selectedSeats from sessionStorage
        const storedSeats = sessionStorage.getItem('selectedSeats');
        if (storedSeats) {
          setSelectedSeats(JSON.parse(storedSeats));
        } else {
          throw new Error('No seats selected. Please go back and select seats.');
        }
        
        // Fetch show details
        const response = await getShowById(id);
        setShow(response.data.data);
      } catch (err) {
        console.error('Error setting up booking:', err);
        setError(err.message || 'Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchShowAndSeats();
  }, [id]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (paymentMethod === 'card') {
      if (!formData.cardNumber.trim()) {
        errors.cardNumber = 'Card number is required';
      } else if (!/^\d{16}$/.test(formData.cardNumber.trim())) {
        errors.cardNumber = 'Card number must be 16 digits';
      }
      
      if (!formData.cardName.trim()) {
        errors.cardName = 'Cardholder name is required';
      }
      
      if (!formData.expiryDate.trim()) {
        errors.expiryDate = 'Expiry date is required';
      } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate.trim())) {
        errors.expiryDate = 'Format must be MM/YY';
      }
      
      if (!formData.cvv.trim()) {
        errors.cvv = 'CVV is required';
      } else if (!/^\d{3}$/.test(formData.cvv.trim())) {
        errors.cvv = 'CVV must be 3 digits';
      }
    } else if (paymentMethod === 'upi') {
      if (!formData.upiId.trim()) {
        errors.upiId = 'UPI ID is required';
      } else if (!formData.upiId.includes('@')) {
        errors.upiId = 'Enter a valid UPI ID';
      }
    } else if (paymentMethod === 'wallet') {
      if (!formData.walletNumber.trim()) {
        errors.walletNumber = 'Mobile number is required';
      } else if (!/^\d{10}$/.test(formData.walletNumber.trim())) {
        errors.walletNumber = 'Enter a valid 10-digit mobile number';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Prepare booking data
      const bookingData = {
        showId: id,
        seats: selectedSeats.map(seat => seat.id),
        amount: totalAmount,
        paymentMethod,
        // Include payment details (in a real app, handle this securely)
        paymentDetails: {
          ...formData
        }
      };
      
      // Call API to create booking
      const response = await createBooking(bookingData);
      
      setBookingId(response.data.data._id);
      setBookingSuccess(true);
      
      // Clear session storage
      sessionStorage.removeItem('selectedSeats');
      sessionStorage.removeItem('showId');
    } catch (err) {
      console.error('Booking failed:', err);
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoToBookings = () => {
    navigate('/my-bookings');
  };
  
  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Processing your booking...</p>
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
  
  if (bookingSuccess) {
    return (
      <div className={styles.success}>
        <div className={styles.checkmark}>
          <div className={styles.checkmarkCircle}></div>
          <div className={styles.checkmarkStem}></div>
          <div className={styles.checkmarkKick}></div>
        </div>
        <h2>Booking Confirmed!</h2>
        <p>Your booking ID: <span className={styles.bookingId}>{bookingId}</span></p>
        <p>A confirmation has been sent to your email: {user.email}</p>
        <div className={styles.actions}>
          <button onClick={handleGoToBookings} className={styles.primaryBtn}>
            View My Bookings
          </button>
          <button onClick={() => navigate('/')} className={styles.secondaryBtn}>
            Back to Home
          </button>
        </div>
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
      certification: 'U/A'
    },
    theater: {
      _id: '456',
      name: 'PVR Cinemas',
      location: 'Phoenix Mall, Mumbai',
      screen: 'Audi 3'
    },
    showTime: '6:30 PM',
    showDate: '2023-03-31'
  };
  
  const showData = show || mockShow;
  const totalAmount = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  const convenienceFee = Math.round(totalAmount * 0.05); // 5% convenience fee
  const totalPayable = totalAmount + convenienceFee;
  
  return (
    <div className={styles.container}>
      <div className={styles.columns}>
        <div className={styles.leftColumn}>
          <div className={styles.bookingSummary}>
            <h2>Booking Summary</h2>
            
            <div className={styles.movieDetails}>
              <img 
                src={showData.movie.posterUrl || 'https://via.placeholder.com/100x150?text=Movie'} 
                alt={showData.movie.title}
                className={styles.poster}
              />
              <div>
                <h3>{showData.movie.title}</h3>
                <p className={styles.cert}>{showData.movie.certification}</p>
                <p className={styles.theaterName}>{showData.theater.name}</p>
                <p className={styles.screen}>{showData.theater.screen}</p>
                <p className={styles.showTime}>
                  {format(new Date(showData.showDate), 'dd MMM, yyyy')} • {showData.showTime}
                </p>
              </div>
            </div>
            
            <div className={styles.seatSummary}>
              <div className={styles.seatInfo}>
                <h4>Seats</h4>
                <p className={styles.seats}>{selectedSeats.map(seat => seat.label).join(', ')}</p>
              </div>
              <div className={styles.priceBreakdown}>
                <div className={styles.priceItem}>
                  <span>Tickets ({selectedSeats.length})</span>
                  <span>₹{totalAmount}</span>
                </div>
                <div className={styles.priceItem}>
                  <span>Convenience Fee</span>
                  <span>₹{convenienceFee}</span>
                </div>
                <div className={styles.totalPrice}>
                  <span>Total Amount</span>
                  <span>₹{totalPayable}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.rightColumn}>
          <div className={styles.paymentSection}>
            <h2>Payment Details</h2>
            
            <div className={styles.paymentMethods}>
              <button 
                className={`${styles.paymentMethod} ${paymentMethod === 'card' ? styles.active : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                <i className={styles.cardIcon}></i>
                Credit / Debit Card
              </button>
              <button 
                className={`${styles.paymentMethod} ${paymentMethod === 'upi' ? styles.active : ''}`}
                onClick={() => setPaymentMethod('upi')}
              >
                <i className={styles.upiIcon}></i>
                UPI
              </button>
              <button 
                className={`${styles.paymentMethod} ${paymentMethod === 'wallet' ? styles.active : ''}`}
                onClick={() => setPaymentMethod('wallet')}
              >
                <i className={styles.walletIcon}></i>
                Mobile Wallet
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.paymentForm}>
              {paymentMethod === 'card' && (
                <>
                  <div className={styles.formGroup}>
                    <label htmlFor="cardNumber">Card Number</label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className={formErrors.cardNumber ? styles.error : ''}
                    />
                    {formErrors.cardNumber && (
                      <p className={styles.errorText}>{formErrors.cardNumber}</p>
                    )}
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="cardName">Cardholder Name</label>
                    <input
                      type="text"
                      id="cardName"
                      name="cardName"
                      placeholder="Name on card"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      className={formErrors.cardName ? styles.error : ''}
                    />
                    {formErrors.cardName && (
                      <p className={styles.errorText}>{formErrors.cardName}</p>
                    )}
                  </div>
                  
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="expiryDate">Expiry Date</label>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        className={formErrors.expiryDate ? styles.error : ''}
                      />
                      {formErrors.expiryDate && (
                        <p className={styles.errorText}>{formErrors.expiryDate}</p>
                      )}
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor="cvv">CVV</label>
                      <input
                        type="password"
                        id="cvv"
                        name="cvv"
                        placeholder="123"
                        maxLength="3"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        className={formErrors.cvv ? styles.error : ''}
                      />
                      {formErrors.cvv && (
                        <p className={styles.errorText}>{formErrors.cvv}</p>
                      )}
                    </div>
                  </div>
                </>
              )}
              
              {paymentMethod === 'upi' && (
                <div className={styles.formGroup}>
                  <label htmlFor="upiId">UPI ID</label>
                  <input
                    type="text"
                    id="upiId"
                    name="upiId"
                    placeholder="username@upi"
                    value={formData.upiId}
                    onChange={handleInputChange}
                    className={formErrors.upiId ? styles.error : ''}
                  />
                  {formErrors.upiId && (
                    <p className={styles.errorText}>{formErrors.upiId}</p>
                  )}
                </div>
              )}
              
              {paymentMethod === 'wallet' && (
                <div className={styles.formGroup}>
                  <label htmlFor="walletNumber">Mobile Number</label>
                  <input
                    type="text"
                    id="walletNumber"
                    name="walletNumber"
                    placeholder="10-digit mobile number"
                    value={formData.walletNumber}
                    onChange={handleInputChange}
                    className={formErrors.walletNumber ? styles.error : ''}
                  />
                  {formErrors.walletNumber && (
                    <p className={styles.errorText}>{formErrors.walletNumber}</p>
                  )}
                </div>
              )}
              
              <div className={styles.termsCheck}>
                <input type="checkbox" id="terms" required />
                <label htmlFor="terms">
                  I accept the <a href="#terms">terms and conditions</a> and <a href="#privacy">privacy policy</a>
                </label>
              </div>
              
              <button type="submit" className={styles.payButton}>
                Pay ₹{totalPayable}
              </button>
              
              <p className={styles.disclaimer}>
                By proceeding, you agree to the <a href="#terms">Terms & Conditions</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking; 