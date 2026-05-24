# 🎯 AUCTIONZ Backend System

Production-grade Node.js + Express application demonstrating modern backend development patterns, best practices, and advanced features.

## 📋 Table of Contents

- [Features Implemented](#features-implemented)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Running the Project](#running-the-project)
- [API Documentation](#api-documentation)
- [Architecture & Design Patterns](#architecture--design-patterns)
- [Key Concepts Explained](#key-concepts-explained)

---

## ✨ Features Implemented

### 1. **Middleware & Lifecycle**
- ✅ Application-level middleware (request logging, CORS)
- ✅ Router-level middleware (validation)
- ✅ Error-handling middleware (global error handler)
- ✅ Third-party middleware (body-parser, express.json, morgan)
- ✅ Request flow documentation with timing

### 2. **Template Engine (SSR vs CSR)**
- ✅ EJS template engine setup
- ✅ Server-Side Rendering (SSR) for `/dashboard` and `/auth/login`
- ✅ Client-Side Rendering (CSR) comparison in code
- ✅ Dynamic data passing to templates
- ✅ Complete explanation of SSR advantages

### 3. **Database (MongoDB + Mongoose)**
- ✅ MongoDB connection with Mongoose ORM
- ✅ User model with validation and indexing
- ✅ Auction model with relationships
- ✅ Bid model for auction bidding
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Async/await implementation
- ✅ Database hooks/middleware (pre-save password hashing)

### 4. **Session Management**
- ✅ Express-session configuration
- ✅ MongoDB session store (connect-mongo)
- ✅ Session cookies with security settings
- ✅ Automatic session cleanup

### 5. **Authentication & Security**
- ✅ User signup with validation
- ✅ User login with credential verification
- ✅ Password hashing using bcrypt (automatic in model)
- ✅ JWT token generation on login
- ✅ JWT token verification middleware
- ✅ Protected routes using JWT
- ✅ Token expiry handling
- ✅ Error handling for invalid/expired tokens

### 6. **Real-Time Communication (Socket.io)**
- ✅ Socket.io setup with Express server
- ✅ Live chat functionality
- ✅ User connection tracking
- ✅ Message broadcasting to all clients
- ✅ User count updates
- ✅ Disconnect handling
- ✅ Full-duplex communication demonstration

### 7. **Project Organization**
```
✅ routes/           - Route definitions (auth, auctions, API)
✅ controllers/      - Business logic (auth, auction operations)
✅ models/           - MongoDB schemas (User, Auction, Bid)
✅ middleware/       - Custom middleware (auth, validation, logging)
✅ config/           - Configuration files (database, constants)
✅ views/            - EJS templates (auth, dashboard)
✅ public/           - Static files (existing frontend)
```

### 8. **Best Practices**
- ✅ Environment variables (.env configuration)
- ✅ Comprehensive error handling
- ✅ Input validation with express-validator
- ✅ Secure password storage (bcrypt)
- ✅ JWT secret management
- ✅ CORS configuration
- ✅ Request logging
- ✅ Clean code with comments
- ✅ Graceful shutdown handling

---

## 📁 Project Structure

```
auctionz-backend/
│
├── 📄 server.js                    # Main server file with middleware setup
├── 📄 package.json                 # Dependencies & scripts
├── 📄 .env                         # Environment variables (create this)
├── 📄 .env.example                 # Environment variables template
│
├── 📁 config/
│   ├── database.js                 # MongoDB connection
│   └── constants.js                # App constants and error messages
│
├── 📁 middleware/
│   ├── logger.js                   # Request logging middleware
│   ├── errorHandler.js             # Global error handler
│   ├── authMiddleware.js           # JWT verification
│   ├── sessionMiddleware.js        # Session configuration
│   └── validationMiddleware.js     # Input validation
│
├── 📁 models/
│   ├── User.js                     # User schema with password hashing
│   ├── Auction.js                  # Auction schema
│   └── Bid.js                      # Bid schema
│
├── 📁 controllers/
│   ├── authController.js           # Auth logic (signup, login)
│   └── auctionController.js        # Auction operations
│
├── 📁 routes/
│   ├── authRoutes.js               # Authentication API routes
│   ├── auctionRoutes.js            # Auction API routes
│   └── apiRoutes.js                # API route index
│
├── 📁 views/
│   ├── auth.ejs                    # Login/Signup page (SSR)
│   └── dashboard.ejs               # Dashboard page (SSR)
│
└── 📁 Public/                      # Static frontend files (existing)
    ├── Auctionz.HTML
    ├── auctionz.css
    ├── auctionz.js
    └── ...
```

---

## 🚀 Installation & Setup

### Step 1: Prerequisites
Ensure you have installed:
- **Node.js** (v16+) - [Download](https://nodejs.org)
- **MongoDB** (v4.4+) - [Download](https://www.mongodb.com/try/download/community)
  - OR use **MongoDB Atlas** (cloud): [Sign up free](https://www.mongodb.com/cloud/atlas)

### Step 2: Install Dependencies

```bash
# Navigate to project directory
cd auctionz-backend

# Install all dependencies
npm install

# Verify installation
npm list express mongoose bcryptjs jsonwebtoken dotenv
```

**Dependencies installed:**
- `express` - Web framework
- `mongoose` - MongoDB ORM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT generation
- `dotenv` - Environment variables
- `express-session` - Session management
- `connect-mongo` - MongoDB session store
- `ejs` - Template engine
- `socket.io` - Real-time communication
- `cors` - Cross-Origin Resource Sharing
- `morgan` - HTTP logging
- `express-validator` - Input validation

### Step 3: Configure Environment

**Create `.env` file** (copy from `.env.example`):

```bash
# Copy template
cp .env.example .env

# Edit .env with your values
```

**Edit `.env` file:**

```env
NODE_ENV=development
PORT=3000

# MongoDB - For local MongoDB
MONGO_URI=mongodb://localhost:27017/auctionz

# MongoDB Atlas - For cloud (replace with your credentials)
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/auctionz

JWT_SECRET=your_super_secret_jwt_key_change_this_12345
JWT_EXPIRE_IN=7d

SESSION_SECRET=your_super_secret_session_key_12345

CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=debug
```

### Step 4: Setup MongoDB

**Option A: Local MongoDB**
```bash
# Start MongoDB service
# Windows: 
mongod

# macOS: 
brew services start mongodb-community

# Linux:
sudo service mongod start
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string
4. Update `MONGO_URI` in `.env`

---

## ▶️ Running the Project

### Start Development Server

```bash
# Development mode (with auto-reload)
npm run dev

# OR Production mode
npm start
```

**Expected Output:**
```
📦 Initializing Application...

✅ MongoDB connected successfully: localhost
📊 Database: auctionz

✅ Server running on http://localhost:3000
🌍 Environment: development
📊 Socket.io ready on ws://localhost:3000

📖 API Documentation:
   - Signup: POST /api/auth/signup
   - Login: POST /api/auth/login
   - Dashboard: GET /dashboard
   - Auth Page: GET /auth/login
```

### Access the Application

- **Frontend**: http://localhost:3000
- **Auth Page**: http://localhost:3000/auth/login
- **Dashboard**: http://localhost:3000/dashboard
- **API Base**: http://localhost:3000/api

---

## 📡 API Documentation

### Authentication Endpoints

#### 1. Signup (Create Account)
```http
POST /api/auth/signup
Content-Type: application/json

{
  "fullName": "John Doe",
  "username": "john_doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Signup successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "fullName": "John Doe"
  }
}
```

#### 2. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "username": "john_doe",
    "lastLogin": "2024-01-15T10:30:00.000Z"
  }
}
```

#### 3. Get Current User (Protected)
```http
GET /api/auth/me
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "fullName": "John Doe",
    "role": "user"
  }
}
```

### Auction Endpoints

#### 1. Get All Auctions
```http
GET /api/auctions?page=1&limit=10&category=Electronics&status=active
```

**Response:**
```json
{
  "success": true,
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  },
  "auctions": [...]
}
```

#### 2. Create Auction (Protected)
```http
POST /api/auctions
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "title": "Vintage Camera",
  "description": "Rare 1990s camera in excellent condition",
  "category": "Electronics",
  "startingPrice": 50,
  "startTime": "2024-01-16T10:00:00Z",
  "endTime": "2024-01-23T10:00:00Z",
  "condition": "like-new",
  "location": "New York, NY",
  "images": ["url1", "url2"]
}
```

#### 3. Get Single Auction
```http
GET /api/auctions/{auctionId}
```

#### 4. Update Auction (Protected)
```http
PUT /api/auctions/{auctionId}
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description"
}
```

#### 5. Delete Auction (Protected)
```http
DELETE /api/auctions/{auctionId}
Authorization: Bearer {jwt_token}
```

### Test Routes

#### Protected Route Test
```http
GET /api/protected
Authorization: Bearer {jwt_token}
```

**Response shows:**
- User ID from token
- Email from token
- How JWT protection works

#### Blocking vs Non-blocking
```http
GET /api/blocking-demo      # Blocks all requests
GET /api/non-blocking-demo  # Doesn't block other requests
```

---

## 🏗️ Architecture & Design Patterns

### 1. **Middleware Pipeline**
```
Request
   ↓
[Request Logger] - Log every request
   ↓
[CORS] - Handle cross-origin requests
   ↓
[Body Parser] - Parse JSON/form data
   ↓
[Session] - Manage user sessions
   ↓
[Static Files] - Serve CSS, JS, images
   ↓
[Routes] - Route to appropriate handler
   ├─ Auth Routes
   ├─ Auction Routes
   └─ Utility Routes
   ↓
[404 Handler] - Handle unknown routes
   ↓
[Error Handler] - Catch all errors
   ↓
Response to Client
```

### 2. **MVC Architecture**
```
          Route
            ↓
     [Middleware Layer]
            ↓
      Controller
    (Business Logic)
            ↓
     Model (Database)
    (Mongoose Schemas)
            ↓
       Response
```

### 3. **Authentication Flow**
```
Client                    Server
  │                         │
  ├─ POST /signup          │
  ├────────────────────→   │
  │                  [Validation]
  │                  [Hash Password]
  │                  [Create User]
  │              Token ← JWT.sign()
  │  ←─────────────────────┤
  │      {token}           │
  │                         │
  ├─ Store token (localStorage)
  │                         │
  ├─ GET /protected        │
  ├─ Header: Authorization: Bearer {token}
  ├────────────────────→   │
  │                  [Verify Token]
  │                  [Decode JWT]
  │                  [Get User Data]
  │  ←─────────────────────┤
  │    {user data}         │
```

### 4. **Real-Time Socket.io Flow**
```
Client                    Server
  │
  ├─ Establishes WebSocket
  ├──────library.io/socket.io────→  io.on('connection')
  │  ←─ Socket ID assigned ──────┤
  │
  ├─ socket.emit('sendMessage')
  ├──────────────────────→ socket.on('sendMessage')
  │
  │                          io.emit('chatMessage')
  │  ←─All clients receive───┤
  │     broadcast
```

---

## 📚 Key Concepts Explained

### 1. **SSR vs CSR**

**Server-Side Rendering (SSR) - This Project:**
- ✅ Server generates complete HTML with data
- ✅ Browser receives ready-to-display HTML
- ✅ Faster initial page load
- ✅ Better for SEO
- ✅ Example: `/dashboard`, `/auth/login`

**Client-Side Rendering (CSR) - React/Vue:**
- ✅ Server sends blank HTML + JavaScript
- ✅ Browser runs JavaScript to render content
- ✅ Better for interactive experiences
- ⚠️ Slower initial load
- ⚠️ Requires JavaScript enabled

### 2. **Blocking vs Non-Blocking**

**Blocking Code (BAD):**
```javascript
// Heavy calculation blocks entire server
for (let i = 0; i < 1000000000; i++) {
  sum += i; // All other requests wait!
}
```

**Non-Blocking Code (GOOD):**
```javascript
// Schedule work asynchronously
setTimeout(() => {
  // Other requests continue while this runs
  heavyCalculation();
}, 0);
```

### 3. **JWT vs Sessions**

| Feature | JWT | Sessions |
|---------|-----|----------|
| Storage | Client (localStorage) | Server (MongoDB) |
| Stateless | Yes | No |
| Scalability | Better (no server storage) | Limited |
| Security | Revocation hard | Easy revocation |
| Size | Larger | Small |
| Best For | APIs, SPAs | Web apps |

### 4. **Password Security with Bcrypt**

```javascript
// Before (INSECURE):
user.password = plainPassword;  // ❌ Storing plain text!

// After (SECURE):
user.password = await bcrypt.hash(plainPassword, 10);
// Stores: $2b$10$N9qo8uLOiekgx8FvzgS5O... (hash)

// Verification:
const isValid = await bcrypt.compare(input, hash);
// Returns true/false
```

### 5. **Error Handling**

```javascript
// Controller throws or sends error
async function createAuction(req, res, next) {
  try {
    // ...
  } catch (error) {
    next(error);  // Pass to error handler
  }
}

// Global error handler catches ALL errors
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: err.message
  });
});
```

---

## 🔧 Common Tasks

### Reset Database
```bash
# Remove all data (CAREFUL!)
# In MongoDB shell:
db.users.deleteMany({})
db.auctions.deleteMany({})
db.bids.deleteMany({})
```

### Add Admin User
```javascript
// In Node.js shell:
const User = require('./models/User');

const admin = new User({
  fullName: 'Admin User',
  email: 'admin@example.com',
  username: 'admin',
  password: 'Admin@1234',
  role: 'admin'
});

await admin.save();
console.log('Admin created!');
```

### View Logs
```bash
# Real-time logs
tail -f logs/server.log

# Last 100 lines
tail -100 logs/server.log
```

---

## 🐛 Troubleshooting

### MongoDB Connection Failed
```
❌ MongoDB connection failed: connect ECONNREFUSED

Solution:
1. Ensure MongoDB is running: mongod
2. Check MONGO_URI in .env
3. For Atlas: Allow your IP in network settings
```

### JWT Not Working
```
Error: Token not provided

Solution:
1. Ensure token is in Authorization header
2. Format: "Bearer {token}"
3. Token not expired?
```

### Socket.io Not Connecting
```
WebSocket connection failed

Solution:
1. Check PORT is correct
2. Ensure CORS_ORIGIN matches client
3. Check browser console for errors
```

---

## 📖 Learning Resources

- **Express.js**: https://expressjs.com
- **Mongoose**: https://mongoosejs.com
- **JWT**: https://jwt.io
- **Socket.io**: https://socket.io
- **Bcrypt**: Use for password hashing (documentation built-in)
- **EJS**: https://ejs.co

---

## ✅ Testing the API

### Using cURL

```bash
# Signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName":"John Doe",
    "username":"john_doe",
    "email":"john@example.com",
    "password":"Password123"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"john@example.com",
    "password":"Password123"
  }'

# Get Protected Route
curl -X GET http://localhost:3000/api/protected \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman

1. **Open Postman**
2. **Create Collection**: "AUCTIONZ API"
3. **Create Requests**:
   - `POST /api/auth/signup`
   - `POST /api/auth/login`
   - `GET /api/protected`

**Save token** from login response in Postman variable:
```
{{token}}
```

Use in headers:
```
Authorization: Bearer {{token}}
```

---

## 📝 Environment Variables Reference

```env
# Server
NODE_ENV=development          # development/production
PORT=3000                     # Server port

# Database
MONGO_URI=mongodb://localhost:27017/auctionz
# OR MongoDB Atlas:
# MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname

# Authentication
JWT_SECRET=your_secret_key    # Keep very secure!
JWT_EXPIRE_IN=7d              # Token expiration

# Session
SESSION_SECRET=session_secret  # Session cookie secret
SOCKET_IO_PATH=/socket.io     # Socket.io path

# CORS
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=debug                # debug/info/warn/error
```

---

## 🎓 What You've Learned

✅ Express.js middleware system  
✅ Server-Side Rendering (EJS)  
✅ MongoDB + Mongoose ORM  
✅ JWT authentication  
✅ Password hashing with bcrypt  
✅ Session management  
✅ Real-time communication with Socket.io  
✅ RESTful API design  
✅ Error handling & validation  
✅ Project organization & best practices  

---

## 📄 License

Educational Project - Free to use and modify

---

**Happy Coding! 🚀**

Questions? Check the code comments for detailed explanations of each feature.
