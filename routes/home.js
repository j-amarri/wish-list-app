'use strict';

const Wish = require('./../models/wish');

const { Router } = require('express');
const router = new Router();
const routeGuard = require('./../middleware/route-guard');

router.get('/', routeGuard, (req, res, next) => {
  const id = req.session.user;
  Wish.find({ creator: id })
    .then(wishes => {
      console.log(wishes);
      res.render('home', { wishes });
    })
    .catch(error => {
      next(error);
    });
});

router.get('/:id/congratulations', routeGuard, (req, res, next) => {
  const id = req.params.id;
  Wish.findById(id)
    .then(wish => {
      res.render('wish/congratulations', { wish });
    })
    .catch(error => {
      next(error);
    });
});

router.post('/:id/congratulations', routeGuard, (req, res, next) => {
  const id = req.params.id;
  const experience = req.body.experience;
  const rating = req.body.rating;
  Wish.findByIdAndUpdate(id, {
    complete: true,
    experience: experience,
    rating: rating
  })
    .then(() => {
      res.redirect('/home');
    })
    .catch(error => {
      next(error);
    });
});

router.post('/:id/incomplete', routeGuard, (req, res, next) => {
  const id = req.params.id;
  Wish.findByIdAndUpdate(id, { complete: false })
    .then(() => {
      res.redirect('/home');
    })
    .catch(error => {
      next(error);
    });
});

module.exports = router;
