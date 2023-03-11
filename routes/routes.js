const express = require("express");
const router = express.Router();

// Require controller modules
const index_controller = require('../controllers/indexController');
const user_controller = require('../controllers/userController');
const auth_controller = require('../controllers/authenticationController');
const message_controller = require('../controllers/messageController');

//
// INDEX ROUTES //
//

router.get('/', index_controller.home);

//
// USER ROUTES //
//

// GET user sign-up
router.get('/sign-up', user_controller.user_sign_up_get);

// POST user sign-up
router.post('/sign-up', user_controller.user_sign_up_post);

// GET user enrollment
router.get('/become-a-member', user_controller.user_member_enroll_get);

// POST user enrollment
router.post('/become-a-member', user_controller.user_member_enroll_post);

// GET user profile page
router.get('/user/:username', user_controller.user_profile_page);

// GET user settings page
router.get('/settings', user_controller.user_setting_page);

// GET moderator verification page
router.get('/mod-verification', user_controller.moderator_verification_get);

// POST moderator verification page
router.post('/mod-verification', user_controller.moderator_verification_post);


//
// AUTHENTICATION ROUTES //
//

// GET user Log In 
router.get('/log-in', auth_controller.log_in_get);

// POST user Log in
router.post('/log-in', auth_controller.log_in_post);

router.get('/log-out', auth_controller.log_out);

router.get('/log-in-failed', auth_controller.log_in_failed);

//
// MESSAGE ROUTES //
//

router.get('/add-message', message_controller.add_message_get);

router.post('/add-message', message_controller.add_message_post);

module.exports = router;