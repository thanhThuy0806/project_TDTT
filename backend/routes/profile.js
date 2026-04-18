const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { saveProfile, getProfile } = require('../controllers/profileController');

// Tất cả route profile đều yêu cầu xác thực
router.post('/', authMiddleware, saveProfile);
router.get('/', authMiddleware, getProfile);

module.exports = router;