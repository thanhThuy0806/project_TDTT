// routes/firestore.js
const express = require('express');
const router = express.Router();
const firestoreController = require('../controllers/firestoreController');

router.post('/users', firestoreController.createUserProfile);
router.get('/users/:userId', firestoreController.getUserProfile);
router.put('/users/:userId', firestoreController.updateUserProfile);
router.delete('/users/:userId', firestoreController.deleteUserProfile);

module.exports = router;