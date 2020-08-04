'use strict';

const User = require('./../models/user');
const Wish = require('./../models/wish');

const { Router } = require('express');
const router = new Router();

const routeGuard = require('./../middleware/route-guard');

router.get('/:id', (req, res, next) => {
  const id = req.params.id;

  const session = req.session;
  let user;
  User.findById(id)
    .then(data => {
      user = data;
      return Wish.find({ creator: id });
    })
    .then(wish => {
      console.log(wish);
      res.render('profile/display', { user, wish, session });
    })
    .catch(err => {
      next(err);
    });
});

router.get('/:id/edit', routeGuard, (req, res, next) => {
  const id = req.params.id;
  User.findById(id)
    .then(data => {
      res.render('profile/edit', { data });
    })
    .catch(err => {
      next(err);
    });
});

router.post('/:id/edit', routeGuard, (req, res, next) => {
  const id = req.params.id;
  const { name, email } = req.body;
  User.findByIdAndUpdate(id, { name, email })
    .then(() => {
      res.redirect('/home');
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
