const mongoose = require('mongoose');

const BlockedSiteSchema = new mongoose.Schema({
  site: String,
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('BlockedSite', BlockedSiteSchema);
