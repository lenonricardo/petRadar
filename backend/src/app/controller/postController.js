const authMiddleware = require('../middlewares/auth');
const uploadConfig = require('../../config/upload')

const express = require('express');
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')
const multer = require('multer')

const Post = require('../model/post');
const Animal = require('../model/animal');

const router = express.Router();
const upload = multer(uploadConfig)

//router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate(['user']); //populate para trazer as informações do usuário

    return res.send({ posts });
  } catch (err) {
    return res.status(400).send({ error: 'Error loading posts' });
  }
});

router.get('/:postId', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId).populate(['user', 'animal']);

    return res.send({ post });
  } catch (err) {
    return res.status(400).send({ error: 'Error loading post' });
  }
});

router.post('/', upload.single('image'), async (req, res) => {
  console.log('chegou aqui')
  try {
    const { title, description, latitude, longitude, animal, situacao, status, user } = req.body;

    console.log(req.body)

    const { filename: image } = req.file


    const location = {
      type: 'Point',
      coordinates: [longitude, latitude]
    }

        const [name] = image.split('.') //separando nome e extensão
        const filename = `${name}.jpg`

        await sharp(req.file.path)
            .resize(500)
            .withMetadata()
            .jpeg({quality: 70})
            .toFile(
                path.resolve(req.file.destination, 'resized', image)
            )

        fs.unlinkSync(req.file.path) //deleta a imagem grande (original)

    const post = await Post.create({
        title,
        description,
        location,
        animal,
        situacao,
        status,
        user,
        // animal: req.animalId,
        image: filename,
      });

    // await Promise.all(animals.map(async animal => {
    //   const postAnimal = new Animal({ ...animal, post: post._id });

    //   await postAnimal.save();

    //   post.animals.push(postAnimal);
    // }));

    await post.save();

    //return res.send({ post });

    return res.json(post)
  } catch (err) {
      console.log(err)
    return res.status(400).send({ error: 'Error creating new post' });
  }
});

router.put('/:postId', async (req, res) => {
  try {
		console.log('bateu aqui')
    const { description, aprovado, animal, image, location, situacao, title, status } = req.body;
		console.log(description)

    const post = await Post.findByIdAndUpdate(req.params.postId, {
      title,
      description,
			aprovado,
			animal,
			image,
			location,
			situacao,
			status
    }, { new: true });

    await post.save();

    return res.send({ post });
  } catch (err) {

    return res.status(400).send({ error: 'Error updating post' });
  }
});

router.delete('/:postId', async (req, res) => {
  try {
    await Post.findByIdAndRemove(req.params.postId);

    return res.send();
  } catch (err) {
    return res.status(400).send({ error: 'Error deleting post' });
  }
});

router.delete('/', async(req,res)=>{
  try{
    await Post.remove({})
    return res.send('ok');

  }catch(err){
    return res.status(400).send({ error: 'Error deleting posts' });
  }
})

module.exports = app => app.use('/posts', router);