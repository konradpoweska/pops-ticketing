const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
  res.send({
    contentDesc: "All tickets."
  });
});


router.get('/:id', (req, res) => {
  res.send({
    contentDesc: `Ticket ${req.params.id} details.`
  });
});


module.exports = router;
