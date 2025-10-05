# Order Request System - Testing Guide

## Quick Start Testing

### Prerequisites
1. Backend server running on port 3000
2. Frontend running on development server
3. MongoDB connected
4. At least one user of each role: admin, driver, customer

---

## Test Scenario 1: Customer Creates Order Request

### Steps:
1. **Login as Customer**
   - Navigate to `/login`
   - Use customer credentials
   - Should redirect to `/customer/dashboard`

2. **Create Order Request**
   - Click "Request New Order" button (top right)
   - Fill in the form:
     ```
     Customer Name: John Doe
     Mobile: 1234567890
     Pickup Location: 123 Main St, New York
     Pickup Lat: 40.7128
     Pickup Lng: -74.0060
     Drop Location: 456 Oak Ave, New York
     Drop Lat: 40.7580
     Drop Lng: -73.9855
     Vehicle Type: Truck
     Pickup Time: [Select future date/time]
     Drop Time: [Select future date/time after pickup]
     ```
   - Click "Submit Request"
   - Should see success toast
   - Modal should close

3. **View Request Status**
   - Click "My Requests" in navbar
   - Should see the request with "pending" status
   - Note the request details

### Expected Results:
- ✅ Form validates all fields
- ✅ Success message appears
- ✅ Request appears in "My Requests" with pending status
- ✅ Request timestamp is correct

---

## Test Scenario 2: Admin Receives Real-time Notification

### Steps:
1. **Login as Admin** (in different browser/incognito)
   - Navigate to `/login`
   - Use admin credentials
   - Should redirect to `/admin/dashboard`

2. **Check Notification**
   - Look at navbar - bell icon should show badge with count "1"
   - Click bell icon
   - Should see dropdown with the pending request
   - Request details should match what customer submitted

3. **Navigate to Full Page**
   - Click "View All Requests" in dropdown
   - Should navigate to `/admin/order-requests`
   - Should see the request in "Pending" tab

### Expected Results:
- ✅ Bell icon shows correct count
- ✅ Dropdown displays request preview
- ✅ Full page shows complete request details
- ✅ Real-time update occurred (no page refresh needed)

---

## Test Scenario 3: Admin Approves Order Request

### Steps:
1. **Review Request**
   - On `/admin/order-requests` page
   - Click "Review" button for the pending request
   - Modal should open with full details

2. **Assign Resources**
   - Select a driver from dropdown
   - Select a vehicle from dropdown (should only show trucks)
   - Verify vehicle type matches request

3. **Approve Request**
   - Click "Approve & Create Delivery"
   - Should see success toast
   - Modal should close
   - Request should move to "Approved" tab

4. **Verify Delivery Created**
   - Navigate to `/admin/dashboard`
   - Should see new delivery in deliveries list
   - Delivery details should match order request

### Expected Results:
- ✅ Driver and vehicle dropdowns populate correctly
- ✅ Vehicle dropdown filters by type
- ✅ Approval succeeds
- ✅ Delivery is created automatically
- ✅ Request status changes to "approved"
- ✅ Vehicle status changes to "assigned"

---

## Test Scenario 4: Customer Sees Approved Status

### Steps:
1. **Switch to Customer Browser**
   - Should still be logged in
   - Navigate to "My Requests" page

2. **Check Status Update**
   - Request should now show "approved" status (green badge)
   - Should show "Delivery Created" message
   - Real-time update should have occurred

3. **View Delivery**
   - Navigate back to dashboard
   - Should see new delivery in "All Deliveries" section
   - Delivery should show "pending" status initially

### Expected Results:
- ✅ Status updated in real-time (no refresh needed)
- ✅ Delivery appears in customer dashboard
- ✅ All details match the original request

---

## Test Scenario 5: Driver Receives Delivery

### Steps:
1. **Login as Driver** (the one assigned)
   - Navigate to `/login`
   - Use driver credentials
   - Should redirect to `/driver/dashboard`

2. **Check Deliveries**
   - Should see the new delivery in "Latest Delivery" section
   - Should see it in "All Deliveries" table
   - Status should be "pending"

3. **Start Delivery**
   - Click "Start Delivery" button
   - Status should change to "on route"
   - Map should show driver's location

### Expected Results:
- ✅ Driver sees assigned delivery
- ✅ Can update status to "on route"
- ✅ Location tracking works
- ✅ Customer sees real-time location updates

---

## Test Scenario 6: Admin Rejects Order Request

### Steps:
1. **Create Another Request** (as customer)
   - Submit a new order request
   - Different details from first one

2. **Admin Reviews** (as admin)
   - See notification update to "2"
   - Click notification, see new request
   - Click "View All Requests"
   - Click "Review" on new request

3. **Reject Request**
   - Enter rejection reason: "Vehicle not available for selected time"
   - Click "Reject Request"
   - Should see success toast
   - Request moves to "Rejected" tab

4. **Customer Sees Rejection** (as customer)
   - Navigate to "My Requests"
   - Should see request with "rejected" status (red badge)
   - Should see rejection reason displayed

### Expected Results:
- ✅ Rejection succeeds
- ✅ Reason is saved and displayed
- ✅ Customer receives real-time update
- ✅ No delivery is created
- ✅ Pending count decreases

---

## Test Scenario 7: Scheduling Conflict Detection

