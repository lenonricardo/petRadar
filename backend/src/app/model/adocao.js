const mongoose = require('../../database');
const bcrypt = require('bcryptjs');
const PointSchema = require('./utils/PointSchema')

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    require: true
  },
  description: {
    type: String,
    require: true,
  },
  animal: {
    type: String,
    require: true,
  },
  porte: {
    type: String,
    require: true,
  },
  raca: {
    type: String,
    require: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // require: true,
  },
  location:{
    type: PointSchema,
    index: '2dsphere'
  }
}, {
  timestamps: true,//data de criação e ultima alteração de cada dado
});

const Adocao = mongoose.model('Adocao', PostSchema);

module.exports = Adocao;