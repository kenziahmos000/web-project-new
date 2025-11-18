# Backend Setup

Simple Node.js + Express + MongoDB authentication backend.

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure MongoDB

Open `server.js` and update line 10 with your MongoDB connection string:

```javascript
const MONGODB_URI = "mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/webproject?retryWrites=true&w=majority";
```

**To get your MongoDB connection string:**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a free account and cluster
3. Click "Connect" → "Drivers" → Copy the connection string
4. Replace `<username>` and `<password>` with your database credentials

### 3. Update JWT Secret (Optional but Recommended)

In `routes/auth.js` line 7, change the JWT secret to something random:

```javascript
const JWT_SECRET = "your_random_secret_here";
```

### 4. Start the Server

```bash
npm start
```

You should see:

```
🚀 Server running on http://localhost:5001
✅ Connected to MongoDB
```

## 📡 API Endpoints

| Method | Endpoint               | Description                       |
| ------ | ---------------------- | --------------------------------- |
| GET    | `/`                  | Server status                     |
| POST   | `/api/auth/register` | Register new user                 |
| POST   | `/api/auth/login`    | Login user                        |
| GET    | `/api/auth/me`       | Get current user (requires token) |

## 🧪 Test It

Visit http://localhost:5001 in your browser to verify the server is running.

## ✅ That's It!

No .env files needed - everything is configured directly in the code since this is a local project.
