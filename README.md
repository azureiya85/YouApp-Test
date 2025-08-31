# YouApp.ai - Testing App

## 🏗️ Architecture Overview

This application features a hybrid API architecture:

- **Authentication & Profile Management**: External API integration with `http://techtest.youapp.ai`
- **Chat System**: Internal Next.js API routes with MongoDB storage and RabbitMQ message queuing
- **Frontend**: Modern React interface with real-time capabilities

## 🚀 Tech Stack

### Backend & APIs
- **Next.js 15** - Server-side rendering and API routes
- **MongoDB** - Chat message persistence
- **RabbitMQ** - Message queuing and real-time notifications
- **Zod** - Schema validation and type safety
- **JWT** - Authentication token management
- **External API Integration** - `http://techtest.youapp.ai` for user management

### Frontend
- **React 19** - Component library
- **Tailwind CSS 4** - Utility-first styling
- **shadcn/ui** - Component primitives
- **Lucide React** - Icon system
- **Typography**: Poppins (headings), Inter (body text)

### Additional Libraries
- **date-fns** - Date manipulation
- **React Hook Form** - Form management
- **Sonner** - Toast notifications
- **emoji-picker-react** - Chat emoji support

## 📡 API Architecture

### External API Integration (`techtest.youapp.ai`)

#### Authentication Endpoints

**User Registration**
```typescript
POST /api/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "securePassword"
}
```

**User Login**
```typescript
POST /api/login
Content-Type: application/json

{
  "email": "user@example.com",    // OR
  "username": "username",         // username field
  "password": "securePassword"
}

Response: {
  "token": "jwt_token_here"
}
```

#### Profile Management

**Get User Profile**
```typescript
GET /api/getProfile
Headers: {
  "x-access-token": "jwt_token"
}
```

**Create Profile**
```typescript
POST /api/createProfile
Headers: {
  "x-access-token": "jwt_token"
}
Content-Type: application/json

{
  "name": "Full Name",
  "birthday": "1990-01-01",
  "height": 170,
  "weight": 70,
  "interests": ["technology", "sports"]
}
```

**Update Profile**
```typescript
PUT /api/updateProfile
Headers: {
  "x-access-token": "jwt_token"
}
Content-Type: application/json

{
  "name": "Updated Name",
  "birthday": "1990-01-01",
  "height": 175,
  "weight": 72,
  "interests": ["technology", "music", "travel"]
}
```

### Internal Chat API (MongoDB + RabbitMQ)

#### Send Message
```typescript
POST /api/sendMessages
Content-Type: application/json
Cookie: token=jwt_token

{
  "recipientId": "user_id",
  "content": "Hello, how are you?"
}
```

**Flow:**
1. Validates user session from cookie
2. Saves message to MongoDB with timestamp
3. Publishes message to RabbitMQ exchange
4. Routes notification to recipient via `notifications.{recipientId}`

#### View Messages
```typescript
GET /api/viewMessages?with=user_id
Cookie: token=jwt_token
```

**Flow:**
1. Fetches conversation history between authenticated user and target user
2. Marks received messages as 'read'
3. Publishes read receipts to RabbitMQ for real-time updates
4. Returns chronologically sorted message thread

## 🗄️ Data Models

### User Profile Schema
```typescript
{
  name: string;
  birthday: Date;
  height: number;     // in cm
  weight: number;     // in kg  
  interests: string[];
}
```

### Message Schema
```typescript
{
  _id: ObjectId;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: Date;
  status: 'sent' | 'read';
}
```

## 🔒 Security Features

### Authentication Flow
1. User credentials validated via external API
2. JWT token received and stored in secure httpOnly cookie
3. Token automatically included in subsequent requests
4. Cookie configuration:
   - `httpOnly: true` - XSS protection
   - `secure: true` (production) - HTTPS only
   - `sameSite: 'strict'` - CSRF protection
   - `maxAge: 86400` - 24-hour expiration

### API Security
- **Server Actions** - All auth operations use Next.js server actions
- **Input Validation** - Zod schemas validate all incoming data
- **Error Handling** - Comprehensive error catching with user-friendly messages
- **Timeout Protection** - 15-second request timeouts prevent hanging requests

## 🚀 Real-time Features

### RabbitMQ Message Queue
- **Exchange**: Direct message routing
- **Routing Keys**: `notifications.{userId}` pattern
- **Message Types**:
  - New chat messages
  - Read receipt notifications
- **Persistence**: Messages marked as persistent for reliability

### WebSocket Integration Ready
The RabbitMQ infrastructure supports real-time WebSocket connections for:
- Instant message delivery
- Live read receipts
- Online status indicators
- Typing indicators

## 🛠️ Development Setup

### Environment Variables
```env
API_BASE_URL=http://techtest.youapp.ai
MONGODB_URI=your_mongodb_connection_string
RABBITMQ_URL=amqp://guest:guest@localhost:5672
JWT_SECRET=your_jwt_secret
```

### Installation
```bash
npm install
npm run dev
```

### Database Setup
```bash
# MongoDB
mongod --dbpath ./data/db

# RabbitMQ
rabbitmq-server
```

## 🚦 API Testing

### Authentication Test
```bash
# Register new user
curl -X POST http://techtest.youapp.ai/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"password123"}'

# Login
curl -X POST http://techtest.youapp.ai/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Chat System Test
```bash
# Send message (requires authentication cookie)
curl -X POST http://localhost:3000/api/sendMessages \
  -H "Content-Type: application/json" \
  -H "Cookie: token=your_jwt_token" \
  -d '{"recipientId":"user123","content":"Hello there!"}'

# View conversation
curl "http://localhost:3000/api/viewMessages?with=user123" \
  -H "Cookie: token=your_jwt_token"
```