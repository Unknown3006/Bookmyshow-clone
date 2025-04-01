import React, { useState, useEffect } from 'react';
import styles from './SeatSelector.module.css';

const SeatSelector = ({ 
  showData, 
  selectedSeats = [], 
  onSeatSelect 
}) => {
  const [seatMap, setSeatMap] = useState([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState(new Set());

  useEffect(() => {
    if (showData && showData.seating) {
      setSeatMap(generateSeatMap(showData.seating));
    }
  }, [showData]);

  useEffect(() => {
    const seatIdSet = new Set(selectedSeats.map(seat => seat.id));
    setSelectedSeatIds(seatIdSet);
  }, [selectedSeats]);

  const generateSeatMap = (seatingData) => {
    // This would normally come from API, but we'll mock it for demo
    const rows = 'ABCDEFGHIJKL'.split('');
    const seatsPerRow = 18;
    
    return rows.map(rowLabel => {
      const rowSeats = [];
      for (let i = 1; i <= seatsPerRow; i++) {
        // Create a gap in the middle
        if (i === 9) { 
          rowSeats.push({ id: `${rowLabel}GAP`, type: 'gap' });
        }
        
        const seatId = `${rowLabel}${i}`;
        // Randomize some seats as booked
        const isBooked = Math.random() < 0.3;
        // Make premium seats in rows A-D
        const isPremium = rowLabel < 'E';

        rowSeats.push({
          id: seatId,
          label: seatId,
          price: isPremium ? 350 : 250,
          status: isBooked ? 'booked' : 'available',
          type: isPremium ? 'premium' : 'standard'
        });
      }
      return { label: rowLabel, seats: rowSeats };
    });
  };

  const handleSeatClick = (seat) => {
    if (seat.status === 'booked') return;
    
    const newSelectedSeatIds = new Set(selectedSeatIds);
    
    if (newSelectedSeatIds.has(seat.id)) {
      newSelectedSeatIds.delete(seat.id);
    } else {
      // Limit to 10 seats per booking
      if (newSelectedSeatIds.size >= 10) {
        alert('You can select up to 10 seats only.');
        return;
      }
      newSelectedSeatIds.add(seat.id);
    }
    
    setSelectedSeatIds(newSelectedSeatIds);
    
    // Create complete seat objects for selected seats
    const newSelectedSeats = [];
    seatMap.forEach(row => {
      row.seats.forEach(seat => {
        if (newSelectedSeatIds.has(seat.id)) {
          newSelectedSeats.push(seat);
        }
      });
    });
    
    onSeatSelect(newSelectedSeats);
  };

  return (
    <div className={styles.seatSelector}>
      <div className={styles.screen}>
        <div className={styles.screenText}>SCREEN</div>
      </div>
      
      <div className={styles.seatLegend}>
        <div className={styles.legendItem}>
          <div className={`${styles.seat} ${styles.available}`}></div>
          <span>Available</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.seat} ${styles.selected}`}></div>
          <span>Selected</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.seat} ${styles.booked}`}></div>
          <span>Booked</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.seat} ${styles.premium}`}></div>
          <span>Premium (₹350)</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.seat} ${styles.standard}`}></div>
          <span>Standard (₹250)</span>
        </div>
      </div>
      
      <div className={styles.seatMap}>
        {seatMap.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            <div className={styles.rowLabel}>{row.label}</div>
            <div className={styles.seats}>
              {row.seats.map((seat, seatIndex) => (
                seat.type === 'gap' ? (
                  <div key={`gap-${seatIndex}`} className={styles.gap}></div>
                ) : (
                  <div
                    key={seat.id}
                    className={`
                      ${styles.seat}
                      ${styles[seat.status]}
                      ${styles[seat.type]}
                      ${selectedSeatIds.has(seat.id) ? styles.selected : ''}
                    `}
                    onClick={() => handleSeatClick(seat)}
                  >
                    <span className={styles.seatNumber}>
                      {seat.label.replace(row.label, '')}
                    </span>
                  </div>
                )
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.seatSummary}>
        <div className={styles.summaryItem}>
          Selected: <strong>{selectedSeatIds.size}</strong> seats
        </div>
        <div className={styles.summaryItem}>
          Total: <strong>₹{Array.from(selectedSeatIds).reduce((sum, seatId) => {
            const seat = seatMap.flatMap(row => row.seats).find(s => s.id === seatId);
            return sum + (seat ? seat.price : 0);
          }, 0)}</strong>
        </div>
      </div>
    </div>
  );
};

export default SeatSelector; 