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

wishRouter.post('/create', routeGuard, (req, res, next) => {
  const { title, description, category, public } = req.body;
  const location = {
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
  Wish.findById(id)
    .then(wish => {
      res.render('wish/single', { wish });
    })
    .catch(error => {
      next(error);
    });
});

module.exports = wishRouter;
