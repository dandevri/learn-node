const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
  res.render('index');
}

exports.addStore = (req, res) => {
  res.render('editStore', {title: 'Add Store'});
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
  // find and update the store
  const store = await Store.findOneAndUpdate({ _id: req.params.id}, req.body, {
    new: true, // return the new store instead of old one
    runValidators: true,
  }).exec();
  req.flash('success', `Succesfully update ${store.name}`);
  res.redirect(`/stores/${store._id/edit}`);
}