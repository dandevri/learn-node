const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp')
const uuid = require('uuid');
const User = mongoose.model('User');

const multerOptions = {
  storage: multer.memoryStorage(), // read it into memory and save the resized version
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if(isPhoto) {
      next(null, true);
    } else {
      next({message: 'That filetype is not allowed!'}, false);
    }
  }
}

exports.homePage = (req, res) => {
  res.render('index'); 
}

exports.addStore = (req, res) => {
  res.render('editStore', {title: 'Add Store'});
}

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
  // check if there is no file
  if(!req.file) {
    next() // skip to next middleware
    return;
  }
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  // now we resize
  const photo = await jimp.read(req.file.buffer) // stored in memory
  await photo.resize(800, jimp.AUTO); // resize
  await photo.write(`./public/uploads/${req.body.photo}`);
  // once we have written the photo keep going
  next();
}

exports.createStore = async (req, res) => {
  // id of logged in user
  req.body.author = req.user._id;
  const store = await (new Store(req.body)).save(); // returns the slug
  await store.save(); // connection to db / await the promise
  req.flash('success', `Succesfully Created ${store.name}. Care to leave a review?`);
  res.redirect(`/store/${store.slug}`);
}

exports.getStores = async (req, res) => {
  // 1. Query the DB for list of all stores
  const stores = await Store.find();
  res.render('stores', {title: 'Stores', stores});
}

const confirmOwner = (store, user) => {
  // if the store author is the same as the user id
  if(!store.author.equals(user._id)) {
    throw Error('You must own a store to edit it!');
  }
}

exports.editStore = async (req, res) => {
  // 1. find the store given id
  const store = await Store.findOne({_id: req.params.id})
  // 2. Confim owner
  confirmOwner(store, req.user);
  // 3. Render out edit form
  res.render('editStore', {title: `Edit ${store.name}`, store});
}

exports.updateStore = async (req, res) => {
  req.body.location.type = 'Point';
  // find and update the store
  const store = await Store.findOneAndUpdate({ _id: req.params.id}, req.body, {
    new: true, // return the new store instead of old one
    runValidators: true,
  }).exec();
  req.flash('success', `Succesfully update ${store.name}`);
  res.redirect(`/stores/${store._id}/edit`);
}

exports.getStoreBySlug = async (req, res, next) => {
  const store = await Store.findOne({ slug: req.params.slug }).populate('author reviews'); // query the db
  if(!store) return next();
  res.render('store', { store , title: store.name }) // pass inn the data
};

exports.getStoresByTag = async (req, res, next) => {
  const tag = req.params.tag;
  const tagQuery = tag || { $exists: true}; // if there are no tags fall back
  const tagsPromise = Store.getTagsList(); // get the list of tags
  const storesPromise = Store.find({tags: tagQuery}); // find stores that include specific tag

  //await promises and destructure them
  const [tags, stores] = await Promise.all([tagsPromise, storesPromise]); // destructure the result 
  res.render('tag', { tags, title: 'Tags', tag, stores})
}

exports.searchStores = async (req, res) => {
  const stores = await Store
  .find({
    // operators
    $text: {
      $search: req.query.q, 
    }
  }, {
    // not on date but on metadata projection
    score: { $meta: 'textScore'}
  })
  .sort({ // sort it by the value
    score: { $meta: 'textScore'}
  })
  // limit
  .limit(5)
  res.json(stores);
}

exports.mapStores = async(req, res) => {
  const coordinates = [req.query.lng, req.query.lat].map(parseFloat);
  const q = {
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates
        },
        $maxDistance: 10000 // 10km
      }
    }
};

  const stores = await Store.find(q).select('slug name description location photo').limit(10);
  res.json(stores);
}

exports.mapPage = (req, res) => {
  res.render('map', {title: 'Map'});
}

exports.heartStore = async (req, res) => {
  const hearts = req.user.hearts.map(obj => obj.toString());
  // and and pull the harts parameters
  const operator = hearts.includes(req.params.id) ? '$pull' : '$addToSet';
  const user = await User
  .findByIdAndUpdate(req.user._id,
    { [operator]: { hearts: req.params.id } },
    { new: true }
  );
  res.json(user);
};

exports.getHearts = async(req, res) => { 
  const stores = await Store.find({
    _id: {$in: req.user.hearts} // id is in array
  });
  res.render('stores', {title: 'Hearted', stores})
};

exports.getTopStores = async(req, res) => {
  const stores = await Store.getTopStores();
  res.render('topStores', { title: 'topStores', stores})
}