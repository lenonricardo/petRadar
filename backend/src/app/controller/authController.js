const uploadConfig = require('../../config/upload')
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const mailer = require('../../modules/mailer')

const User = require('../model/user')
const authConfig = require('../../config/auth')
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')
const multer = require('multer')
const upload = multer(uploadConfig)

const router = express.Router()

function generateToken(params = {}) {
	return jwt.sign(params, authConfig.secret, {
		expiresIn: 86400,
	})
}

router.post('/register', upload.single('image'), async (req, res) => {

	try {
		const { email, name, password } = req.body;
		if (await User.findOne({ email }))
			return res.status(400).send({ error: 'User already exists' })

		const { filename: image } = req.file

		const [namefile] = image.split('.') //separando nome e extensão
		const filename = `${namefile}.jpg`

		await sharp(req.file.path)
			.resize(500)
			.withMetadata()
			.jpeg({ quality: 70 })
			.toFile(
				path.resolve(req.file.destination, 'resized', image)
			)

			console.log('aqui')
			fs.unlinkSync(req.file.path) //deleta a imagem grande (original)

		const user = await User.create({
			name,
			email,
			password,
			image: filename,
		})
		console.log(user)

		await user.save()
		user.password = undefined

		return res.send({
			user,
			token: generateToken({ id: user.id })
		})
	} catch (err) {
		return res.status(400).send({ error: 'Registration failed' })
	}
})

router.post('/authenticate', async (req, res) => {
	const { email, password } = req.body
	console.log(password)

	try {

		const user = await User.findOne({ email }).select('+password')

		if (!user) {
			console.log('User not found')
			return res.status(400).send({ error: 'User not found' })
		}
		console.log(user.password)

		if (!await bcrypt.compare(password, user.password))
			console.log(await bcrypt.decodeBase64(user.password))
			// return res.status(400).send({ error: 'Invalid password ' })

		user.password = undefined

		console.log(user)

		res.send({
			user,
			token: generateToken({ id: user.id })
		})
	} catch (err) {
		return res.status(400).send({ error: 'Authentication fail' })
	}
})

router.post('/forgot_password', async (req, res) => {
	const { email } = req.body;

	try {
		const user = await User.findOne({ email })

		if (!user)
			return res.status(400).send({ error: 'User not found' })

		const token = crypto.randomBytes(20).toString('hex')

		// const now = new Date();
		// now.setHours(now.getHours() + 1)

		// await User.findByIdAndUpdate(user.id, {
		//     '$set': {
		//         passwordResetToken: token,
		//         passwordResetExpires: now,
		//     }
		// }, { new: true, useFindAndModify: false }
		// );

		const now = new Date();
		now.setHours(now.getHours() + 1);


		await User.updateOne({ _id: user.id, },
			{
				passwordResetToken: token,
				passwordResetExpires: now,
			});

		mailer.sendMail({
			to: email,
			from: 'lenonricardomendes@gmail.com',
			template: 'auth/forgot_password',
			context: { token },
		}, (err) => {
			if (err) {
				console.log(err)
				return res.status(400).send({ error: 'Cannot send forgot password email' });
			}

			return res.send();
		})

	} catch (err) {
		console.log(err)
		res.status(400).send({ error: 'Error on forgot password, try again' })
	}
})

router.get('/session', async (req, res) => {
	try {

		const sessao = req.session.usuario;

		return res.json(sessao);
	} catch (err) {
		return res.status(400).send({ error: 'no session' });
	}
});

module.exports = (app) => app.use('/auth', router)