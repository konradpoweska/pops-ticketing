var jwt = require('jsonwebtoken');
const secret = process.env.SECRET || 'devtest';

module.exports = {

  admin : 0,
  tech : 1,
  operator : 2,

  getAuthLevel(token){
    let decoded = jwt.verify(token, secret);
    switch(decoded.rights){
      case "ADMIN":
        return this.admin;
      case "TECHNICIAN":
        return this.tech;
      case "OPERATOR":
        return this.operator;
    }
  },

  isValid(token){
    try {
      let decoded = jwt.verify(token, secret);
    } catch(err){
      console.log("Invalid token")
      return false;
    }
    return true;
  }


}
