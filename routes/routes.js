const express = require("express");
const router = express.Router();

// Require controller modules
const index_controller = require('../controllers/indexController');
const user_controller = require('../controllers/userController');
const auth_controller = require('../controllers/authenticationController');

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

//
// AUTHENTICATION ROUTES //
//

// GET user Log In 
router.get('/log-in', auth_controller.log_in_get);

// POST user Log in
router.post('/log-in', auth_controller.log_in_post);


//
// MESSAGE ROUTES //
//


module.exports = router;