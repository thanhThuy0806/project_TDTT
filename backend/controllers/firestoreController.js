const { db, admin } = require('../config/firebase');

// Tạo mới document
exports.createUserProfile = async (req, res) => {
  try {
    const { userId, name, email } = req.body;
    const userRef = db.collection('users').doc(userId);
    
    await userRef.set({
      name,
      email,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({ message: 'Tạo người dùng thành công!' });
  } catch (error) {
    console.error('Lỗi khi tạo document:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};

// Đọc document
exports.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const userRef = db.collection('users').doc(userId);
    const doc = await userRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    res.status(200).json(doc.data());
  } catch (error) {
    console.error('Lỗi khi đọc document:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};

// Cập nhật document
exports.updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email } = req.body;
    const userRef = db.collection('users').doc(userId);
    
    await userRef.update({
      name,
      email,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(200).json({ message: 'Cập nhật người dùng thành công!' });
  } catch (error) {
    console.error('Lỗi khi cập nhật document:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};

// Xóa document
exports.deleteUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const userRef = db.collection('users').doc(userId);
    
    await userRef.delete();

    res.status(200).json({ message: 'Xóa người dùng thành công!' });
  } catch (error) {
    console.error('Lỗi khi xóa document:', error);
    res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
};