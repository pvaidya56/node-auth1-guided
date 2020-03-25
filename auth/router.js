const bcrypt = require("bcryptjs");
const router = require("express").Router();

const Users = require("../users/users-model");

router.post("/register", (req, res) => {
    const userInfo = req.body;
//need to hash password here
//the password will be hashed and rehashed 2^8 times 
//even if password is the same, the hash will be different
const rounds = process.env.HASHING_ROUNDS || 8;
const hash = bcrypt.hashSync(userInfo.password, rounds);

userInfo.password = hash;

  Users.add(userInfo)
    .then(user => {
      res.json(user);
    })
    .catch(err => res.send(err));
});

router.post("/login", (req, res) => {
const { username, password } = req.body;

Users.findBy({ username })
    .then(([user]) => {
        if(user && bcrypt.compareSync(password, user.password)){
           //remember this client 
           req.session.user = {
               id: user.id,
               username: user.username
           };

            res.status(200).json({ hello: user.username });
        } else {
            res.status(401).json({message: 'invalid credentials'})
        }
    })
    .catch(error => {
    res.status(500).json({errorMessage: 'error finding the user'})
    });

});

router.get("/logout", (req, res) => {
    if(req.session) {
        req.session.destroy(error => {
            if (error) {
                res.status(500).json({message: "you can't leave"})
            } else {
                res.status(200).json({message: "logged out successfully"})
            } 
        });
        }   
        else {
        res.status(200).json({message: "you are already logged out"})
    }
});
module.exports = router;
