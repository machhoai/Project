const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Vui lòng điền đầy đủ họ tên"],
    },
    email: {
        type: String,
        required: [true, "Vui lòng điền email"],
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Vui lòng điền mật khẩu"],
        minlength: [6, "Mật khẩu ít nhất 6 kí tự"],
    },
    image: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    likedMovies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Movie",
        }
    ],
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", UserSchema);