import { useState, useRef } from "react";
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

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

// todo: add task finish animation
// todo: implement backend

function App() {
  const [taskTrees, setTaskTrees] = useState([]);
  const [taskDate, setTaskDate] = useState(dayjs());
  const [taskText, setTaskText] = useState('');
  const [showForm, setShowForm] = useState(false);


  // add root task
  const addRootTask = () => {
    console.log(taskText);
    const newTask = {
        id: uuidv4(),
        text: taskText,
        deadline: taskDate,
        completed: false,
        children: []
    };
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
