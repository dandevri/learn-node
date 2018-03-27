const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp')
const uuid = require('uuid');

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

exports.editStore = async (req, res) => {
  // 1. find the store given id
  const store = await Store.findOne({_id: req.params.id})
  // 2. Confim owner
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
  const store = await Store.findOne({ slug: req.params.slug }) // query the db
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