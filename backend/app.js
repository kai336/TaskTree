const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');


const app = express();
const port = 5000;

app.use(cors());

const pool = new Pool({
  user: 'user',
  host: 'localhost',
  database: 'DB',
  password: 'password',
  port: 5432,
});

app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM persons');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});