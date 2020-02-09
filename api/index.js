const express = require('express');
const router = express.Router();

const tickets = require('./tickets');
router.use('/tickets/', tickets);

const clients = require('./clients');
router.use('/clients/', clients);

module.exports = router;
