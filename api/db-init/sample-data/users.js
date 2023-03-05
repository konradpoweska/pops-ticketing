const crypt = require('bcryptjs');

module.exports = [
  {
    "username": "arnaud.lauperateur",
    "email": "arnaud.lauperateur@pops1920.fr",
    "name": "Arnaud LAUPERATEUR",
    "password": crypt.hashSync("asdf123"),
    "rights": ["OPERATOR"]
  },
  {
    "username": "michel.ladmin",
    "email": "michel.ladmin@pops1920.fr",
    "name": "Michel LADMIN",
    "password": crypt.hashSync("admin1234"),
    "rights": ["ADMIN"]
  }
]
