const express = require('express');
const Wish = require('./../models/wish');

const routeGuard = require('./../middleware/route-guard');

const wishRouter = new express.Router();

wishRouter.get('/create', routeGuard, (req, res) => {
  res.render('wish/create');
});

wishRouter.post('/create', routeGuard, (req, res, next) => {
<<<<<<< HEAD
  const { title, description, category, public } = req.body;
  let location = {
=======
  const { title, description, category, private } = req.body;
  const location = {
>>>>>>> 6500c5f2fea6c740d260718b2b972f16f91a78bb
    type: 'Point',
    coordinates: [req.body.longitude, req.body.latitude]
  };

  Wish.create({
    title,
    description,
    category,
    public,
    location: location,
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
  const location = {
    type: 'Point',
    coordinates: [req.body.longitude, req.body.latitude]
  };

  Wish.findByIdAndUpdate(id, {
    title,
    description,
    category,
    private,
    location: location
  })
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
