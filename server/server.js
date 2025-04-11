const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const userRouter = require('./Routes/UserRoute');
const moviesRouter = require('./Routes/MoviesRoute');
const categoriesRouter = require('./Routes/CategoriesRoute');
const uploadRoute = require("./Routes/UploadRoute");
const topicRoute = require("./Routes/TopicRoute");
const { errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

const app = express()
app.use(cors())
app.use(express.json())

// Ket noi database
connectDB();

// home 
app.get('/', (req, res) => res.send('Hello World!'))

// router khác
app.use("/api/users", userRouter);
app.use("/api/movies", moviesRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/upload", uploadRoute);
app.use("/api/topics", topicRoute);

// xử lí lỗi middleware ---> luôn đặt ở cuối trước các router để throw lỗi json
app.use(errorHandler)

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Máy chủ đang chạy trên cổng này http://localhost:${PORT}`))