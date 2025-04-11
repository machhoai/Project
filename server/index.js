const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = 5000;
const uri = "mongodb+srv://admin:11122004@cluster0.fv5recd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const cors = require('cors');
app.use(cors({
  origin: 'https://vlu-nhom02.vercel.app', // hoặc '*' nếu muốn mở toàn bộ (không khuyến khích cho production)
}));

const mongoose = require('mongoose');
// const dbConnect = require('./db_connect.js');

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.use(express.json());

// Tạo hàm lấy dữ liệu từ MongoDB
async function getDataFromDB() {
    try {
      // Kết nối MongoDB
      await client.connect();
  
      // Chọn database và collection
      const database = client.db("Movies_Store"); // Thay bằng tên database của bạn
      const collection = database.collection("movies"); // Thay bằng tên collection của bạn
  
      // Lấy tất cả dữ liệu trong collection
      const movies = await collection.find({}).toArray(); 
  
      return movies;
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu:", err);
      throw err;
    } finally {
      // Đảm bảo rằng client sẽ đóng kết nối khi xong
      await client.close();
    }
}

// Tạo route để lấy dữ liệu từ MongoDB
app.get('/api/movies', async (req, res) => {
    try {
      const movies = await getDataFromDB();
      res.status(200).json(movies);  // Trả dữ liệu dưới dạng JSON
    } catch (err) {
      res.status(500).send("Lỗi khi lấy dữ liệu từ MongoDB");
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});