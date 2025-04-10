const express = require("express");
const { protect, admin } = require("../middleware/Auth");
const {
    importMovies,
    getMovies,
    getMovieById,
    getTopRatedMovies,
    getRandomMovies,
    createReviewMovie,
    updateMovie,
    deleteMovie,
    deleteAllMovie,
    createMovie,
} = require("../Controllers/MoviesController");
const router = express.Router();

// ******** PUBLIC ROUTES ********
router.post("/import", importMovies);
router.get("/", getMovies);
router.get("/:id", getMovieById);
router.get("/rated/top", getTopRatedMovies);
router.get("/random/all", getRandomMovies);

// ******** PRIVATE ROUTES ********
router.post("/:id/reviews", protect, createReviewMovie);

// ******** ADMIN ROUTES ********
router.put("/:id", protect, admin, updateMovie);
router.delete("/:id", protect, admin, deleteMovie);
router.delete("/", protect, admin, deleteAllMovie);
router.post("/", protect, admin, createMovie)

module.exports = router;
