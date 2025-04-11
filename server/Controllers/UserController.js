const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const User = require("../Models/UserModel");
const { generateToken } = require("../middleware/Auth");

// ******** PUBLIC CONTROLLER ********

// Đăng kí tài khoản
// POST /api/users
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, image } = req.body;

  try {
    const userExists = await User.findOne({ email });
    // check nếu có user tồn tại
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }
    // nếu không thì tạo cái user mới
    else {
      // hash password ramdom 10 ký tự
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      // taọ user trong db
      const user = User.create({
        fullName,
        email,
        password: hashPassword,
        image,
      });

      // nếu tạo user thành công thì sẽ gửi data user và token tới client
      if (user) {
        res.status(201).json({
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          image: user.image,
          isAdmin: user.isAdmin,
          token: generateToken(user._id),
        });
      } else {
        res.status(400);
        throw new Error("Invalid user data");
      }
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Đăng nhập tài khoản
// POST /api/users/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    // user tồn tại thì so sánh password với hash password sau
    // khi gửi data của user và token tới client
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        image: user.image,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    }
    // nếu không tìm thấy user hoặc password k đúng thì báo lỗi
    else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ******** PRIVATE CONTROLLER ********

// Update hồ sơ user
// PUT /api/users/profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const { fullName, email, image } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.fullName = fullName || user.fullName;
      user.email = email || user.email;
      user.image = image || user.image;

      const updateUser = await user.save();
      // gửi data update user và token tới client
      res.json({
        _id: updateUser._id,
        fullName: updateUser.fullName,
        email: updateUser.email,
        image: updateUser.image,
        isAdmin: updateUser.isAdmin,
        token: generateToken(updateUser._id),
      });
    }
    // else gửi error message
    else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete hồ sơ user
// DELETE /api/users
const deleteUserProfile = asyncHandler(async (req, res) => {
  try {
    // find user trong DB
    const user = await User.findById(req.user._id);
    // nếu đã xoá user có sẵn trong DB
    if (user) {
      // nếu user là admin thì throw error
      if (user.isAdmin) {
        res.status(400);
        throw new Error("Can't delete admin user");
      }
      // else delete user trong DB
      await user.deleteOne();
      res.json({ message: "User deleted successfully" });
    }
    // throw error
    else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Đổi mật khẩu nè
// PUT /api/users/password
const changeUserPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (user && (await bcrypt.compare(oldPassword, user.password))) {
      // hash new password
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashPassword;
      await user.save();
      res.json({ message: "Password changed" });
    } else {
      res.status(401);
      throw new Error("Invalid old");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Lấy danh sách likedMovie của user
// GET /api/users/favorites
const getLikedMovies = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("likedMovies");
    if (user) {
      res.json(user.likedMovies);
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Thêm movie yeuthich
// POST /api/users/favorites
const addLikedMovie = asyncHandler(async (req, res) => {
  const { movieId } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      // check nếu đã thích movie này rồi
      // nếu movie đã có => quăng lỗi
      if (user.likedMovies.includes(movieId)) {
        res.status(400);
        throw new Error("Movie already liked");
      }
      // else thêm movie vô db
      user.likedMovies.push(movieId);
      await user.save();
      res.json(user.likedMovies);
    } else {
      res.status(404);
      throw new Error("Movie not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Xoá movie yeuthich
// DELETE /api/users/favorites
const deleteLikedMovie = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.likedMovies = [];
      await user.save();
      res.json({ message: "All favorites movies delete successfully" });
    } else {
      res.status(404);
      throw new Error("Movie not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ******** ADMIN CONTROLLER ********

// Lấy danh sách user
// GET /api/users
const getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
});

// Xoá danh sách user
// DELETE /api/users/:id
const deleteUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      // không cho xoá admin
      if (user.isAdmin) {
        res.status(400);
        throw new Error("Can't delete admin user");
      }
      await user.deleteOne();
      res.json({ message: "User deleted successfully" });
    }
    else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
});

module.exports = {
  registerUser,
  loginUser,
  updateUserProfile,
  deleteUserProfile,
  changeUserPassword,
  getLikedMovies,
  addLikedMovie, 
  deleteLikedMovie,
  getUsers,
  deleteUser
};
