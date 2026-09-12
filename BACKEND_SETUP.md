# JG Impact Backend Setup - Complete Documentation

## 🎉 Backend System Successfully Implemented!

Your JG Impact website now has a complete backend system with:
- ✅ MongoDB database integration
- ✅ User authentication & admin login
- ✅ Appointment booking management
- ✅ Contact form submission
- ✅ Service management system
- ✅ Admin dashboard

---

## 📋 What's Been Set Up

### 1. **Database Connection**
- **File**: `lib/db.js`
- **Technology**: MongoDB with Mongoose ODM
- **Connection**: Managed through environment variables in `.env.local`

### 2. **Data Models**
Located in `lib/models/`:
- **User.js** - Admin users (email, password, role, isActive)
- **Booking.js** - Appointment bookings (name, email, phone, service, date, status)
- **Contact.js** - Contact form submissions (name, email, message, response)
- **Service.js** - Service listings (name, description, price, duration)

### 3. **API Routes**
Located in `src/app/api/`:

#### Authentication
- `POST /api/auth/login` - Admin login (returns JWT token)

#### Bookings
- `GET /api/bookings` - List all bookings (requires auth)
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/[id]` - Get single booking
- `PATCH /api/bookings/[id]` - Update booking status (requires auth)
- `DELETE /api/bookings/[id]` - Delete booking (requires auth)

#### Contacts
- `GET /api/contacts` - List all contact messages (requires auth)
- `POST /api/contacts` - Submit contact form
- `GET /api/contacts/[id]` - Get single message
- `PATCH /api/contacts/[id]` - Respond to message (requires auth)
- `DELETE /api/contacts/[id]` - Delete message (requires auth)

#### Services
- `GET /api/services` - Get all active services
- `POST /api/services` - Create service (requires auth)
- `GET /api/services/[id]` - Get single service
- `PATCH /api/services/[id]` - Update service (requires auth)
- `DELETE /api/services/[id]` - Delete service (requires auth)

### 4. **Admin Dashboard**
Located in `src/app/admin/`:

- `/admin` - Login page
- `/admin/dashboard` - Main dashboard with stats
- `/admin/bookings` - Booking management (view, update status, delete)
- `/admin/contacts` - Message management (view, respond, delete)
- `/admin/services` - Service management (add, edit, delete)

---

## 🚀 Quick Start Guide

### Step 1: Configure MongoDB
1. Go to `.env.local` and update:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ADMIN_EMAIL=admin@jgimpact.com
  ADMIN_PASSWORD=choose-a-strong-unique-password
   ```

2. Get MongoDB connection string from:
   - **MongoDB Atlas** (cloud): https://www.mongodb.com/cloud/atlas
   - **Local MongoDB**: `mongodb://localhost:27017/jg-impact`

### Step 2: Access Admin Dashboard
1. Go to `http://localhost:3000/admin`
2. Login with the `ADMIN_EMAIL` and `ADMIN_PASSWORD` values configured in your environment.

### Step 3: Test the System
1. Submit a contact form from the homepage
2. Submit a booking from the homepage
3. Check admin dashboard to see submissions

---

## 🔐 Security Considerations

1. **Use Unique Credentials**: Set a strong unique value for `ADMIN_PASSWORD`.
2. **Secure JWT Secret**: Use a strong random string for `JWT_SECRET`
3. **HTTPS Only**: In production, force HTTPS
4. **Environment Variables**: Never commit `.env.local` to git
5. **Add Rate Limiting**: Consider adding rate limiting to API endpoints
6. **CORS Configuration**: Update CORS settings for production domain

---

## 📝 Frontend Integration

### Booking Form
- **File**: `src/components/BookingModal.tsx`
- **Submits to**: `POST /api/bookings`
- **Data**: fullName, email, phone, serviceType, preferredDate, notes

### Contact Form
- **File**: `src/components/Contact.tsx`
- **Submits to**: `POST /api/contacts`
- **Data**: fullName, email, phone, subject, message

---

## 🔄 API Examples

### Submit Booking
```javascript
const response = await fetch('/api/bookings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '0703653555',
    serviceType: 'Mental Health Assessment & Counselling',
    preferredDate: '2026-09-15T10:00:00Z',
    notes: 'Optional notes'
  })
})
```

### Submit Contact Form
```javascript
const response = await fetch('/api/contacts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fullName: 'Jane Doe',
    email: 'jane@example.com',
    phone: '0702492050',
    subject: 'Inquiry about services',
    message: 'I would like to know more about...'
  })
})
```

### Admin Login
```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@jgimpact.com',
    password: process.env.ADMIN_PASSWORD
  })
})
const { token } = await response.json()
```

### Protected API Calls
```javascript
const response = await fetch('/api/bookings', {
  headers: { 'Authorization': `Bearer ${token}` }
})
```

---

## 📊 Database Schema

### User
```
{
  email: string (unique),
  password: string (hashed),
  role: 'admin' | 'staff',
  name: string,
  isActive: boolean,
  createdAt: date,
  updatedAt: date
}
```

### Booking
```
{
  fullName: string,
  email: string,
  phone: string,
  serviceType: string,
  preferredDate: date,
  notes: string,
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled',
  assignedTo: ObjectId (User),
  createdAt: date,
  updatedAt: date
}
```

### Contact
```
{
  fullName: string,
  email: string,
  phone: string,
  subject: string,
  message: string,
  status: 'new' | 'read' | 'responded',
  response: string,
  respondedBy: ObjectId (User),
  respondedAt: date,
  createdAt: date,
  updatedAt: date
}
```

### Service
```
{
  name: string,
  description: string,
  icon: string (emoji),
  image: string (URL),
  price: number,
  duration: string,
  isActive: boolean,
  order: number,
  createdAt: date,
  updatedAt: date
}
```

---

## 🛠️ Next Steps

1. **Connect Real Database**
   - Set up MongoDB Atlas account
   - Get connection string
   - Update `.env.local`

2. **Deploy to Production**
   - Deploy to Vercel (recommended for Next.js)
   - Set environment variables in hosting platform
   - Enable HTTPS

3. **Add More Admin Features**
   - User management
   - Email notifications
   - SMS notifications
   - Reporting/Analytics

4. **Enhance Security**
   - Add 2FA for admin login
   - Implement rate limiting
   - Add request validation
   - Add logging/audit trail

---

## 🐛 Troubleshooting

### "Cannot find module 'mongoose'"
Solution: Run `npm install mongoose bcryptjs jsonwebtoken dotenv`

### "MongoDB connection failed"
Solution: Check `.env.local` MONGODB_URI is correct and MongoDB service is running

### "Login returns 401 Unauthorized"
Solution: Make sure admin user exists in database. You may need to seed initial data.

### "API returns 405 Method Not Allowed"
Solution: Make sure you're using correct HTTP method (GET, POST, PATCH, DELETE)

---

## 📚 Useful Resources

- MongoDB Documentation: https://docs.mongodb.com/
- Mongoose Docs: https://mongoosejs.com/
- Next.js API Routes: https://nextjs.org/docs/api-routes/introduction
- JWT Guide: https://jwt.io/

---

## ✨ Your Backend is Ready!

The admin dashboard is now accessible at: **http://localhost:3000/admin**

All forms on your website now send data to the backend API. Check the admin dashboard to see submissions!
