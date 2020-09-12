const Animal = require('../model/animal')

const express = require('express');
const router = express.Router();



router.post('/', async (req, res) => {   

    try {
       
        const animal = await Animal.create(req.body)

        return res.send({
            animal
        })
    } catch (err) {
        return res.status(400).send({ error: 'Registration failed' })
    }
})

module.exports = (app) => app.use('/animals', router)