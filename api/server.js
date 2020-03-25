const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");


const usersRouter = require("../users/users-router.js");
const authRouter = require('../auth/router.js');
const restricted = require('../auth/restricted-middleware.js');

const server = express();

const sessionConfig = {
  name: "monster",
  secret: "keep it a secret",
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false, //true in production
    httpOnly: true, // no access from js
  },
  resave: false,
  saveUninitialized: true, //GDPR LAWS


};


server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig))
server.use("/api/users", restricted, usersRouter);
server.use('/api/auth', authRouter);

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

module.exports = server;
