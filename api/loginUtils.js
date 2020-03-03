var jwt = require('jsonwebtoken');
const secret = process.env.SECRET || 'devtest';


const admin = 0;
const operator = 1;
const technician = 2;

function getAuthLevel(token){
  let decoded = jwt.verify(token, secret);
  switch(decoded.rights){
    case "ADMIN":
      return admin;
    case "TECHNICIAN":
      return technician;
    case "OPERATOR":
      return operator;
  }
}

function isValid(token){
  let decoded = null;
  try {
    decoded = jwt.verify(token, secret);
  } catch(err){
    console.log("Invalid token")
    return false;
  }
  return true;
}

module.exports = {

  adminLevel : admin,
  operatorLevel : operator,
  technicianLevel : technician,

  handleResponse(req, res, level){

    let token = req.body.token;

    if(!isValid(token)){
      res.sendStatus(403);
      return true;
    } else if(getAuthLevel(token) > level){
      res.sendStatus(403);
      return true;
    }
    return false;
  },

  isValid : isValid,
  getAuthLevel : getAuthLevel

}
