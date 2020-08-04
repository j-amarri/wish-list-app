'use strict';

const bcryptjs = require('bcryptjs');
const User = require('./../models/user');

const { Router } = require('express');
const router = new Router();
//const routeGuard = require('./../middleware/route-guard');

const nodemailer = require('nodemailer');

const dotenv = require('dotenv');
dotenv.config();

//Create transport for nodemailer
const transport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD
  }
});

//Random token Generator
const generateRandomToken = length => {
  const characters =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return token;
};

router.get('/sign-up', (req, res, next) => {
  res.render('sign-up');
});

router.post('/sign-up', (req, res, next) => {
  let user;
  const { name, email, password } = req.body;
  bcryptjs
    .hash(password, 10)
    .then(hash => {
      return User.create({
        name,
        email,
        passwordHash: hash,
        confirmationToken: generateRandomToken(15)
      });
    })
    .then(document => {
      user = document;
      transport.sendMail({
        from: process.env.NODEMAILER_EMAIL,
        to: process.env.NODEMAILER_EMAIL,
        subject: 'Please verify your email to activate your account',
        html: `
        <html>
        <body>
        <h1>Hi ${user.name}</h1>
        <a href="http://localhost:3000/authentication/confirm-email?token=${user.confirmationToken}">Click here to verify your account: http://localhost:3000/authentication/confirm-email?token=${user.confirmationToken}</a>
        </body>
        </html>
        `
      });
    })
    .then(() => {
      req.session.user = user._id;
      res.redirect('/home');
    })
    .catch(error => {
      next(error);
    });
});

router.get('/sign-in', (req, res, next) => {
  res.render('sign-in');
});

router.post('/sign-in', (req, res, next) => {
  let user;
  const { email, password } = req.body;
  User.findOne({ email })
    .then(document => {
      if (!document) {
        return Promise.reject(new Error("There's no user with that email."));
      } else {
        user = document;
        return bcryptjs.compare(password, user.passwordHash);
      }
    })
    .then(result => {
      if (result) {
        req.session.user = user._id;
        res.redirect('/home');
      } else {
        return Promise.reject(new Error('Wrong password.'));
      }
    })
    .catch(error => {
      next(error);
    });
});

router.post('/sign-out', (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
});

router.get('/authentication/confirm-email', (req, res, next) => {
  const token = req.query.token;

  User.findOneAndUpdate({ confirmationToken: token }, { status: 'active' })
    .then(() => {
      res.redirect('/home');
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
