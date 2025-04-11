const Topic = require('../Models/TopicModel');
const Movie = require('../Models/MoviesModel');
const asyncHandler = require("express-async-handler");

// ******** PUBLIC CONTROLLER ********

// GET all chủ đề
// GET /api/topics
const getAllTopic = asyncHandler(async (req, res) => {
    try {
        const topics = await Topic.find();
        res.status(200).json(topics);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//GET phim theo ID chủ đề
// GET /api/topics/:slug/movies
const getMoviesByTopicSlug = asyncHandler(async (req, res) => {
    const slug = req.params.slug;

    const topic = await Topic.findOne({ slug });
    if (!topic) {
        return res.status(404).json({ message: "Không tìm thấy chủ đề" });
    }

    const movies = await Movie.find({
        category: { $in: topic.categories }
    });

    res.status(200).json({
        topic: {
            name: topic.name,
            slug: topic.slug,
            image: topic.image
        },
        movies
    });
});

// ******** ADMIN CONTROLLER ********

// POST tạo chủ đề mới
// POST /api/topics
const createTopic = asyncHandler(async (req, res) => {
    try {
        const { name, slug, categories } = req.body;
        // nếu slug đã tồn tại thì trả về lỗi
        if (!name || !slug) {
            return res.status(400).json({ message: "Name and slug are required" });
        }
        const newTopic = new Topic({ name, slug, categories });
        await newTopic.save();

        res.status(201).json(newTopic);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT tạo chủ đề mới
// PUT /api/topics/:id
const updateTopic = asyncHandler(async (req, res) => {
    try {
        const topic = await Topic.findById(req.params.id);
        if (topic) {
            topic.name = req.body.name || topic.name;
            topic.slug = req.body.slug || topic.slug;
            topic.categories = req.body.categories || topic.categories;

            const updatedTopic = await topic.save();
            res.json(updatedTopic);
        } else {
            res.status(404).json({ message: "Topic not found" });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE tạo chủ đề mới
// DELETE /api/topics/:id
const deleteTopic = asyncHandler(async (req, res) => {
    try {
        const topic = await Topic.findById(req.params.id);
        if (topic) {
            await topic.deleteOne();
            res.status(200).json({ message: "Removed topic complete" });
        } else {
            res.status(404).json({ message: "Topic not found" });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = { getAllTopic, createTopic, updateTopic, deleteTopic, getMoviesByTopicSlug }