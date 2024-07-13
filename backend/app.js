const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');


const app = express();
const PORT = 5000;

app.use(cors());

const pool = new Pool({
  user: 'user',
  host: 'localhost',
  database: 'DB',
  password: 'password',
  port: 5432,
});

function queryForAddChildTask(taskId, userId, rootId, parentId, description, deadline) {
  return `
  INSERT INTO task_tree (user_id, task_id, parent_id, root_id, description, deadline)
    VALUES ('${userId}', '${taskId}', '${parentId}', '${rootId}', '${description}', '${deadline}');
  UPDATE task_tree SET children COALESCE(children, ARRAY[]::UUID[]) || '{${taskId}}'
    WHERE user_id = '${userId}' AND task_id = '${parentId}';
  `;
}

// get whole tasktrees
app.get('/tasktrees', async (req, res) => {
  try {
    console.log(req);
    const result = await pool.query('SELECT * FROM task_tree');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// add task <= ../frontend/src/components/Task.js handleAddChildTask()
app.post('/tasktrees', async (req, res) => {
  try {
    const {taskId, userId, rootId, parentId, description, deadline} = req.query;
    const queryText = queryForAddChildTask(taskId, userId, rootId, parentId, description, deadline);
    const result = await pool.query(queryText);
    res.status(200).send('added child task');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/reqtest', async (req, res) => {
  try {
    const {userId, taskId} = req.query;
    console.log(userId, taskId);
    res.status(200).send('test');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});



app.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`);
});