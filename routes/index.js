const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController')

// Do work here
// router.get('/', (req, res) => {
  // res.send('Hey! It works!');
  // res.json(req.query);
  // res.render('hello', {
  //   name: 'dan',
  //   age: 20
  // });
// });

router.get('/', storeController.homePage);
router.get('/add', storeController.addStore);
router.post('/add', storeController.createStore);

// variable in router
// router.get('/reverse/:name', (req, res) => {
//   const reverse = [...req.params.name].reverse().join('');
//   res.send(reverse);
// })

module.exports = router;
