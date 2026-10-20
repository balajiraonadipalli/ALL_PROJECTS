import React,{useState} from 'react';

function TodoList()
{
    const [tasks,settasks]=useState([]);
    const [newtask,setNewtask]=useState("");
    function handleInputChange(e)
    {
        setNewtask(e.target.value);
    }
    function addTask()
    {
        if(newtask.trim()!=="")
        {
            settasks(c =>[...c,newtask]);
            setNewtask("");
        }

    }
    function removeTask(index)
    {
        const UpdatedTasks=tasks.filter((_,i)=> i!==index);
        settasks(UpdatedTasks);
    }
    function moveUp(index)
    {
        if(index>0)
        {
            const updated=[...tasks];
            [updated[index],updated[index-1]]=[updated[index-1],updated[index]];
            settasks(updated);
        }
    }
    function moveDown(index)
    {
        if(index<tasks.length-1)
            {
                const updated=[...tasks];
                [updated[index],updated[index+1]]=[updated[index+1],updated[index]];
                settasks(updated);
            }
    }
    return(
        <>
    <div className="toDo">
        <h1>
            Perform your Task
        </h1>
        <div className="toinput">
    <input type='text' placeholder='Enter the Task' className='Input' onChange={handleInputChange}/>
    <button className="addBut" onClick={addTask}>
        Add Button
    </button>
    </div>
    <div className="boxses">
        <ol>
            {tasks.map((task,index)=>
            <li key={index}>
                <span className='text'>{task}</span>
                <button className='delete-but' onClick={()=> removeTask(index)}>
                Delete
                </button>
                <button className='up' onClick={()=>moveUp(index)}>
                ⬆️
                </button>
                <button className='down' onClick={()=>moveDown(index)}>
                ⬇️
                </button>
                
            </li>)}
        </ol>
        </div>
    </div>
        </>
    );
}

export default TodoList