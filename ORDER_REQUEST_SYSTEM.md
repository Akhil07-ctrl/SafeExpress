# Order Request System - Implementation Summary

## Overview
A comprehensive order request system has been implemented that allows customers to request deliveries, which admins can approve or reject. The system includes real-time notifications and status tracking across all user roles.

---

## Backend Implementation

### 1. New Model: OrderRequest
**File:** `Backend/models/orderRequest.js`

**Schema Fields:**
- `customerId` - Reference to User model
- `customerName` - Customer's name
- `customerMobile` - 10-digit mobile number
- `pickupLocation` & `dropLocation` - Address strings
- `pickupCords` & `dropCords` - Latitude/Longitude coordinates
- `vehicleType` - Enum: truck, van, bike
- `pickupTime` & `dropTime` - Scheduled times
- `status` - Enum: pending, approved, rejected
- `deliveryId` - Reference to created Delivery (when approved)
- `rejectionReason` - Admin's reason for rejection

### 2. New Controller: orderRequestControllers.js
**File:** `Backend/controllers/orderRequestControllers.js`

**Endpoints:**
- `createOrderRequest` - Customer creates new order request
- `getAllOrderRequests` - Admin fetches all requests (with status filter)
- `getMyOrderRequests` - Customer fetches their own requests
- `approveOrderRequest` - Admin approves and creates delivery
- `rejectOrderRequest` - Admin rejects with reason
- `getPendingCount` - Get count of pending requests

**Features:**
- Validates scheduling conflicts for drivers and vehicles
- Automatically creates delivery when approved
- Updates vehicle status to "assigned"
- Emits Socket.IO events for real-time updates

### 3. New Routes: orderRequestRoutes.js
**File:** `Backend/routes/orderRequestRoutes.js`

**API Endpoints:**
```
POST   /api/order-requests              - Create order request (Customer)
GET    /api/order-requests/my           - Get my requests (Customer)
GET    /api/order-requests              - Get all requests (Admin)
GET    /api/order-requests/pending/count - Get pending count (Admin)
POST   /api/order-requests/:id/approve  - Approve request (Admin)
POST   /api/order-requests/:id/reject   - Reject request (Admin)
```

### 4. Socket.IO Integration
**File:** `Backend/index.js`

**New Socket Events:**
- `joinOrderRequests` - Admin joins notification room
- `orderRequestCreated` - Emitted when customer creates request
- `orderRequestStatusChanged` - Emitted when admin approves/rejects

---

## Frontend Implementation

### 1. Order Request Form Component
**File:** `Frontend/src/components/OrderRequestForm.jsx`

**Features:**
- Modal-based form with comprehensive validation
- Fields: customer name, mobile, pickup/drop locations, coordinates, vehicle type, times
- Real-time form validation
- Success callback to refresh parent component
- Integrated with customer dashboard

### 2. Order Requests Notification Component
**File:** `Frontend/src/components/OrderRequestsNotification.jsx`

**Features:**
- Bell icon with badge showing pending count
- Dropdown showing latest 5 pending requests
- Real-time updates via Socket.IO
- Link to full admin order requests page
- Auto-refresh on new requests or status changes

### 3. Admin Order Requests Management Page
**File:** `Frontend/src/pages/adminOrderRequests.jsx`

**Features:**
- Tabbed interface: Pending / Approved / Rejected
- Comprehensive table view with all request details
- Review modal for pending requests
- Driver and vehicle assignment dropdowns
- Approve with resource assignment
- Reject with reason input
- Real-time updates
- Conflict detection for scheduling

### 4. Customer Order Requests History Page
**File:** `Frontend/src/pages/customerOrderRequests.jsx`

**Features:**
- View all order requests submitted
- Status badges (pending/approved/rejected)
- Rejection reasons displayed
- Link to created delivery (when approved)
- Sortable table view

### 5. Updated Components

#### Customer Dashboard
**File:** `Frontend/src/pages/customerDashboard.jsx`
- Added "Request New Order" button in header
- Integrated OrderRequestForm component
- Auto-refresh deliveries after request submission

#### Navbar
**File:** `Frontend/src/components/layout/navbar.jsx`
- Added OrderRequestsNotification for admins
- Added "My Requests" link for customers
- Role-based navigation items

#### App Routes
**File:** `Frontend/src/routes/appRoutes.jsx`
- Added `/admin/order-requests` route
- Added `/customer/order-requests` route
- Protected with role-based authentication

---

## Workflow

### Customer Workflow:
1. Customer logs in and navigates to dashboard
2. Clicks "Request New Order" button
3. Fills out order request form with:
   - Customer name and mobile
   - Pickup and drop locations with coordinates
   - Vehicle type preference
   - Pickup and drop times
4. Submits request
5. Request appears in "My Requests" page with "pending" status
6. Receives real-time updates when admin processes request
7. If approved: Delivery is created and appears in "All Deliveries"
8. If rejected: Rejection reason is displayed

### Admin Workflow:
1. Admin receives real-time notification (bell icon with badge)
2. Clicks notification to see pending requests preview
3. Clicks "View All Requests" or navigates to Order Requests page
4. Reviews request details in modal
5. Option A - Approve:
   - Selects appropriate driver from dropdown
   - Selects appropriate vehicle (filtered by type)
   - System validates no scheduling conflicts
   - Clicks "Approve & Create Delivery"
   - Delivery is automatically created
