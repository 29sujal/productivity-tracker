// backend/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const trackRoutes = require('./routes/trackRoutes');
const blockedRoutes = require('./routes/blockedRoutes');

app.use('/api/track', trackRoutes);
app.use('/api/blocked', blockedRoutes);


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Define route
app.get('/', (req, res) => res.send('Productivity Tracker API running'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

