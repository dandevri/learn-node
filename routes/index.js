const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController')

const { catchErrors } = require('../handlers/errorHandlers'); // object desctructuring

// Do work here
// router.get('/', (req, res) => {
  // res.send('Hey! It works!');
  // res.json(req.query);
  // res.render('hello', {
  //   name: 'dan',
  //   age: 20
  // });
// });

router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/add', storeController.addStore);
router.post('/add', catchErrors(storeController.createStore));
router.post('/add/:id', catchErrors(storeController.updateStore));
router.get('/stores/:id/edit', catchErrors(storeController.editStore))

// variable in router
// router.get('/reverse/:name', (req, res) => {
//   const reverse = [...req.params.name].reverse().join('');
//   res.send(reverse);
// })

module.exports = router;
