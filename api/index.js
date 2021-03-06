const express = require('express');
const router = express.Router();

require('./db').init();

const tickets = require('./tickets');
router.use('/tickets/', tickets);

const clients = require('./clients');
router.use('/clients/', clients);

const login = require('./login');
router.use('/login', login);

const users = require('./users');
router.use('/users/', users);

module.exports = router;
