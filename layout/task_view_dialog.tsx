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
}
export default function TaskDialog ({ data, open, setOpen }: func) {
    
    const { authUser, loading, signOut } = useAuth();
    const [isDelete, setIsDelete] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("");
    const [desc, setDesc] = useState<string>("");

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
                <DialogTitle style={{minWidth: '40vw'}}>
                <div style={{display: 'inline-flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
                    <Typography use={'headline6'}> Todo Task Details </Typography>
                    <IconButton style={{float:'right'}} icon="/cancel_black.svg" onClick={() => {setOpen(false)}} />
                    </div>
                </DialogTitle>
                <DialogContent>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', whiteSpace: 'pre-line'}}>
                    <Typography style={{paddingBottom: '5px'}} use="headline5"><b>Title:</b> {data.title}</Typography>
                    <Typography style={{paddingBottom: '5px'}} use="subtitle2"><b>Description:</b> {data.desc}</Typography>
                    <Typography style={{paddingBottom: '5px'}} use="subtitle2"><b>Is Marked Completed:</b> {data.isComplete ? 'True' : 'false'}</Typography>
                </div>
                </DialogContent>
            </Dialog>  
        </>
    )
}