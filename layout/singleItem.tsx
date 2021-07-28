import styles from '../styles/Home.module.css';
import React, { useState, useEffect } from 'react';
import { deleteDocument, saveData } from '../lib/functions';
import { useAuth } from '../context/authContext';
import TaskDialog from './task_view_dialog';
import TaskEditDialog from './task_edit_dialog';

import { TextField } from '@rmwc/textfield';
import { List, ListItem, ListDivider, ListItemMeta } from "@rmwc/list";
import { Checkbox } from "@rmwc/checkbox";
import {IconButton} from "@rmwc/icon-button";
import { DataTable, DataTableContent, DataTableHead, DataTableRow, DataTableHeadCell, DataTableBody, DataTableCell } from '@rmwc/data-table';
import { Dialog, DialogTitle, DialogContent, DialogActions, DialogButton } from "@rmwc/dialog";
import { Typography } from 'rmwc';
import { Button } from "@rmwc/button";

type TodoItem = {
    id: string
    createdAt: Date // the date and time the todo was created
    isComplete: boolean
    owner: string // the UID of the user who created it
    title: string
    desc: string
}
interface func {
    data: TodoItem;
    deleteItem: (id:string) => {};
}
export default function SingleItem ({ data, deleteItem }: func) {
    const [isCompleted, setIsCompleted] = useState<boolean>(data.isComplete);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [addTask, setAddTask] = useState<string>(data.title);
    const [isDelete, setIsDelete] = useState<boolean>(false);
    const [openView, setOpenView] = useState<boolean>(false);
    const [detail, setDetail] = useState<TodoItem>(data);

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
        setDetail(data);
    }, [data, data.isComplete, data.title]);

    return (
        <>        
                    <DataTableRow>
                      <DataTableCell className={styles.titleColumn} onClick={() => setOpenView(!openView)}>
                          {detail.title}
                      </DataTableCell>
                      <DataTableCell className={styles.titleColumn} onClick={() => setOpenView(!openView)} alignMiddle>
                          {detail.desc}
                      </DataTableCell>
                      <DataTableCell alignEnd>
                        <div className={styles.actionItem} style={{float: 'right'}}>
                         <Checkbox checked={isCompleted} onClick={() => handleCheckboxClick()}/>
                         {!isCompleted && (
                            <>
                                <IconButton icon="/edit_black.svg" onClick={() => setIsEdit(!isEdit)} />
                                <IconButton icon="/delete_black.svg" onClick={() => setIsDelete(true)} />
                         
                                <Dialog
                                    open={isDelete}
                                    onClose={evt => {
                                    console.log(evt.detail.action);
                                    setIsDelete(false);
                                    }}
                                    onClosed={evt => console.log(evt.detail.action)}
                                >
                                    <DialogTitle>Warning</DialogTitle>
                                    <DialogContent>Do you want to delete this task?</DialogContent>
                                    <DialogActions>
                                    <DialogButton action="close">Cancel</DialogButton>
                                    <DialogButton action="accept" onClick={() => {deleteItem(detail.id), setIsDelete(false)}}>
                                        Confirm
                                    </DialogButton>
                                    </DialogActions>
                                </Dialog>  
                            </>
                         )}
                        </div>
                      </DataTableCell>
                    </DataTableRow> 
                    {isEdit && <TaskEditDialog data={data} open={isEdit} setOpen={setIsEdit} setdata={setDetail} />}
                    {openView && <TaskDialog data={data} open={openView} setOpen={setOpenView} />}
        </>
    )
}