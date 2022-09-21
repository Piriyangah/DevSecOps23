const express = require('express');
const webpush = require('web-push');
const router = express.Router();

const publicVapidKey = 'BHsi19M865g3bwRHAn6B6pC5dF7U8vEDuT1z2eSRp7H09hh0ww7Bs5yt6Bo9Cfdd2hw0dvUFaVpBWesxZPWww8E';
const privateVapidKey = 'SJV9Yo8aFa0edJ6cWNa7ZTcZiFtrAE9K2NuyYjKa2QM';

router.post('/', async(req, res) => {
    const subscription = req.body;
    console.log('subscription', subscription);
    res.status(201).json({ message: 'subscription received'});

    webpush.setVapidDetails('mailto:Anastasia.Rodionova@Student.HTW-Berlin.de', 
    publicVapidKey, privateVapidKey);
});

module.exports = router;
