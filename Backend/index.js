const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const orderRequestRoutes = require('./routes/orderRequestRoutes');
const driverRoutes = require('./routes/driverRoutes');

dotenv.config({ override: true, encoding: 'utf16le' });
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/order-requests', orderRequestRoutes);
app.use('/api/drivers', driverRoutes);

// Create HTTP server and attach Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST']
  }
});

// Socket.io for real-time tracking
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Driver sends location updates
  socket.on('driverLocation', async (data) => {
    // data = { deliveryId, lat, lng, status, driverId }
    try {
      const Tracking = require('./models/tracking');
      if (data.deliveryId && typeof data.lat === 'number' && typeof data.lng === 'number' && data.driverId) {
        await Tracking.create({
          deliveryId: data.deliveryId,
          driverId: data.driverId,
          coords: { lat: data.lat, lng: data.lng }
        });
      }
    } catch (err) {
      console.error('Failed to persist tracking:', err.message);
    }
    io.to(data.deliveryId).emit('locationUpdate', data);
  });

  // Customer joins a delivery room
  socket.on('joinDelivery', (deliveryId) => {
    socket.join(deliveryId);
    console.log(`Customer joined room: ${deliveryId}`);
  });

  // Customer sends their location updates
  socket.on('customerLocation', (data) => {
    // data = { deliveryId, lat, lng }
    io.to(data.deliveryId).emit('customerLocationUpdate', data);
  });

  // Admin joins order requests room
  socket.on('joinOrderRequests', () => {
    socket.join('orderRequests');
    console.log('Admin joined order requests room');
  });

  // Notify about new order request
  socket.on('newOrderRequest', (data) => {
    io.to('orderRequests').emit('orderRequestCreated', data);
  });

  // Notify about order request status update
  socket.on('orderRequestUpdate', (data) => {
    io.to('orderRequests').emit('orderRequestStatusChanged', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = { app, io };
