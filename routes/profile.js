'use strict';

const User = require('./../models/user');

const { Router } = require('express');
const router = new Router();

router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  User.findById(id)
    .then(data => {
      res.render('profile/display', { data });
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
