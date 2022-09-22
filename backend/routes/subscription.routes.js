const express = require('express');
const webpush = require('web-push');
const router = express.Router();

const publicVapidKey = 'BHDDsODPJZ4MhNc9BHMb5DqRaJv4_7AMta8u_CoZXl2HU87y4rMWOeM7cI6OB2yp3Ho1ULSA7fZN_fH_DOjU3tQ';
const privateVapidKey = 'q9SV8ylhawIx2Bzh6oLFAJ4n6VL7jIfzVPqy6ySYCA8';

router.post('/', async(req, res) => {
    const subscription = req.body;
    console.log('subscription', subscription);
    res.status(201).json({ message: 'subscription received'});

    webpush.setVapidDetails('mailto:Anastasia.Rodionova@Student.HTW-Berlin.de', 
    publicVapidKey, privateVapidKey);
});

module.exports = router;
