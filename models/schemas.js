const mongoose = require('mongoose');

// Movie Schema
const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    duration: {
        type: Number,
        required: [true, 'Duration is required'],
        min: [1, 'Duration must be at least 1 minute']
    },
    genre: [{
        type: String,
        trim: true
    }],
    language: {
        type: String,
        required: [true, 'Language is required'],
        trim: true
    },
    releaseDate: {
        type: Date,
        required: [true, 'Release date is required']
    },
    cast: [{
        type: String,
        trim: true
    }],
    director: {
        type: String,
        required: [true, 'Director is required'],
        trim: true
    },
    rating: {
        type: Number,
        min: [0, 'Rating cannot be less than 0'],
        max: [10, 'Rating cannot be more than 10']
    },
    posterUrl: {
        type: String,
        trim: true
    },
    trailerUrl: {
        type: String,
        trim: true
    },
    nowShowing: {
        type: Boolean,
        default: false
    },
    comingSoon: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Theater Schema
const screenSchema = new mongoose.Schema({
    screenNumber: {
        type: Number,
        required: [true, 'Screen number is required']
    },
    seatingCapacity: {
        type: Number,
        required: [true, 'Seating capacity is required'],
        min: [1, 'Seating capacity must be at least 1']
    },
    screenType: {
        type: String,
        required: [true, 'Screen type is required'],
        enum: ['IMAX', '3D', '4DX', 'Standard']
    }
});

const theaterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Theater name is required'],
        trim: true
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true
    },
    screens: [screenSchema]
}, {
    timestamps: true
});

// Show Schema
const showSchema = new mongoose.Schema({
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: [true, 'Movie reference is required']
    },
    theaterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Theater',
        required: [true, 'Theater reference is required']
    },
    screenNumber: {
        type: Number,
        required: [true, 'Screen number is required']
    },
    date: {
        type: Date,
        required: [true, 'Show date is required']
    },
    startTime: {
        type: String,
        required: [true, 'Start time is required']
    },
    endTime: {
        type: String,
        required: [true, 'End time is required']
    },
    availableSeats: {
        type: Number,
        required: [true, 'Available seats is required'],
        min: [0, 'Available seats cannot be negative']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    }
}, {
    timestamps: true
});

// User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    bookings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    }]
}, {
    timestamps: true
});

// Booking Schema
const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User reference is required']
    },
    showId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Show',
        required: [true, 'Show reference is required']
    },
    seats: [{
        type: Number,
        required: [true, 'Seat numbers are required']
    }],
    totalAmount: {
        type: Number,
        required: [true, 'Total amount is required'],
        min: [0, 'Total amount cannot be negative']
    },
    bookingDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['confirmed', 'cancelled'],
        default: 'confirmed'
    }
}, {
    timestamps: true
});

// Create indexes for better performance
movieSchema.index({ title: 1 });
movieSchema.index({ nowShowing: 1 });
movieSchema.index({ comingSoon: 1 });

theaterSchema.index({ location: 1 });
theaterSchema.index({ name: 1 });

showSchema.index({ movieId: 1, theaterId: 1, date: 1 });
showSchema.index({ date: 1 });

userSchema.index({ email: 1 });

bookingSchema.index({ userId: 1 });
bookingSchema.index({ showId: 1 });

// Create models
const Movie = mongoose.model('Movie', movieSchema);
const Theater = mongoose.model('Theater', theaterSchema);
const Show = mongoose.model('Show', showSchema);
const User = mongoose.model('User', userSchema);
const Booking = mongoose.model('Booking', bookingSchema);

// Sample documents for testing
const sampleDocuments = {
    movie: {
        title: "Inception",
        description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        duration: 148,
        genre: ["Action", "Sci-Fi", "Thriller"],
        language: "English",
        releaseDate: new Date("2010-07-16"),
        cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page"],
        director: "Christopher Nolan",
        rating: 8.8,
        posterUrl: "https://example.com/inception-poster.jpg",
        trailerUrl: "https://example.com/inception-trailer.mp4",
        nowShowing: true,
        comingSoon: false
    },
    theater: {
        name: "Cineplex IMAX",
        location: "Mumbai",
        address: "123 Cinema Street, Bandra West, Mumbai - 400050",
        screens: [
            {
                screenNumber: 1,
                seatingCapacity: 300,
                screenType: "IMAX"
            },
            {
                screenNumber: 2,
                seatingCapacity: 200,
                screenType: "3D"
            }
        ]
    },
    show: {
        movieId: "movie_id_here",
        theaterId: "theater_id_here",
        screenNumber: 1,
        date: new Date("2024-03-20"),
        startTime: "14:30",
        endTime: "17:00",
        availableSeats: 250,
        price: 500
    },
    user: {
        name: "John Doe",
        email: "john.doe@example.com",
        password: "hashedPassword123",
        bookings: []
    },
    booking: {
        userId: "user_id_here",
        showId: "show_id_here",
        seats: [1, 2, 3],
        totalAmount: 1500,
        bookingDate: new Date(),
        status: "confirmed"
    }
};

module.exports = {
    Movie,
    Theater,
    Show,
    User,
    Booking,
    sampleDocuments
}; 