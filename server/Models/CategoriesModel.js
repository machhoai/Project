const mongoose = require("mongoose")

const CategoriesSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Categories", CategoriesSchema);