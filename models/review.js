const mongoose = require('mongoose');

const newSchema = new mongoose.Schema({
  EdpNo: { type: 'string', required: true },

  pagenumber: { type: Number, required: true },

  title: { type: 'string', default: '' },

  name: { type: 'string', default: '' },

  description: { type: 'string', default: '' },

  date: { type: 'date' },

  ratingsDetail: { type: mongoose.Schema.Types.Mixed },

  createdAt: { type: 'date', default: Date.now() },
});

module.exports = mongoose.models.review || mongoose.model('reviews', newSchema);
