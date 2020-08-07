const express = require('express');
const Wish = require('./../models/wish');

const routeGuard = require('./../middleware/route-guard');

const multer = require('multer');
const cloudinary = require('cloudinary');
const multerStorageCloudinary = require('multer-storage-cloudinary');

const wishRouter = new express.Router();

//Save the files in Cloudinary
const storage = new multerStorageCloudinary.CloudinaryStorage({
  cloudinary: cloudinary.v2
});
const upload = multer({ storage });

wishRouter.get('/create', routeGuard, (req, res) => {
  res.render('wish/create');
});

wishRouter.post(
  '/create',
  routeGuard,
  upload.single('photo'),
  (req, res, next) => {
    const { title, description, category, public } = req.body;
    console.log(req.body);
    const location = {
      type: 'Point',
      coordinates: [req.body.longitude, req.body.latitude]
    };

    let data;
    if (req.file) {
      data = {
        title,
        description,
        category,
        public,
        hasOwnPicture: true,
        wishPicture: req.file.path,
        location: location,
        creator: req.session.user
      };
    } else {
      data = {
        title,
        description,
        category,
        public,
        location,
        creator: req.session.user
      };
    }

    Wish.create(data)
      .then(() => {
        console.log(req.body);
        res.redirect('/home');
      })
      .catch(error => {
        next(error);
      });
  }
);

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
  const user = req.session.user;

  Wish.findById(id)
    .then(wish => {
      if (user == wish.creator) {
        res.render('wish/edit', { wish });
      } else {
        res.redirect(`/wish/${id}`);
      }
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

wishRouter.post(
  '/:id/updatePicture',
  routeGuard,
  upload.single('photo'),
  (req, res, next) => {
    const id = req.params.id;
    const url = req.file.path;

    Wish.findByIdAndUpdate(id, { wishPicture: url, hasOwnPicture: true })
      .then(() => {
        res.redirect(`/wish/${id}/edit`);
      })
      .catch(err => {
        next(err);
      });
  }
);

wishRouter.get('/:id', routeGuard, (req, res, next) => {
  const id = req.params.id;
  const user = req.session.user;

  Wish.findById(id)
    .then(wish => {
      console.log('wish', wish);
      console.log('creator', wish.creator);
      console.log('user in session', user);

      let isOwner = false;
      if (wish.creator == user) {
        isOwner = true;
      }

      console.log('is it my wish', isOwner);
      res.render('wish/single', { wish, isOwner: isOwner });
    })
    .catch(error => {
      next(error);
    });
});

module.exports = wishRouter;
