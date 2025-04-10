const express = require("express");
const { protect, admin } = require("../middleware/Auth");
const {
    getAllTopic,
    createTopic,
    updateTopic,
    deleteTopic,
    getMoviesByTopicSlug,
} = require("../Controllers/TopicController");
const router = express.Router();

// ******** PUBLIC ROUTES ********
router.get("/", getAllTopic);
router.get('/:slug/movies', getMoviesByTopicSlug);

// ******** ADMIN ROUTES ********
router.post("/", protect, admin, createTopic);
router.put("/:id", protect, admin, updateTopic);
router.delete("/:id", protect, admin, deleteTopic);

module.exports = router;
