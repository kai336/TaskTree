import { useState, useRef, useEffect } from "react";
import {v4 as uuidv4} from "uuid"
import Trees from "./components/Trees"
import ButtonAppBar from "./components/Header";
import "./css/App.css"
import { Button, Container, Checkbox, TextField, Box, Stack, createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from "dayjs";
import { jaJP } from "@mui/x-date-pickers/locales";

dayjs.locale(jaJP); 

class Task {
  constructor(id, text, deadline, completed, root, children) {
    this.id = id;
    this.text = text;
    this.deadline = deadline;
    this.completed = completed;
    this.root = root;
    this.children = children;
  }
}

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

// todo: add task finish animation
// todo: implement backend

// convert json to single task
const dataToSingleTask = (data, children) => {
  return new Task(
    data.task_id,
    data.description,
    data.deadline,
    data.completed,
    data.root_id,
    children
  )
}

// convert json to root tasks
const dataToTaskRoots = (datas) => {
  const rootTasks = datas
  .filter(data => {
    return data.task_id === data.root_id // filter root task
  })
  .map(data => { // make task
    return new Task(
      data.task_id,
      data.description,
      data.deadline,
      data.completed,
      data.root_id,
      [] // temporaly initialize children
    );
  });
  return rootTasks;
};

// wip
// get children tasks and build task tree
const taskRootsToTaskTrees = (taskRoots, datas) => {
  const taskTrees = taskRoots.map(rootTask => { // for all root tasks
    const rootData = datas.find(data => data.task_id === rootTask.task_id); // get the data of root task
    if(!rootData) {
      return null; // return null if root task is not found
    };
    const getChildTasks = (taskId) => { // return array of child tasks
      const parentTask = datas.find(data => data.task_id === taskId); // find parent task from id
      const chidlTasks = parentTask.children.map(childId => { // for all children
        const childData = datas.find(data => data.task_id === childId);
        if(!childData) {
          return null; // if child was not found, return null
        };
        return dataToSingleTask(childData, []);
      });
    };
    return dataToSingleTask(rootTask, getChildTasks(rootTask));
  });
  return taskTrees;
};

function App() {
  const [taskTrees, setTaskTrees] = useState([]);
  const [taskDate, setTaskDate] = useState(dayjs());
  const [taskText, setTaskText] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/'); // ここに実際のAPIのURLを記入
        console.log(response);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // 空の依存配列により、コンポーネントのマウント時にのみ実行されます

  if(data.length != 0){
    console.log(dataToTaskRoots(data));
    const rootTasks = dataToTaskRoots(data);
    const Tasks = taskRootsToTaskTrees(rootTasks, data);
    console.log(Tasks); // not working
  }

  // add root task
  const addRootTask = () => {
    console.log(taskText);
    const newTask = new Task(uuidv4(), taskText, taskDate, false, 0, []);
    newTask.root = newTask.id;
    setTaskTrees((parentTask) => {
      return [...parentTask, newTask]
    });
    setTaskText('');
  };

  // add child task
  const addChildTask = (id, newTask) => {
    let newTaskTrees = [...taskTrees];
    newTaskTrees = newTaskTrees.map((taskTree) => {
      return updateTaskTree(taskTree, id, newTask);
    });
    setTaskTrees(newTaskTrees);
    console.log(newTask);
  };

  const handleButtonClick = () => {
    setShowForm(!showForm);
  };

  
  // insert child task
  const updateTaskTree = (currentNode, id, newTask) => {
    if(currentNode.id === id){
      console.log('fonud');
      currentNode.children.push(newTask);
    }else if(currentNode.children){
      currentNode.children = currentNode.children.map((childNode) => {
        return updateTaskTree(childNode, id, newTask);
      });
    };
    return currentNode;
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
        <Container maxWidth='sm'>
          <ButtonAppBar />
          <Stack direction='column' sx={{my:2}} spacing={2}>
            <Button onClick={handleButtonClick}>親タスクを追加</Button>
            {showForm && (
              <Stack direction='row' sx={{my:2}} spacing={1}>
                <TextField
                  label='内容'
                  varriant='standard-basic'
                  value={taskText}
                  onChange={(newText) => setTaskText(newText.target.value)}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                  label='日付'
                  value={taskDate}
                  onChange={(newDate) => setTaskDate(newDate)}
                />
                </LocalizationProvider>
                <Button onClick={addRootTask}>追加</Button>
              </Stack>
            )}
            <Trees taskTrees={taskTrees} addChildTask={addChildTask} />
          </Stack>
      </Container>
    </ThemeProvider>
    
  );
    
}

export default App;
