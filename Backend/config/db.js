const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoUri = process.env.MongoDB_URI;
        if (!mongoUri) {
            throw new Error('MongoDB_URI environment variable is not set');
        }
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
}

module.exports = connectDB;