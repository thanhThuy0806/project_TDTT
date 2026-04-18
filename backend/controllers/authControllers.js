//Dùng cho các tác vụ quản trị (như tạo User bằng Admin SDK ở hàm signUp)
const admin = require('../config/firebase');

//Dùng cho các tác vụ phía Client (như Quên mật khẩu/Đăng nhập)
const { initializeApp } = require('firebase/app');
const { getAuth, sendPasswordResetEmail } = require('firebase/auth'); 

//Cấu hình Firebase Client SDK
const firebaseConfig = {
    apiKey: process.env.FIREBASE_WEB_API_KEY, //tên biến này để phân biệt với Admin Key
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
};

//Khởi tạo Firebase App và Auth instance
const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp); 


exports.signUp = async (req, res) => {
    try {
        const {email, password, passwordValidation} = req.body; 

        if(!email || !password || !passwordValidation){
           return res.status(400).json({message: 'Vui lòng nhập đầy đủ thông tin'});
        }

        if (password.length < 6) {
        return res.status(400).json({ message: 'Mật khẩu ít nhất 6 ký tự' });
        }

        if(password !== passwordValidation){
            return res.status(400).json({message: 'Mật khẩu xác nhận không khớp'});
        }

        const userRecord = await admin.auth().createUser(
            {
                email,
                password,
            }
        );

        res.status(201).json({
            success:true,
            message: 'Đăng ký thành công',
            uid: userRecord.uid,
            email: userRecord.email,
        })
    
        
    }
    catch (error){
    console.error('SignUp error', error);

    switch (error.code) {
        case 'auth/invalid-email':
            return res.status(400).json({message: 'Email không hợp lệ'});

        case 'auth/email-already-exists':
            return res.status(400).json({message: 'Email đã tồn tại'});

        case 'auth/invalid-password':
        case 'auth/weak-password':
            return res.status(400).json({message: 'Mật khẩu quá yếu'});

        case 'auth/operation-not-allowed':
            return res.status(500).json({message: 'Chức năng chưa được bật'});

        default:
            return res.status(500).json({message: 'Lỗi máy chủ'});
    }
    }
}; 

exports.signIn = async (req, res) => {
    try{
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).json({message: 'Vui lòng nhập email và mật khẩu'});
        }

        const apiKey = process.env.FIREBASE_WEB_API_KEY;
        const response = await fetch(
       `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
       {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
       });

       const data = await response.json();
       if (!response.ok) {
       let message = 'Đăng nhập thất bại';

       switch (data.error?.message) {
            case 'EMAIL_NOT_FOUND':
                message = 'Email không tồn tại';
            break;

            case 'INVALID_PASSWORD':
                message = 'Sai mật khẩu';
            break;

            case 'USER_DISABLED':
                message = 'Tài khoản đã bị vô hiệu hóa';
            break;

            case 'INVALID_EMAIL':
                message = 'Email không hợp lệ';
            break;

            case 'TOO_MANY_ATTEMPTS_TRY_LATER':
                message = 'Bạn đã thử quá nhiều lần, vui lòng thử lại sau';
            break;
        }

        return res.status(401).json({ message });
        }
        res.json({
        message: 'Đăng nhập thành công',
        idToken: data.idToken,
        refreshToken: data.refreshToken,
        expiresIn: data.expiresIn,
        localId: data.localId,
        email: data.email,
       });
       
       }
    catch (error){
    console.error('SignIn error', error);
    return res.status(500).json({message: 'Lỗi máy chủ, vui lòng thử lại'});
    }
}

exports.forgotPassword = async (req, res) =>{
    try{
        const {email} = req.body;
        if(!email){
           return res.status(400).json({message: 'Vui lòng nhập địa chỉ email'});
        }

        await sendPasswordResetEmail(firebaseAuth, email);
        return res.json({message: 'Email đặt lại mật khẩu đã được gửi.'});
    }
    catch (error){
    console.error('Forgot password error:', error);

    switch (error.code) {
        case 'auth/user-not-found':
            return res.status(404).json({message: 'Không tìm thấy email'});
        case 'auth/invalid-email':
            return res.status(400).json({message: 'Email không hợp lệ'});
        case 'auth/too-many-requests':
            return res.status(429).json({message: 'Bạn đã gửi quá nhiều yêu cầu, thử lại sau'});
        default:
            return res.status(500).json({message: 'Lỗi máy chủ'});
    }
    }
};

exports.googleSignIn = async (req, res) =>{
    try{
        const { idToken } = req.body;

        if(!idToken){
            return res.status(400).json({message:'Thiếu ID token'});
        }

        //Xác minh token từ Firebase Admin SDK
        const decodedToken = await admin.auth().verifyIdToken(idToken);

        if(decodedToken.firebase?.sign_in_provider !== 'google.com'){
            return res.status(401).json({message:'Token không phải từ Google'});
        }

        const { uid, email } = decodedToken;

        const name = decodedToken.name || null;
        const picture = decodedToken.picture || null;

        return res.json({
        message:'Đăng nhập Google thành công',
        user:{uid,email,name,picture}
        });
    }
    
    catch (error){
        console.error('Google Sign-In error:');
        //Xử lí trường hợp token lỗi hoặc hết hạn 
        switch(error.code){

        case 'auth/id-token-expired':
        return res.status(401).json({message:'Token hết hạn'});

        case 'auth/invalid-id-token':
        case 'auth/argument-error':
        return res.status(401).json({message:'Token không hợp lệ'});

        case 'auth/id-token-revoked':
        return res.status(401).json({message:'Token đã bị thu hồi'});

        default:
        return res.status(500).json({message:'Lỗi máy chủ'});
        }
    }
};