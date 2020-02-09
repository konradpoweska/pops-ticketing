const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
  res.send([
    {
      _id: "jh9f02mfe9fk9",
      name: "Vend Rêve",
      priority: false,
      email: "contact@vendreve.fr",
      locations: {
        name: "Vend Rêve Arcueil",
        address: "5 rue du Duciel",
        phone: "+33 1 23 45 76 54",
        main: true,
      },
      requesters: {
        name: "Jacques Spareaux",
        address: "5 rue du Duciel",
        phone: "+33 1 23 45 76 54",
        email: "jacques.spareaux@vendreve.fr"
      }
    }
  ]);
});


router.get('/:id', (req, res) => {
  res.send({
    _id: req.params.id,
    name: "Vend Rêve",
    priority: false,
    email: "contact@vendreve.fr",
    locations: {
      name: "Vend Rêve Arcueil",
      address: "5 rue du Duciel",
      phone: "+33 1 23 45 76 54",
      main: true,
    },
    requesters: {
      name: "Jacques Spareaux",
      address: "5 rue du Duciel",
      phone: "+33 1 23 45 76 54",
      email: "jacques.spareaux@vendreve.fr"
    }
  });
});


module.exports = router;
