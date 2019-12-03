const express = require('express');
const router = express.Router();

// Go to http://localhost:3000/api/test

router.get('/', (req, res)=>{
  res.send({content:"Test content"});
})

// More information at https://expressjs.com/en/guide/routing.html#express-router

module.exports = router;
