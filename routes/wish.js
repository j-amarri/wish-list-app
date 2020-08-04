const express = require('express');
const Wish = require('./../models/wish');

const routeGuard = require('./../middleware/route-guard');

const wishRouter = new express.Router();

wishRouter.get('/create', routeGuard, (req, res) => {
  res.render('wish/create');
});

wishRouter.post('/create', routeGuard, (req, res, next) => {
  const { title, description, category, private } = req.body;

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

wishRouter.post('/:id/delete', routeGuard, (req, res, next) => {
  const id = req.params.id;
  Wish.findByIdAndDelete(id)
    .then(() => {
      res.redirect('/home');
    })
    .catch(error => {
      next(error);
    });
});

wishRouter.get('/:id/edit', routeGuard, (req, res, next) => {
  const id = req.params.id;

  Wish.findById(id)
    .then(wish => {
      res.render('wish/edit', { wish });
    })
    .catch(error => {
      next(error);
    });
});

wishRouter.post('/:id/edit', routeGuard, (req, res, next) => {
  const id = req.params.id;
  const { title, description, category, private } = req.body;

  Wish.findByIdAndUpdate(id, { title, description, category, private })
    .then(() => {
      res.redirect('/home');
    })
    .catch(error => {
      next(error);
    });
});

wishRouter.get('/:id', routeGuard, (req, res, next) => {
  const id = req.params.id;
  Wish.findById(id)
    .then(wish => {
      res.render('wish/single', { wish });
    })
    .catch(error => {
      next(error);
    });
});

module.exports = wishRouter;
