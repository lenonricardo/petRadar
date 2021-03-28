const Post = require('../model/post')
const express = require('express');

const router = express.Router();


    router.get('/', async (req, res) => {
        try{
            const { latitude, longitude, /*description*/ } = req.query;

            const posts = await Post.find({
                // desc: {
                //     $eq: description
                // },
                location:{
                    $near: {
                        $geometry: {
                            type: 'Point',
                            coordinates: [longitude, latitude],
                        },
                        $maxDistance: 10000,                        
                    }               
                }
                
            }).populate("user")

            return res.json({posts})
        } catch(err){
            console.log(err)
            return res.status(400).send({ error: 'Error loading posts' });
        }
    })

module.exports = app => app.use('/search', router);
