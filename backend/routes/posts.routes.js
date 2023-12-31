const express = require('express');
const router = express.Router();
const Post = require('../models/posts')
const upload = require('../middleware/upload')
const mongoose = require('mongoose')
const webpush = require('web-push');
require('dotenv').config()


const publicVapidKey = 'BDwTqi0wwa_paNs4RDlP550-CP-Pyoi92hVh9xpPhehbwGIdqQmEJaG9rgdxBDgxFZW-Q1lQ-N7gDqCNSYwx7tY';
const privateVapidKey = 'Bf0C8DTY1XhCaV1Dgm1Aovr2sPbJkAdTLfH_vmuW3Pg';
const pushSubscription = {
    endpoint: 'https://fcm.googleapis.com/fcm/send/f43e_8p5n8s:APA91bGe4ebvK1ubLKmVr31PgKLune2VRjWnCGvyJF13V_GW3DBaYa84PolMBz4DVJaDnQyfWFm28FszrqzRnPA_G6PXRifoHqpxJj9dshWtsrvnHhmsbQTZ9WnyTsvLbZKSmOponOhB',
    expirationTime: null,
    keys: {
      p256dh: 'BP0bpXGEZ0YSvE4ITHq7RGN2ECwx24epR1k1cYWMRa5pn3T2W8yM2tJk5thKLI4uDO3GevsOkdbUNvIdn8uJFXo',
      auth: '4rYIetnkpkooFOTGyz-LWQ'
    }
  };

function sendNotification() {
    webpush.setVapidDetails('mailto:Anastasia.Rodionova@Student.HTW-Berlin.de', publicVapidKey, privateVapidKey);
    const payload = JSON.stringify({
        title: 'New Push Notification',
        content: 'New data in database!'
    });
    console.log(payload);
    webpush.sendNotification(pushSubscription,payload)
        .catch(err => console.error(err));
    console.log('push notification sent');
}


// POST 
router.post('/', upload.single('file'), async(req, res) => {
    if(req.file === undefined)
    {
        return res.send({
            "message": "no file selected"
        })
    } else {
        const newPost = new Post({
            title: req.body.title,
            location: req.body.location,
            image_id: req.file.filename
        })
        console.log('newPost', newPost)
        await newPost.save();
        res.send(newPost)
    }
})

//GET

const connect = mongoose.createConnection(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true });
const collectionFiles = connect.collection('posts.files');
const collectionChunks = connect.collection('posts.chunks');

function getOnePost(id) {
    return new Promise( async(resolve, reject) => {
        try {
            const post = await Post.findOne({ _id: id });
            let fileName = post.image_id;

            collectionFiles.find({filename: fileName}).toArray( async(err, docs) => {

                //  chunks nach Eigenschaft n aufsteigend sortieren
                collectionChunks.find({files_id : docs[0]._id}).sort({n: 1}).toArray( (err, chunks) => {

                    const fileData = [];
                    for(let chunk of chunks)
                    {
                        // console.log('chunk._id', chunk._id)
                        fileData.push(chunk.data.toString('base64'));
                    }

                    let base64file = 'data:' + docs[0].contentType + ';base64,' + fileData.join('');
                    console.log("foto fertig...");
                    let getPost = new Post({
                        "title": post.title,
                        "location": post.location, 
                        "image_id": base64file
                    });
                    console.log("lesen fertig...");

                    resolve(getPost)
                })

            }) 

        } catch {
            reject(new Error("Post does not exist!"));
        }
    })
}

function getAllPosts() {
    return new Promise( async(resolve, reject) => {
        const sendAllPosts = [];
        const allPosts = await Post.find();
        try {
            for(const post of allPosts) {
                console.log('post', post)
                const onePost = await getOnePost(post._id);
                sendAllPosts.push(onePost);
            }
            console.log('sendAllPosts', sendAllPosts)
            resolve(sendAllPosts)
        } catch {
                reject(new Error("Posts do not exist!"));
        }
    });
}

// GET one post via id
router.get('/:id', async(req, res) => {
    getOnePost(req.params.id)
    .then( (post) => {
        console.log('post', post);
        res.send(post);
    })
    .catch( () => {
        res.status(404);
        res.send({
            error: "Post does not exist!"
        });
    })
});

// GET alle posts
router.get('/', async(req, res) => {

    getAllPosts()
    .then( (posts) => {
        res.send(posts);
    })
    .catch( () => {
        res.status(404);
        res.send({
            error: "Post do not exist! (route: /posts)"
        });
    })
});




// DELETE 
router.delete('/:id', async(req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.id })
        let fileName = post.image_id;
        await Post.deleteOne({ _id: req.params.id });
        await collectionFiles.find({filename: fileName}).toArray( async(err, docs) => {
            await collectionChunks.deleteMany({files_id : docs[0]._id});
        })
        await collectionFiles.deleteOne({filename: fileName});
        res.status(204).send()
    } catch {
        res.status(404)
        res.send({ error: "Post does not exist!" })
    }
});

module.exports = router;