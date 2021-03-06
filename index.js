'use strict';
require('dotenv').config();
const cookieSession = require('cookie-session');
const express = require('express');
const cors = require('cors');
const passport = require('passport');
// const port = process.env.PORT||5000;
const pasportSetUp = require('./passport');
const router = require('./routes/auth');
const authRouter=require('./auth/router/index');
const logsRoute=require('./auth/logs/logsRoute');
const {db}=require('./models-connections');
const session= require('express-session');
const app = express();
app.use(express.json());
app.set("trust proxy", 1);
app.use(
  cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
);
app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
    cookie: {
      sameSite: "none",
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7 // One Week
    }
  }))
app.use(passport.initialize());
app.use(passport.session());
app.use(
    cors({
      origin:"http://localhost:3000",
      methods: "GET,POST,PUT,DELETE",
      credentials: true,
    })
  );
app.use('/auth', router);
app.use('/auth',authRouter);
app.use('/admin',logsRoute);
app.get('/',(req, res) => {
  res.send('welcome')
})
db.sync()
.then(() => {
    app.listen(5000, () => {
        console.log(`server is lestining 0n port ${5000}`);
    });
  });

