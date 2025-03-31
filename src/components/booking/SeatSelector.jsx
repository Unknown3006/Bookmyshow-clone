import React, { useState } from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import styles from './SeatSelector.module.css';

const SeatSelector = ({ totalSeats, bookedSeats, onSeatSelect }) => {
    const [selectedSeats, setSelectedSeats] = useState([]);
    const rows = Math.ceil(totalSeats / 10); // Assuming 10 seats per row

    const handleSeatClick = (seatNumber) => {
        if (bookedSeats.includes(seatNumber)) return;

        setSelectedSeats(prev => {
            const newSelection = prev.includes(seatNumber)
                ? prev.filter(seat => seat !== seatNumber)
                : [...prev, seatNumber];
            onSeatSelect(newSelection);
            return newSelection;
        });
    };

    const getSeatStatus = (seatNumber) => {
        if (bookedSeats.includes(seatNumber)) return 'booked';
        if (selectedSeats.includes(seatNumber)) return 'selected';
        return 'available';
    };

    return (
        <Box className={styles.container}>
            <Box className={styles.legend}>
                <Box className={styles.legendItem}>
                    <div className={`${styles.seat} ${styles.available}`} />
                    <Typography>Available</Typography>
                </Box>
                <Box className={styles.legendItem}>
                    <div className={`${styles.seat} ${styles.selected}`} />
                    <Typography>Selected</Typography>
                </Box>
                <Box className={styles.legendItem}>
                    <div className={`${styles.seat} ${styles.booked}`} />
                    <Typography>Booked</Typography>
                </Box>
            </Box>

            <Box className={styles.screen}>
                <Typography variant="h6">SCREEN</Typography>
            </Box>

            <Grid container spacing={2} className={styles.seatsGrid}>
                {Array.from({ length: rows }, (_, rowIndex) => (
                    <Grid item xs={12} key={rowIndex} className={styles.row}>
                        {Array.from({ length: 10 }, (_, colIndex) => {
                            const seatNumber = rowIndex * 10 + colIndex + 1;
                            if (seatNumber > totalSeats) return null;
                            
                            return (
                                <Button
                                    key={seatNumber}
                                    className={`${styles.seat} ${styles[getSeatStatus(seatNumber)]}`}
                                    onClick={() => handleSeatClick(seatNumber)}
                                    disabled={bookedSeats.includes(seatNumber)}
                                >
                                    {seatNumber}
                                </Button>
                            );
                        })}
                    </Grid>
                ))}
            </Grid>

            <Box className={styles.summary}>
                <Typography>
                    Selected Seats: {selectedSeats.join(', ')}
                </Typography>
                <Typography>
                    Total Amount: ₹{selectedSeats.length * 500} {/* Assuming ₹500 per seat */}
                </Typography>
            </Box>
        </Box>
    );
};

export default SeatSelector; 