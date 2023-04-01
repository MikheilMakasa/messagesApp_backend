const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

dotenv.config({ path: './.env' });
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

db.connect((err) => {
  if (err) {
    console.log(err);
  }
  console.log('mysql connected');
});

app.post('/api/registerMessage', (req, res) => {
  const { sender, recipient, title, message } = req.body;
  const created_at = new Date().toISOString();
  const sql = 'INSERT INTO messages SET ?';
  const values = { sender, recipient, title, message, created_at };
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error sending message: ' + err);
      return res.status(500).send('Error sending message');
    } else {
      console.log('Message sent with ID: ' + result);
      return res.status(200).send('Message sent');
    }
  });
});

app.get('/api/messages/:recipient', (req, res) => {
  const { recipient } = req.params;
  console.log(recipient);
  const sql = 'SELECT * FROM messages WHERE recipient = ?';
  db.query(sql, recipient, (err, result) => {
    if (err) {
      return res.status(500).send('Error getting messages');
    } else {
      return res.status(200).json({ result });
    }
  });
});

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`server is listening to port: ${port}`);
});
