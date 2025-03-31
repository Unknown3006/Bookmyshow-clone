import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
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
                const [nowShowingRes, comingSoonRes, theatersRes] = await Promise.all([
                    getNowShowing(),
                    getComingSoon(),
                    getTheatersByCity('Mumbai') // Default city
                ]);

                setNowShowing(nowShowingRes.data);
                setComingSoon(comingSoonRes.data);
                setTheaters(theatersRes.data);
            } catch (err) {
                setError('Failed to fetch data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <Container maxWidth="lg">
            {/* Hero Section */}
            <Box className={styles.hero}>
                {nowShowing[0] && (
                    <Box className={styles.heroContent}>
                        <Typography variant="h2" component="h1">
                            {nowShowing[0].title}
                        </Typography>
                        <Typography variant="h6">
                            {nowShowing[0].description}
                        </Typography>
                        <Typography variant="body1">
                            Duration: {nowShowing[0].duration} mins • Language: {nowShowing[0].language}
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Now Showing Section */}
            <Box className={styles.section}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Now Showing
                </Typography>
                <Grid container spacing={2}>
                    {nowShowing.map(movie => (
                        <Grid item xs={6} sm={4} md={3} key={movie._id}>
                            <MovieCard movie={movie} />
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Coming Soon Section */}
            <Box className={styles.section}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Coming Soon
                </Typography>
                <Grid container spacing={2}>
                    {comingSoon.map(movie => (
                        <Grid item xs={6} sm={4} md={3} key={movie._id}>
                            <MovieCard movie={movie} />
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Theaters Section */}
            <Box className={styles.section}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Theaters in Mumbai
                </Typography>
                <Grid container spacing={2}>
                    {theaters.map(theater => (
                        <Grid item xs={12} sm={6} md={4} key={theater._id}>
                            <Box className={styles.theaterCard}>
                                <Typography variant="h6">{theater.name}</Typography>
                                <Typography variant="body2">{theater.address}</Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    );
};

export default Home; 