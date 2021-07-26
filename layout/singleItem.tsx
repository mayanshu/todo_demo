import styles from '../styles/Home.module.css';
import React, { useState, useEffect } from 'react';
import { deleteDocument, saveData } from '../lib/functions';
import { useAuth } from '../context/authContext';

import { TextField } from '@rmwc/textfield';
import { List, ListItem, ListDivider, ListItemMeta } from "@rmwc/list";
import { Checkbox } from "@rmwc/checkbox";
import {IconButton} from "@rmwc/icon-button";

type TodoItem = {
    createdAt: Date // the date and time the todo was created
    isComplete: boolean
    owner: string // the UID of the user who created it
    title: string
}

export default function SingleItem ({ data, deleteItem }): any {

    const [isCompleted, setIsCompleted] = useState<boolean>(data.isComplete);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [addTask, setAddTask] = useState<string>(data.title);

    const handleAddTodo = async () => {
        // setAddLoading(true);
        if (addTask.length > 0) {
        const todoToServer = {
          createdAt: data.createdAt,
          isComplete: isEdit ? data.isComplete : !data.isComplete,
          owner: data.owner,
          title: isEdit ? addTask : data.title,
        };
        console.log(todoToServer, data)
        await saveData({ collection: 'todos', data: todoToServer, id: data.id }).then((response:any) => {
            (document.getElementById('add-todo-input') as HTMLInputElement).value="";
            setIsEdit(false);
        });
    }
      };
    
      const handleCheckboxClick = async () => {
        setIsCompleted(!isCompleted);
        handleAddTodo();
      }

    useEffect(() => {
        setIsCompleted(data.isComplete);
        setAddTask(data.title);
    }, [data.isComplete, data.title]);

    return (
        <>
            <ListItem className={styles.verticalAlign}>
                {!isEdit ? ( 
                    <>
                    {addTask}
                    <ListItemMeta>
                        
                    <div className={styles.actionItem}>
                         <Checkbox checked={isCompleted} onClick={() => handleCheckboxClick()}/>
                         {!isCompleted && (
                             <>
                                <IconButton icon="/edit_black.svg" onClick={() => setIsEdit(!isEdit)} />
                                <IconButton icon="/delete_black.svg" onClick={() => deleteItem(data.id)} />
                             </>
                         )}
                         </div>
                     </ListItemMeta>
                     </>                   
                ):(
                    <>
                    <TextField
                        id="edit-todo-input"
                        required
                        value={addTask}
                        className={styles.addTaskBox}
                        label="Type here to edit task"                
                        maxLength={200}
                        onChange={(e:React.ChangeEvent<HTMLInputElement>) => setAddTask(e.target.value)}
                    />
                    <ListItemMeta>
                        <div className={styles.actionItem}>
                         <IconButton icon="/add_circle_outline_black.svg" onClick={() => handleAddTodo()} />
                         <IconButton icon="/cancel_black.svg" onClick={() => setIsEdit(!isEdit)} />
                         </div>
                     </ListItemMeta>
                     </>
                )}
            </ListItem>
        <ListDivider />
        </>
    )
}