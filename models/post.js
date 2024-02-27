const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  images: [String], 
  creationDate: { type: Date, default: Date.now }
});

const Item = mongoose.model('posts', itemSchema);

module.exports = Item;