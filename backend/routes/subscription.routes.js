const express = require('express');
const webpush = require('web-push');
const router = express.Router();

const publicVapidKey = 'BDwTqi0wwa_paNs4RDlP550-CP-Pyoi92hVh9xpPhehbwGIdqQmEJaG9rgdxBDgxFZW-Q1lQ-N7gDqCNSYwx7tY';
const privateVapidKey = 'Bf0C8DTY1XhCaV1Dgm1Aovr2sPbJkAdTLfH_vmuW3Pg';

router.post('/', async(req, res) => {
    const subscription = req.body;
    console.log('subscription', subscription);
    res.status(201).json({ message: 'subscription received'});

    webpush.setVapidDetails('mailto:Anastasia.Rodionova@Student.HTW-Berlin.de', 
    publicVapidKey, privateVapidKey);
});

module.exports = router;
