const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController')
const userController = require('../controllers/userController')

const { catchErrors } = require('../handlers/errorHandlers'); // object desctructuring

// Do work here
// router.get('/', (req, res) => {
  // res.send('Hey! It works!');
  // res.json(req.query);
  // res.render('hello', {
  //   name: 'dan',
  //   age: 20
  // });f
// });

router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/add', storeController.addStore);
router.get('/stores/:id/edit', catchErrors(storeController.editStore))

router.post('/add', 
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.createStore),
);
router.post('/add/:id', 
   storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.updateStore)
);

router.get('/store/:slug', catchErrors(storeController.getStoreBySlug));
router.get('/tags', catchErrors(storeController.getStoresByTag));
router.get('/tags/:tag', catchErrors(storeController.getStoresByTag));

router.get('/login', userController.loginForm)
router.get('/register', userController.registerForm);

// 1. validate the data
// 2. register
// 3. log in
router.post('/register', userController.validateRegister)

// variable in router
// router.get('/reverse/:name', (req, res) => {
//   const reverse = [...req.params.name].reverse().join('');
//   res.send(reverse);
// })

module.exports = router;
