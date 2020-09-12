const mongoose = require('../../database');
const bcrypt = require('bcryptjs');

const AnimalSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  // post: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Post',
  //   require: true,
  // },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  },
  completed: {
    type: Boolean,
    require: true,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Animal = mongoose.model('Animal', AnimalSchema);

module.exports = Animal;