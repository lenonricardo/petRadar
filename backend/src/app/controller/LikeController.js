const Post = require('../model/post')
const User = require('../model/user')
const express = require('express');
const router = express.Router();

router.put('/like/:postId', async (req, res) => {
  try {
		console.log('bateu aqui')

		const post = await Post.findById(req.params.postId)
		console.log(post)
		post.like += 1
		await post.save()
		// return res.json(post)

    return res.send({ post });
  } catch (err) {

    return res.status(400).send({ error: 'Error updating post' });
  }
});

router.put('/dislike/:postId', async (req, res) => {
  try {
		console.log('bateu aqui')

		const post = await Post.findById(req.params.postId)
		post.dislike += 1
		await post.save()

    return res.send({ post });
  } catch (err) {

    return res.status(400).send({ error: 'Error updating post' });
  }
});

router.put('/encontrado/:postId', async (req, res) => {
  try {
		console.log('bateu aqui')

		const post = await Post.findById(req.params.postId)
		post.status = true
		await post.save()

    return res.send({ post });
  } catch (err) {

    return res.status(400).send({ error: 'Error updating post' });
  }
});

router.put('/nivel/:userId', async (req, res) => {
  try {
		console.log(req.params.userId)

		const user = await User.findById(req.params.userId)
		user.recuperados += 1

		if (user.recuperados > 4) {
			user.nivel += 1
		}

		await user.save()
		console.log(user)

    return res.send({ user });
  } catch (err) {

    return res.status(400).send({ error: 'Error updating post' });
  }
});

module.exports = app => app.use('/likesDislikes', router);