6. Option B - Reject:
   - Enters rejection reason
   - Clicks "Reject Request"
7. Customer receives real-time status update

### Driver Workflow:
- Drivers see newly created deliveries in their dashboard
- Status updates reflect in real-time across all dashboards
- Location tracking continues as normal

---

## Real-time Features

### Socket.IO Events:
1. **orderRequestCreated**
   - Triggered: When customer submits request
   - Listeners: Admin notification component
   - Action: Updates pending count, refreshes list

2. **orderRequestStatusChanged**
   - Triggered: When admin approves/rejects
   - Listeners: Admin notification, customer pages
   - Action: Updates status, refreshes lists

3. **Existing Events** (unchanged):
   - `driverLocation` - Driver location updates
   - `locationUpdate` - Broadcast to customers
   - `joinDelivery` - Customer joins delivery room
   - `customerLocation` - Customer location updates

---

## Database Schema

### OrderRequest Collection:
```javascript
{
  _id: ObjectId,
  customerId: ObjectId (ref: User),
  customerName: String,
  customerMobile: String,
  pickupLocation: String,
  dropLocation: String,
  pickupCords: { lat: Number, lng: Number },
  dropCords: { lat: Number, lng: Number },
  vehicleType: String (enum),
  pickupTime: Date,
  dropTime: Date,
  status: String (enum),
  deliveryId: ObjectId (ref: Delivery),
  rejectionReason: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## API Request/Response Examples

### Create Order Request
```http
POST /api/order-requests
Authorization: Bearer <customer-token>
Content-Type: application/json

{
  "customerName": "John Doe",
  "customerMobile": "1234567890",
  "pickupLocation": "123 Main St, City",
  "dropLocation": "456 Oak Ave, City",
  "pickupCords": { "lat": 40.7128, "lng": -74.0060 },
  "dropCords": { "lat": 40.7580, "lng": -73.9855 },
  "vehicleType": "truck",
  "pickupTime": "2025-10-06T10:00:00",
  "dropTime": "2025-10-06T14:00:00"
}

Response: 201 Created
{
  "_id": "...",
  "customerId": "...",
  "status": "pending",
  ...
}
```

### Approve Order Request
```http
POST /api/order-requests/:id/approve
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "assignedDriver": "driver-id",
  "assignedVehicle": "vehicle-id"
}

Response: 200 OK
{
  "_id": "...",
  "status": "approved",
  "deliveryId": "...",
  ...
}
```

---

## Testing Checklist

### Backend:
- [x] Order request creation with validation
- [x] Scheduling conflict detection
- [x] Admin approval creates delivery
- [x] Admin rejection with reason
- [x] Socket.IO events emitted correctly
- [x] Role-based authorization

### Frontend:
- [x] Customer can submit order requests
- [x] Form validation works correctly
- [x] Admin receives real-time notifications
- [x] Admin can approve/reject requests
- [x] Customer sees status updates
- [x] Navigation links work correctly
- [x] Real-time updates via Socket.IO

### Integration:
- [x] Order status reflects across all dashboards
- [x] Deliveries created from approved requests
- [x] Driver receives new deliveries
- [x] Customer can track approved deliveries
- [x] Vehicle status updates correctly

---

## Future Enhancements

1. **Email Notifications**
   - Send email when request is approved/rejected
   - Send email to driver when delivery is assigned

2. **Push Notifications**
   - Browser push notifications for admins
   - Mobile push for customers

3. **Advanced Filtering**
   - Filter by date range
   - Filter by vehicle type
   - Search by customer name

4. **Analytics Dashboard**
   - Request approval rate
   - Average response time
   - Popular routes

5. **Bulk Operations**
   - Approve multiple requests at once
   - Export requests to CSV

6. **Customer Feedback**
   - Rating system for completed deliveries
   - Feedback on rejection reasons

---

## Files Modified/Created

### Backend:
- ✅ Created: `models/orderRequest.js`
- ✅ Created: `controllers/orderRequestControllers.js`
- ✅ Created: `routes/orderRequestRoutes.js`
- ✅ Modified: `index.js` (added routes and Socket.IO events)

### Frontend:
- ✅ Created: `components/OrderRequestForm.jsx`
- ✅ Created: `components/OrderRequestsNotification.jsx`
- ✅ Created: `pages/adminOrderRequests.jsx`
- ✅ Created: `pages/customerOrderRequests.jsx`
- ✅ Modified: `components/layout/navbar.jsx`
- ✅ Modified: `pages/customerDashboard.jsx`
- ✅ Modified: `routes/appRoutes.jsx`

---

## Deployment Notes

1. **Environment Variables**: No new environment variables required
2. **Database Migration**: New collection will be created automatically
3. **Dependencies**: All dependencies already present (Socket.IO, Mongoose, etc.)
4. **Backward Compatibility**: Existing features remain unchanged
5. **Testing**: Test with different user roles before production deployment

---

## Support & Maintenance

### Common Issues:
1. **Socket.IO not connecting**: Check VITE_SOCKET_URL environment variable
2. **Notifications not appearing**: Ensure admin has joined orderRequests room
3. **Approval fails**: Check for scheduling conflicts in logs

### Monitoring:
- Monitor pending request count
- Track approval/rejection rates
- Monitor Socket.IO connection health
- Check for scheduling conflict errors

---

**Implementation Date:** October 5, 2025
**Version:** 1.0.0
**Status:** ✅ Complete and Ready for Testing
