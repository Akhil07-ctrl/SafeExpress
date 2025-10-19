# SafeExpress Fleet Management System

SafeExpress is a comprehensive full-stack logistics and fleet management delivery tracking platform. It revolutionizes logistics management with innovative technology and real-time insights, enabling admins to manage vehicles and deliveries, drivers to view and update their assigned deliveries, and customers to track their orders in real time.

## 🚀 Features

### **Admin Dashboard**
- Register/login as admin (with secret code)
- Add and manage vehicles in the fleet
- Create and assign deliveries to drivers and vehicles
- View all deliveries and vehicles with real-time status
- Comprehensive analytics reports (average delivery time per driver, vehicle utilization)
- Order request management and approval workflow

### **Driver Operations**
- Register/login as driver
- View assigned deliveries with detailed information
- Update delivery status (picked up, in-transit, delivered)
- Real-time location tracking via interactive map
- Communication tools for customer coordination

### **Customer Portal**
- Register/login as customer
- View and track deliveries in real time
- Interactive map showing driver location
- Order history and delivery status updates
- Seamless payment processing integration

### **Real-time Tracking & Communication**
- Live driver location updates using Socket.io
- Interactive map visualization with Leaflet
- Real-time notifications and status updates
- Secure communication channels between all parties

### **Public Resources**
- **Blog**: Industry insights, trends, and logistics innovations
- **Documentation**: Comprehensive user guides and best practices
- **API Reference**: Complete developer documentation for integrations
- **Careers**: Join our growing team in logistics innovation

### **Advanced Features**
- JWT-based authentication with role-based access control
- Responsive design optimized for all devices
- Real-time analytics and reporting dashboards
- Secure payment processing
- RESTful API for third-party integrations

## 🛠️ Tech Stack

### **Frontend**
- **React** - Modern JavaScript library for building user interfaces
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **React Router** - Declarative routing for React applications
- **Leaflet** - Interactive maps for real-time location tracking
- **Recharts** - Composable charting library for data visualization
- **Axios** - HTTP client for API requests
- **Socket.io-client** - Real-time bidirectional communication

### **Backend**
- **Node.js** - JavaScript runtime for server-side development
- **Express.js** - Fast, unopinionated web framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **Socket.io** - Real-time communication engine
- **JWT Auth** - JSON Web Token authentication
- **bcryptjs** - Password hashing for security

### **Deployment & Infrastructure**
- **Vercel** - Frontend deployment platform
- **Render** - Backend deployment and database hosting

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

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB Atlas account (or local MongoDB)
- Git for version control
- [Vercel](https://vercel.com/) and [Render](https://render.com/) accounts for deployment (optional)

### Installation & Setup

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/safeexpress.git
   cd safeexpress
   ```

2. **Backend Setup:**
   ```sh
   cd Backend
   npm install
   ```

   **Configure environment variables:**
   - Create a `.env` file in the Backend directory
   - Add the following variables:
     ```
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     ADMIN_SECRET_CODE=your_admin_registration_code
     PORT=3000
     ```

   **Start the backend server:**
   ```sh
   npm start
   ```
   The backend will run on `http://localhost:3000`

3. **Frontend Setup:**
   ```sh
   cd ../Frontend
   npm install
   ```

   **Configure environment variables:**
   - Create a `.env` file in the Frontend directory
   - Add the following variables:
     ```
     VITE_API_BASE_URL=http://localhost:3000/api
     VITE_SOCKET_URL=http://localhost:3000
     ```

   **Start the frontend development server:**
   ```sh
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

4. **Build for production:**
   ```sh
   npm run build
   ```
   The built files will be in the `dist/` directory.

## 📖 Usage Guide

### **For Administrators:**
1. Register as an Admin using the secret code
2. Access the admin dashboard to manage the fleet
3. Add and configure vehicles in the system
4. Create and assign delivery orders to drivers
5. Monitor real-time delivery status and analytics
6. Review reports on driver performance and vehicle utilization

### **For Drivers:**
1. Register as a Driver in the system
2. Log in to view your assigned deliveries
3. Update delivery status as you progress (picked up → in-transit → delivered)
4. Use the map interface for navigation and location updates
5. Communicate with customers through the platform

### **For Customers:**
1. Register as a Customer to access the portal
2. Place delivery requests through the services page
3. Track your orders in real-time on the interactive map
4. View delivery history and driver information
5. Receive notifications about delivery status updates

### **Public Access:**
- Visit the **Blog** for industry insights and company updates
- Access **Documentation** for user guides and best practices
- Explore the **API Reference** for integration possibilities
- Check **Careers** for job opportunities

## 🚀 Deployment

### **Frontend Deployment (Vercel):**
1. Connect your GitHub repository to Vercel
2. Set the root directory to `Frontend`
3. Configure environment variables:
   - `VITE_API_BASE_URL`: Your production API URL
   - `VITE_SOCKET_URL`: Your production Socket.io URL
4. Deploy automatically on push to main branch

### **Backend Deployment (Render):**
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the root directory to `Backend`
4. Configure environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Secure JWT secret key
   - `ADMIN_SECRET_CODE`: Admin registration code
   - `PORT`: 3000 (or Render's default)
5. Deploy and get your production URL

### **Environment Variables:**
```env
# Backend (.env)
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secure_jwt_secret
ADMIN_SECRET_CODE=your_admin_code
PORT=3000

# Frontend (.env)
VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
VITE_SOCKET_URL=https://your-backend-url.onrender.com
```

## 📄 API Documentation

SafeExpress provides a comprehensive REST API for integrating with third-party systems. The API includes endpoints for:

- **Authentication**: User login, registration, and token management
- **Deliveries**: CRUD operations for delivery management
- **Drivers**: Driver information and status management
- **Vehicles**: Fleet management and vehicle tracking
- **Analytics**: Real-time reporting and metrics

### **Base URL**
```
https://api.safeexpress.com/v1
```

### **Authentication**
All API requests require JWT authentication via Bearer token in the Authorization header.

### **Rate Limits**
- 1000 requests per hour for authenticated users
- 100 requests per hour for unauthenticated requests

For complete API documentation, visit: [API Reference](/api)

## 🤝 Contributing

We welcome contributions to SafeExpress! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Development Guidelines**
- Follow ESLint configuration for code quality
- Write comprehensive tests for new features
- Update documentation for API changes
- Ensure responsive design for all components

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🐛 Issues & Support

- **Bug Reports**: [GitHub Issues](https://github.com/your-username/safeexpress/issues)
- **Documentation**: Visit our [Documentation](/docs) page
- **Support**: Contact us through the [Contact](/contact) page

## 🙏 Acknowledgments

- Thanks to the open-source community for the amazing tools and libraries
- Special thanks to all contributors and beta testers
- Inspired by the growing demand for efficient logistics solutions

---

## 🧑‍💻 Author

**Kundena Akhil**
- Portfolio: [https://portfolio-nine-flax-29.vercel.app/](https://portfolio-nine-flax-29.vercel.app/)
- LinkedIn: [[My LinkedIn Profile](https://www.linkedin.com/in/kundena-akhil-4b7073170/)]
- Email: [akhilkundena@gmail.com]

---

<div align="center">

**Made with ❤️ for efficient logistics management**

⭐ Star this repo if you find it helpful!

</div>
