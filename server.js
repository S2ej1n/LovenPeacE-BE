require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// MySQL 연결
// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME
// });

const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
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

  // 값 체크 - 서버에서 간단한 방어 코드
  if (!teamName || !leader || !phone || !members || !genre || !privacy) {
    return res.status(400).json({ error: "필수 값 누락" });
  }

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

// 서버 실행 (Railway 필수 설정)
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});