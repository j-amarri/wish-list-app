'use strict';

const { Router } = require('express');
const router = new Router();

const Wish = require('./../models/wish');

const routeGuard = require('./../middleware/route-guard');

router.get('/', routeGuard, (req, res, next) => {
  const token = req.query.token;

  Wish.find({ category: token })
    .then(data => {
      console.log(data);
      res.render('explore/display', { data: data });
    })
    .catch(err => {
      next(err);
    });
});

router.post('/', routeGuard, (req, res, next) => {
  const { category } = req.body;

  Wish.find({ category: category })
    .then(data => {
      console.log(data);
      res.redirect(`/explore?token=${category}`);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
