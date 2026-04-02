# Attendance Tracker

## Overview
The Attendance Tracker is a web application designed to help employees log their check-in and check-out times, monitor attendance records, and generate reports. This application aims to provide a user-friendly interface for managing attendance efficiently.

## Features
- Record check-in and check-out times.
- View attendance records.
- Export attendance data in various formats (CSV, PDF).
- User-friendly interface with responsive design.

## Project Structure
```
attendance-tracker
├── src
│   ├── server.js          # Entry point of the application
│   ├── routes
│   │   └── attendance.js  # Routes for attendance-related operations
│   ├── models
│   │   └── record.js      # Data model for attendance records
│   ├── public
│   │   ├── index.html     # Main HTML file for the application
│   │   ├── styles.css     # CSS styles for the application
│   │   └── app.js         # Client-side JavaScript for user interactions
│   └── utils
│       └── export.js      # Utility functions for exporting data
├── package.json           # npm configuration file
└── README.md              # Project documentation
```

## Installation
1. Clone the repository:
   ```
   git clone https://github.com/yourusername/attendance-tracker.git
   ```
2. Navigate to the project directory:
   ```
   cd attendance-tracker
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage
1. Start the server in development mode:
   ```
   npm run dev
   ```
   This runs both the Express server and React dev server simultaneously.

2. Open your web browser and navigate to:
   - React App: `http://localhost:5173`
   - API: `http://localhost:3000`

## Deployment on Render

### Prerequisites
- GitHub account with your repository
- Render account (free at render.com)
- MongoDB Atlas connection string

### Steps to Deploy

1. **Push to GitHub:**
   ```
   git add .
   git commit -m "Deploy to Render"
   git push
   ```

2. **Connect to Render:**
   - Go to [render.com](https://render.com)
   - Sign in with GitHub
   - Click "New +" and select "Web Service"
   - Connect your repository

3. **Configure the Service:**
   - Name: `attendance-tracker`
   - Environment: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Plan: Free

4. **Add Environment Variables:**
   - Click "Environment"
   - Add `MONGODB_URI`: Your MongoDB connection string
   - Add `NODE_ENV`: `production`

5. **Deploy:**
   - Click "Create Web Service"
   - Wait for the build to complete (3-5 minutes)
   - Your app will be live at `https://YOUR_SERVICE_NAME.onrender.com`

### Important Notes
- The free plan on Render may go to sleep after 15 minutes of inactivity
- MongoDB Atlas also has a free tier suitable for this project
- Keep your `.env` file with credentials secure (never commit it to Git)

## Environment Variables
Create a `.env` file in the root directory (see `.env.example`):
```
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/attendance
NODE_ENV=development
PORT=3000
```

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.