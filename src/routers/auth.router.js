const express = require('express');
const { check } = require('express-validator');
const { auth } = require('../middleware');
const { authController } = require('../controllers');

const router = express.Router();

/** @route      GET /api/auth
 *  @desc       fetch logged-in user details
 */
router.route('/')
  .get(
    auth,
    authController.loadUser,
  );

/** @route      POST /api/auth
 *  @desc       log in user
 */
router.route('/login')
  .post(
    authController.login,
  );

module.exports = router;
