const bcrpyt = require('bcryptjs');


module.exports = (req, res, next) => {
    //check that we remeber that the client is already logged in 
    if(req.session && req.session.user){
        next();
    }
    else {
        res.status(401).json({you: "shall not pass!"})
    }
};