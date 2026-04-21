require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// MySQL 연결
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.log("DB 연결 실패:", err);
  } else {
    console.log("MySQL 연결 성공");
  }
});

// 폼 저장 API
app.post("/applications", (req, res) => {
  const { teamName, leader, phone, members, genre, privacy } = req.body;

  const sql = `
    INSERT INTO applications
    (team_name, leader, phone, members, genre, privacy_agreed)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [teamName, leader, phone, members, genre, privacy], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: err });
    }

    res.json({ success: true });
  });
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});