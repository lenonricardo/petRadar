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
  situacao: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    require: true,
  },
	aprovado: {
		type: Boolean,
		require: true
	},
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // require: true,
  },
	like: {
		type: Number,
		require: false,
		default: 0
	},
	dislike: {
		type: Number,
		require: false,
		default: 0
	},
  location:{
    type: PointSchema,
    index: '2dsphere'
  }
}, {
  timestamps: true,//data de criação e ultima alteração de cada dado
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;