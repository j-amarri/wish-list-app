'use strict';

const { Router } = require('express');
const router = new Router();

const Wish = require('./../models/wish');

const routeGuard = require('./../middleware/route-guard');

router.get('/', routeGuard, (req, res, next) => {
  const token = req.query.token;
  const user = req.session.user;

  Wish.find({ category: token })
    .populate('creator')
    .then(data => {
      console.log('this is the whole data', data);

      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].creator._id.toString() === user) {
            console.log(typeof data[i].creator._id.toString());
            console.log(typeof user);
            data.splice(i, 1);
            i = 0;
          }
        }

        if (data.length > 0 && data[0].creator._id.toString() === user) {
          data.splice(0, 1);
        }
      }

      console.log('this is the data filtered', data);
      res.render('explore/display', { data });
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
