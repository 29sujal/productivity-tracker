const mongoose = require('mongoose');

const TrackSchema = new mongoose.Schema({
  url: String,
  duration: Number, // in milliseconds
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Track', TrackSchema);
