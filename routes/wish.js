const express = require('express');
const Wish = require('./../models/wish');

const routeGuard = require('./../middleware/route-guard');

const wishRouter = new express.Router();

wishRouter.get('/create', routeGuard, (req, res) => {
  res.render('wish/create');
});

wishRouter.post('/create', routeGuard, (req, res, next) => {
  const { title, description, category, private } = req.body;
  console.log(req.session.user);

  Wish.create({
    title,
    description,
    category,
    private,
    creator: req.session.user
  })
    .then(() => {
      console.log();
      res.redirect('/home');
    })
    .catch(error => {
      next(error);
    });
});

module.exports = wishRouter;