### Steps:
1. **Note Existing Delivery Times**
   - Check an existing delivery's pickup and drop times
   - Note the assigned driver and vehicle

2. **Create Conflicting Request** (as customer)
   - Create request with overlapping time range
   - Submit request

3. **Admin Attempts Approval** (as admin)
   - Review the new request
   - Try to assign the SAME driver and vehicle
   - Click "Approve & Create Delivery"

### Expected Results:
- ✅ Error message: "Driver has a scheduling conflict" OR
- ✅ Error message: "Vehicle has a scheduling conflict"
- ✅ Request remains pending
- ✅ No delivery is created

---

## Test Scenario 8: Real-time Notification Updates

### Steps:
1. **Open Two Admin Windows**
   - Window A: Admin logged in, on order requests page
   - Window B: Admin logged in, on dashboard

2. **Customer Creates Request**
   - In customer window, submit new request

3. **Check Both Admin Windows**
   - Both should show updated notification count
   - No page refresh needed
   - Bell badge updates automatically

### Expected Results:
- ✅ Both windows receive Socket.IO event
- ✅ Notification count updates in real-time
- ✅ Pending requests list updates automatically

---

## Test Scenario 9: Filter and Navigation

### Steps:
1. **Admin Order Requests Page**
   - Click "Pending" tab - should show only pending
   - Click "Approved" tab - should show only approved
   - Click "Rejected" tab - should show only rejected

2. **Customer My Requests Page**
   - Should show all requests regardless of status
   - Status badges should be color-coded correctly

### Expected Results:
- ✅ Filters work correctly
- ✅ Data loads without errors
- ✅ Status badges display correctly
- ✅ Table is responsive

---

## Edge Cases to Test

### 1. Empty States
- [ ] No pending requests (admin notification)
- [ ] No order requests (customer page)
- [ ] No drivers available
- [ ] No vehicles of requested type

### 2. Validation
- [ ] Invalid mobile number (not 10 digits)
- [ ] Invalid coordinates (non-numeric)
- [ ] Pickup time in the past
- [ ] Drop time before pickup time
- [ ] Missing required fields

### 3. Permissions
- [ ] Customer cannot access admin routes
- [ ] Driver cannot access order requests
- [ ] Unauthenticated user redirected to login

### 4. Network Issues
- [ ] Socket.IO disconnection handling
- [ ] API request failures
- [ ] Timeout scenarios

---

## Performance Testing

### Load Testing:
1. Create 50+ order requests
2. Check page load times
3. Verify pagination (if implemented)
4. Check Socket.IO performance with multiple connections

### Stress Testing:
1. Multiple customers creating requests simultaneously
2. Admin approving multiple requests quickly
3. Real-time updates with 10+ connected clients

---

## Browser Compatibility

Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

## Mobile Responsiveness

Test on:
- [ ] Mobile phone (portrait)
- [ ] Mobile phone (landscape)
- [ ] Tablet (portrait)
- [ ] Tablet (landscape)

---

## Debugging Tips

### Backend Logs:
```bash
# Check for Socket.IO connections
"New client connected: <socket-id>"
"Admin joined order requests room"

# Check for order request creation
"Order request created: <request-id>"

# Check for Socket.IO events
"Emitting orderRequestCreated event"
```

### Frontend Console:
```javascript
// Check Socket.IO connection
socket.connected // should be true

// Check for event listeners
socket.listeners('orderRequestCreated') // should show function
```

### Common Issues:
1. **Notifications not appearing**: Check if admin joined orderRequests room
2. **Real-time updates not working**: Verify Socket.IO connection
3. **Approval fails**: Check backend logs for scheduling conflicts
4. **Form validation errors**: Check browser console for details

---

## Test Data Examples

### Valid Order Request:
```json
{
  "customerName": "Jane Smith",
  "customerMobile": "9876543210",
  "pickupLocation": "789 Pine St, Boston",
  "dropLocation": "321 Elm St, Boston",
  "pickupCords": { "lat": 42.3601, "lng": -71.0589 },
  "dropCords": { "lat": 42.3736, "lng": -71.1097 },
  "vehicleType": "van",
  "pickupTime": "2025-10-07T09:00:00",
  "dropTime": "2025-10-07T12:00:00"
}
```

### Invalid Order Request (for testing validation):
```json
{
  "customerName": "",  // Empty name
  "customerMobile": "123",  // Invalid mobile
  "pickupLocation": "Test",
  "dropLocation": "Test",
  "pickupCords": { "lat": "invalid", "lng": "invalid" },  // Invalid coords
  "dropCords": { "lat": 40.7580, "lng": -73.9855 },
  "vehicleType": "truck",
  "pickupTime": "2025-10-01T09:00:00",  // Past date
  "dropTime": "2025-10-01T08:00:00"  // Before pickup
}
```

---

## Success Criteria

All tests pass when:
- ✅ Customers can create order requests
- ✅ Admins receive real-time notifications
- ✅ Admins can approve/reject requests
- ✅ Deliveries are created automatically on approval
- ✅ Status updates reflect across all dashboards in real-time
- ✅ Scheduling conflicts are detected and prevented
- ✅ All validations work correctly
- ✅ UI is responsive and user-friendly
- ✅ No console errors
- ✅ Socket.IO events work reliably

---

**Happy Testing! 🚀**
