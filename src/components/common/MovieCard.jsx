import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Box, Rating } from '@mui/material';
import styles from './MovieCard.module.css';

const MovieCard = ({ movie }) => {
    const {
        _id,
        title,
        posterUrl,
        rating,
        duration,
        genre,
        language
    } = movie;

    return (
        <Link to={`/movie/${_id}`} className={styles.link}>
            <Card className={styles.card}>
                <CardMedia
                    component="img"
                    height="300"
                    image={posterUrl}
                    alt={title}
                    className={styles.poster}
                />
                <CardContent className={styles.content}>
                    <Typography variant="h6" component="div" className={styles.title}>
                        {title}
                    </Typography>
                    <Box className={styles.details}>
                        <Typography variant="body2" color="text.secondary">
                            {duration} mins • {language}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {genre.join(', ')}
                        </Typography>
                        <Rating value={rating} precision={0.1} readOnly size="small" />
                    </Box>
                </CardContent>
            </Card>
        </Link>
    );
};

export default MovieCard; 