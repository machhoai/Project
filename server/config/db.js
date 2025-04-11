const mongoose = require('mongoose')

module.exports.connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });
        console.log("Connected MongoDB okay")
    } catch (err) {
        console.log(`Error with ${err.message}`)
        process.exit(1)
    }
}