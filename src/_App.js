import React, { useState, useEffect } from 'react';
import {v4 as uuidv4} from 'uuid';
import './App.css';
import './Todo';

function App() {
  const [taskTree, setTaskTree] = useState([]);
  const [alertClass, setAlertClass] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      checkDeadlines(taskTree);
    }, 60 * 1000); // check deadlines every minute

    return () => clearInterval(interval);
  }, [taskTree]);

  function addTask(text, deadline) {
    const newTask = {
      id: uuidv4(),
      text,
      deadline: new Date(deadline),
      children: [],
    };

    setTaskTree((prevTaskTree) => [...prevTaskTree, newTask]);
  }

  function addChildTask(parentId, text, deadline) {
    const parentTask = findTaskById(parentId);

    if (!parentTask) {
      throw new Error('Parent task not found');
    }

    if (deadline > parentTask.deadline) {
      throw new Error('Child task deadline cannot be later than parent task deadline');
    }

    const newTask = {
      id: uuidv4(),
      text,
      deadline: new Date(deadline),
      children: [],
    };

    setTaskTree((prevTaskTree) => {
      const updatedTaskTree = [...prevTaskTree];
      const parentIndex = updatedTaskTree.findIndex((task) => task.id === parentId);
      updatedTaskTree[parentIndex].children.push(newTask);
      return updatedTaskTree;
    });
  }

  function findTaskById(id) {
    let task;

    function search(tasks) {
      for (const task of tasks) {
        if (task.id === id) {
          return task;
        }

        if (task.children.length > 0) {
          task = search(task.children);

          if (task) {
            return task;
          }
        }
      }
    }

    task = search(taskTree);

    return task;
  }

  function checkDeadlines(tasks, now = new Date()) {
    for (const task of tasks) {
      if (isImminent(task.deadline, now)) {
        setAlertClass('task-tree--alert');
      }

      if (task.children.length > 0) {
        checkDeadlines(task.children, now);
      }
    }
  }

  function isImminent(deadline, now) {
    const diff = deadline - now;
    return diff > 0 && diff <= 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  }

  return (
    <div className={`task-tree ${alertClass}`}>
      <h1>TaskTree</h1>
      <Todo tasks={tasks} />
    </div>
  );
}

export default App;