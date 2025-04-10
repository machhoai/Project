const express = require("express");
const {
    registerUser,
    loginUser,
    updateUserProfile,
    deleteUserProfile,
    changeUserPassword,
    getLikedMovies,
    addLikedMovie,
    getUsers,
    deleteUser,
    deleteLikedMovie,
} = require("../Controllers/UserController");
const { protect, admin } = require("../middleware/Auth");
const router = express.Router();

// ******** PUBLIC ROUTES ********
router.post("/", registerUser);
router.post("/login", loginUser);

// ******** PRIVATE ROUTES ********
router.put("/", protect, updateUserProfile);
router.delete("/", protect, deleteUserProfile);
router.put("/password", protect, changeUserPassword);
router.get("/favorites", protect, getLikedMovies); // do chưa có movie để test đó bảo ơi
router.post("/favorites", protect, addLikedMovie);
router.delete("/favorites", protect, deleteLikedMovie);

// ******** ADMIN ROUTES ********
router.get("/", protect, admin, getUsers);
router.delete("/:id", protect, admin, deleteUser);

module.exports = router;
