import styles from '../styles/Home.module.css';
import React, { useState, useEffect } from 'react';
import { deleteDocument, saveData } from '../lib/functions';
import { useAuth } from '../context/authContext';
import clsx from 'clsx';

import { TextField } from '@rmwc/textfield';
import { List, ListItem, ListDivider, ListItemMeta } from "@rmwc/list";
import { Checkbox } from "@rmwc/checkbox";
import {IconButton} from "@rmwc/icon-button";
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
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<any>>;
    setdata: (obj:TodoItem) => void;
}
export default function TaskEditDialog ({ data, open, setOpen, setdata }: func) {
    
    const { authUser, loading, signOut } = useAuth();
    const [isDelete, setIsDelete] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("");
    const [desc, setDesc] = useState<string>("");

    const onSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (title.length > 0) {
            const todoToServer = {
              createdAt: data.createdAt,
              isComplete: data.isComplete,
              owner: data.owner,
              title: title,
              desc: desc,
            };
            await saveData({ collection: 'todos', data: todoToServer, id: data.id }).then((response:any) => {
                console.log(response);
                setdata(response);
                setTitle("");
                setDesc("");
                setOpen(false);
            });
            }
      };

    useEffect(() => {
        setTitle(data?.title);
        setDesc(data?.desc);
    }, [data?.desc, data?.title])

    return (
        <>        
            <Dialog
                open={open}
                onClose={evt => {
                    console.log(evt.detail.action);
                    setOpen(false);
                }}
                onClosed={evt => console.log(evt.detail.action)}
            >
                <DialogTitle style={{width: '50vw'}}>
                <div style={{display: 'inline-flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
                    <Typography use={'headline6'}> Edit todo task </Typography>
                    <IconButton style={{float:'right'}} icon="/cancel_black.svg" onClick={() => {setOpen(false)}} />
                    </div>
                </DialogTitle>
                <DialogContent style={{textAlign: 'center'}}>
                <form style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}} onSubmit={(e: React.SyntheticEvent) => onSubmit(e)}>
                    <TextField value={title} style={{marginTop: '10px', height: '50px', width: '100%'}} className={clsx(styles.textBoxMargin, styles.textBox)} outlined label="Task Title" onChange={(e:React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}/>
                    <TextField textarea rows={4} value={desc} maxLength={1000} style={{ width: '100%'}} className={clsx(styles.textBoxMargin, styles.textBox)} outlined label="Task Description" onChange={(e:React.ChangeEvent<HTMLInputElement>) => setDesc(e.target.value)}/>
                    <div style={{width: '100%'}}>
                    <button className={clsx(styles.loginButton, styles.btn_hover, styles.color)} type="submit" >
                    SUBMIT
                    </button>
                    </div>
                </form>
                </DialogContent>
            </Dialog>  
        </>
    )
}