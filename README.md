# SafeExpress Fleet Management System

SafeExpress is a full-stack logistics and fleet management delivery tracking platform. It enables admins to manage vehicles and deliveries, drivers to view and update their assigned deliveries, and customers to track their orders in real time.  

## Features

- **Admin**
  - Register/login as admin (with secret code)
  - Add and manage vehicles
  - Create and assign deliveries to drivers and vehicles
  - View all deliveries and vehicles
  - View analytics reports (average delivery time per driver, vehicle utilization)

- **Driver**
  - Register/login as driver
  - View assigned deliveries
  - Update delivery status (start, deliver)
  - Real-time location tracking via map

- **Customer**
  - Register/login as customer
  - View and track their deliveries in real time
  - See driver location on map

- **Real-time Tracking**
  - Live driver location updates using Socket.io
  - Map visualization with Leaflet

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, React Router, Leaflet, Recharts, Axios, Socket.io-client
- **Backend:** Node.js, Express, MongoDB (Mongoose), Socket.io, JWT Auth, bcryptjs
- **Deployment:** Vercel (Frontend), Render (Backend)

## Project Structure

```
Backend/
  controllers/
  middleware/
  models/
  routes/
  config/
  .env
  index.js
  package.json

Frontend/
  src/
    components/
    pages/
    routes/
    utils/
    App.jsx
    main.jsx
    index.css
  public/
  .env
  index.html
  package.json
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB Atlas account (or local MongoDB)
- [Vercel](https://vercel.com/) and [Render](https://render.com/) accounts for deployment (optional)

### Backend Setup

1. **Install dependencies:**
   ```sh
   cd Backend
   npm install
   ```

2. **Configure environment variables:**
   - Create an `.env` and set your MongoDB URI, JWT secret, and admin secret code.

3. **Start the backend server:**
   ```sh
   npm start
   ```
   The backend runs on `http://localhost:3000` by default.

### Frontend Setup

1. **Install dependencies:**
   ```sh
   cd Frontend
   npm install
   ```

2. **Configure environment variables:**
   - Create an `.env` and set `VITE_API_BASE_URL` and `VITE_SOCKET_URL` to your backend URLs.

3. **Start the frontend dev server:**
   ```sh
   npm run dev
   ```
   The frontend runs on `http://localhost:5173` by default.

4. **Build for production:**
   ```sh
   npm run build
   ```
   The built files are placed in the `dist/` directory.

## Usage

- Register as **Admin** (requires secret code), **Driver**, or **Customer**.
- Admin can add vehicles, create deliveries, and view reports.
- Drivers see their assigned deliveries and update status/location.
- Customers track their orders and see driver location in real time.

## Deployment

- **Frontend:** Deploy the `Frontend` folder to Vercel.
- **Backend:** Deploy the `Backend` folder to Render or any Node.js hosting.
- Update environment variables accordingly.

## License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## 🧑‍💻 Author

Kundena Akhil - [Portfolio](https://portfolio-nine-flax-29.vercel.app/)

---