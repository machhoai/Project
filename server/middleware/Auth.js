const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../Models/UserModel');

// tạo token cho user
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    })
}

// hàm bảo vệ middleware
const protect = asyncHandler(async (req, res, next) => {
    let token;
    // check nếu token tồn tại trong headers
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        // set token từ Bearer token trong header
        try {
            token = req.headers.authorization.split(" ")[1];
            // verify token và lấy id của user
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // lấy id của user từ decoded token
            req.user = await User.findById(decoded.id).select("-password");
            if (!req.user) {
                res.status(401);
                throw new Error("User not found");
            }

            next();
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized, token failed")
        }
    }
    // nếu token không có trong headers thì gửi lỗi
    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
});

// admin middleware
const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401);
        throw new Error("Not authorized as an admin");
    }
}

module.exports = { generateToken, protect, admin }