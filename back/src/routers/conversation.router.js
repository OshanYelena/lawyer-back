const express = require('express');
const { checkExistence } = require('../middleware');
const { conController } = require('../controllers');

const router = express.Router();


router.route('/chat/create')
  .post(
    // checkExistence,
    conController.conversationCreate,
  );

  router.route('/chat/create')
  .get(
    // checkExistence,
    conController.conversationGet
  );

  // chat accept
  router.route('/chat/accept')
  .post(
    // checkExistence,
    conController.conversationAccept,
  );


  //client conversation
  router.route('/chat/conversation/client')
  .post(
    // checkExistence,
    conController.clientConversation,
  );

  //lawyer conversation
  router.route('/chat/conversation/lawyer')
  .post(
    // checkExistence,
    conController.lawyerConversation,
  );

module.exports = router;
