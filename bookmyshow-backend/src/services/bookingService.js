import { query } from '../config/database.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';

export class BookingService {
  static async createBooking(userId, showId, seats, totalAmount) {
    const client = await getClient();
    
    try {
      await client.query('BEGIN');
      
      // Check seat availability
      const show = await client.query(
        'SELECT available_seats FROM shows WHERE id = $1 FOR UPDATE',
        [showId]
      );
      
      if (!show.rows[0]) {
        throw new NotFoundError('Show not found');
      }
      
      const availableSeats = show.rows[0].available_seats;
      const isValidBooking = this.validateSeatAvailability(seats, availableSeats);
      
      if (!isValidBooking) {
        throw new ValidationError('Selected seats are not available');
      }
      
      // Update available seats
      const updatedSeats = this.updateAvailableSeats(availableSeats, seats);
      await client.query(
        'UPDATE shows SET available_seats = $1 WHERE id = $2',
        [updatedSeats, showId]
      );
      
      // Create booking
      const booking = await client.query(
        `INSERT INTO bookings (user_id, show_id, seats, total_amount)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [userId, showId, JSON.stringify(seats), totalAmount]
      );
      
      await client.query('COMMIT');
      return booking.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  
  static validateSeatAvailability(selectedSeats, availableSeats) {
    // Implementation of seat validation logic
  }
  
  static updateAvailableSeats(availableSeats, bookedSeats) {
    // Implementation of seat updating logic
  }
}