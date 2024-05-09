import { useRef, React } from 'react';
import {v4 as uuidv4} from 'uuid'; 
import Trees from './Trees';

const Task = ({task, addChildTask}) => {
    const taskNameRef = useRef();
    const taskDateRef = useRef();

    const handleAddTask = () => {
        const deadline = new Date(taskDateRef.current.value);
        const newTask = {id: uuidv4(), text: taskNameRef.current.value, deadline: deadline, completed: false, root: task.root, children: []};
        
        addChildTask(task.id, newTask);
        
        console.log(task)
    }

    return <div>
        <div>text: {task.text}</div>
        <div>deadline: {task.deadline.toDateString()}</div>
        <div>
            <input type='date' ref={taskDateRef}/>
            <input type="text" ref={taskNameRef}/>
            <button onClick={handleAddTask}>サブタスクを追加</button>
        </div>
        <Trees taskTrees={task.children} addChildTask={addChildTask} />
        
    </div>;
};

export default Task