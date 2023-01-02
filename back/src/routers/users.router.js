const express = require('express');
const { check } = require('express-validator');
const { checkExistence } = require('../middleware');
const { usersController } = require('../controllers');

const router = express.Router();

/** @route      GET /api/users
 *  @desc       fetch all the users
 */
// router.route('/')
//   .get(usersController.getAllUsers);

/** @route      GET /api/users/:id
 *  @desc       fetch single user
 */
router.route('/user')
  .get(usersController.getOneUser);

/** @route      POST /api/users/:id
 *  @desc       register a new user
 */
router.route('/client')
  .post(


    // checkExistence,
    usersController.ClientRegister,
  );

  router.route('/lawyer')
  .post(


    // checkExistence,
    usersController.LawyerRegister,
  );
module.exports = router;
