'use strict';

const User = require('./../models/user');
const Wish = require('./../models/wish');

const multer = require('multer');
const cloudinary = require('cloudinary');
const multerStorageCloudinary = require('multer-storage-cloudinary');

const { Router } = require('express');
const router = new Router();

const routeGuard = require('./../middleware/route-guard');

//Save the files in Cloudinary
const storage = new multerStorageCloudinary.CloudinaryStorage({
  cloudinary: cloudinary.v2
});
const upload = multer({ storage });

router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  console.log(req.session);

  const accountOwner = id === req.session.user;
  console.log('Compares session and user profile, boolean', accountOwner);
  const session = req.session;
  let user;
  User.findById(id)
    .then(data => {
      user = data;

      if (session.user === id) {
        return Wish.find({ creator: id });
      } else {
        return Wish.find({ creator: id, public: true });
      }
    })
    .then(wish => {
      console.log('here is the object available in the render file', {
        user,
        wish,
        session,
        isOwner: accountOwner
      });
      res.render('profile/display', {
        user,
        wish,
        session,
        isOwner: accountOwner
      });
    })
    .catch(err => {
      next(err);
    });
});

router.get('/:id/edit', routeGuard, (req, res, next) => {
  const id = req.params.id;
  const user = req.session.user;
  User.findById(id)
    .then(data => {
      if (id === user) {
        res.render('profile/edit', { data });
      } else {
        res.redirect(`/profile/${user}/edit`);
      }
    })
    .catch(err => {
      next(err);
    });
});

router.post('/:id/edit', (req, res, next) => {
  const id = req.params.id;
  const { name, email } = req.body;

  User.findByIdAndUpdate(id, { name, email })
    .then(() => {
      res.redirect(`/profile/${id}`);
    })
    .catch(err => {
      next(err);
    });
});

router.post(
  '/:id/updatePhoto',
  routeGuard,
  upload.single('photo'),
  (req, res, next) => {
    const id = req.params.id;
    const url = req.file.path;
    User.findByIdAndUpdate(id, { profilePhoto: url })
      .then(() => {
        res.redirect(`/profile/${id}`);
      })
      .catch(err => {
        next(err);
      });
  }
);

router.post('/:id/deletePhoto', routeGuard, (req, res, next) => {
  const id = req.params.id;
  User.findByIdAndUpdate(id, {
    profilePhoto:
      'https://res.cloudinary.com/dprjjpxak/image/upload/v1596622972/person_wfngle.png'
  })
    .then(() => {
      res.redirect(`/profile/${id}`);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
