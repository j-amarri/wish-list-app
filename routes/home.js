'use strict';

const Wish = require('./../models/wish');

const { Router } = require('express');
const router = new Router();
const routeGuard = require('./../middleware/route-guard');

router.get('/', routeGuard, (req, res, next) => {
  const id = req.session.user;
  console.log(id);
  Wish.find({ creator: id })
    .then(wishes => {
      res.render('home', { wishes });
    })
    .catch(error => {
      next(error);
    });
});

module.exports = router;
