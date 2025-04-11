const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, // slug này sẽ custom lại đường dẫn
    categories: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Topic', TopicSchema);