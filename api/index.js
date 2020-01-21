const express = require('express');
const router = express.Router();

const tickets = require('./tickets');

router.use('/tickets/', tickets);

module.exports = router;
