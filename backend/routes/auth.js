const express = require('express');
const router = express.Router();

const {signUp, signIn, forgotPassword, googleSignIn} = require('../controllers/authControllers.js');

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/forgot-password', forgotPassword);
router.post('/google', googleSignIn);

module.exports = router;