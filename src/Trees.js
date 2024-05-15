import React from 'react'
import Task from './Task';
import "./App.css";

//親タスクの配列を読み込む
const Trees = ({taskTrees, addChildTask}) => {
    return taskTrees.map((task) => 
    <div>
       <Task task={task} addChildTask={addChildTask} key={task.id} /> 
    </div>
    );
    
};

export default Trees