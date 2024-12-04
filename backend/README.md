# Emotional Archive Backend

## Overview
Backend service for the Emotional Archive Globe Visualization platform, providing real-time confession tracking and geolocation services.

## Features
- Real-time confession submission
- WebSocket-based communication
- IP-based geolocation
- Anonymous confession storage

## Technologies
- Node.js
- Express
- Socket.io
- MongoDB
- IP Geolocation

## Setup

### Prerequisites
- Node.js (v14+)
- MongoDB

### Installation
1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
- Create a `.env` file
- Add `MONGODB_URI`, `PORT`

### Running the Server
```bash
npm start  # Production
npm run dev  # Development with nodemon
```

## API Endpoints
- `POST /api/confessions`: Submit a new confession
- `GET /api/confessions`: Retrieve recent confessions
- `GET /api/locate`: Get user's approximate location

## WebSocket Events
- `initialConfessions`: Initial set of confessions
- `newConfession`: Real-time confession updates

## Privacy & Security
- Anonymized location data
- Limited confession persistence
- No personal identification

## Performance Considerations
- Confession count limited to 50
- 24-hour confession retention
- Efficient geolocation lookup

## Deployment
- Use PM2 for process management
- Configure HTTPS
- Set up MongoDB Atlas or local instance

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push and create a Pull Request
