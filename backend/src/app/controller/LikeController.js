const Post = require('../model/post')
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

module.exports = app => app.use('/likesDislikes', router);