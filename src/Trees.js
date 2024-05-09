import React from 'react'
import Task from './Task';

const Trees = ({taskTrees, addChildTask}) => {
    return taskTrees.map((task) => <Task task={task} addChildTask={addChildTask} key={task.id} />);
    
};

export default Trees