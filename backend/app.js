// backend/app.js
const express = require('express');
const app = express();
const port = 5000;

app.get('/', (req, res) => {
  res.send('unti puripuri express');
});

app.listen(port, () => {
  console.log(`Express server is running on http://localhost:${port}`);
});
