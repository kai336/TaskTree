import { useState, useRef } from "react";
import {v4 as uuidv4} from "uuid"
import Trees from "./Trees"



function App() {
  // initial task
  const task = {
    id: uuidv4(),
    text: "root1",
    deadline: new Date('2024-05-15'),
    completed: false,
    root: 1,
    children: [],
  };
  task.root = task.id;

  const [taskTrees, setTaskTrees] = useState([task]);

  const taskDateRef = useRef();
  const taskNameRef = useRef();


  // add root task
  const handleAddTask = () => {
    
    const task = {
      id: uuidv4(),
      text: taskNameRef.current.value,
      deadline: new Date(taskDateRef.current.value),
      completed: false,
      root: 1,
      children: []
    };

    task.root = task.id;

    setTaskTrees((parentTask) => {
      return [...parentTask, task]
    });

  };

  // add child task
  const addChildTask = (id, newTask) => {

    let newTaskTrees = [...taskTrees];
    newTaskTrees = newTaskTrees.map((taskTree) => {
      return updateTaskTree(taskTree, id, newTask);
    });
    
    setTaskTrees(newTaskTrees);
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

  return <div>
    <div>
      <input type='date' ref={taskDateRef}/>
      <input type="text" ref={taskNameRef}/>
      <button onClick={handleAddTask}>親タスクを追加</button>
    </div>
    <Trees taskTrees={taskTrees} addChildTask={addChildTask} />
  </div>;
}

export default App;
