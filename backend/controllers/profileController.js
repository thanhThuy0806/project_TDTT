const { admin, db } = require('../config/firebase'); 

// Lưu hoặc cập nhật hồ sơ người dùng
exports.saveProfile = async (req, res) => {
  try {
    const userId = req.user.uid; // Lấy từ middleware xác thực
    const profileData = req.body;

    // Thêm timestamp cập nhật
    profileData.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    // Lưu vào collection 'users' với document ID = userId
    await db.collection('users').doc(userId).set(profileData, { merge: true });

    res.json({ message: 'Hồ sơ đã được lưu thành công' });
    
  } catch (error) {
    console.error('Save profile error:', error);
    res.status(500).json({ message: 'Lỗi khi lưu hồ sơ' });
  }
};

// Lấy hồ sơ người dùng
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.uid;
    const doc = await db.collection('users').doc(userId).get();

    if (!doc.exists) {
      return res.json({ profile: null });
    }

    res.json({ profile: doc.data() });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Lỗi khi lấy hồ sơ' });
  }
};