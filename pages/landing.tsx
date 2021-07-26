import React, { useState, useEffect, HtmlHTMLAttributes } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router';
import { useAuth } from '../context/authContext';
import Header from '../layout/header';
import { saveData, getCollectionData, deleteDocument } from '../lib/functions';
import SingleItem from '../layout/singleItem';

import { Button } from "@rmwc/button";
import { TextField } from '@rmwc/textfield';
import { Typography } from "@rmwc/typography";
import { Avatar } from '@rmwc/avatar';
import {List} from '@rmwc/list';
import { Snackbar, SnackbarAction } from '@rmwc/snackbar';

type TodoItem = {
    createdAt: Date // the date and time the todo was created
    isComplete: boolean
    owner: string // the UID of the user who created it
    title: string

}
export default function Landing() {
  const { authUser, loading, signOut } = useAuth();
  const [data, setData] = useState<boolean>(false);
  const [addLoading, setAddLoading] = useState<boolean>(false);  
  const [addTask, setAddTask] = useState<string>("");
  const [userTodos, setUserTodos] = useState<Array<TodoItem>>([]);
  const router = useRouter();

  function validate () {

  }

  const handleAddTodo = async () => {
      if (addTask.length > 0) {
    setAddLoading(true);
    const todoToServer = {
      createdAt: new Date(),
      isComplete: false,
      owner: authUser.uid,
      title: addTask,
    };
    await saveData({ collection: 'todos', data: todoToServer }).then((response:any) => {
        console.log(response);
        let temp = userTodos;
        temp.push(response);
        setUserTodos(temp);
        (document.getElementById('add-todo-input') as HTMLInputElement).value="";
        setAddTask("");
        setAddLoading(false);
    });
    }
  };

  async function handleDelete(id:string) {
    setUserTodos(userTodos.filter((todo:any) => todo.id !== id));
    await deleteDocument({ collection: 'todos', id });
  }

  // Listen for changes on loading and authUser, redirect if needed
  useEffect(() => {
    if (!loading && !authUser) {
      router.push('/')
    }
  }, [authUser, loading, router])

  // To fetch TODOS data
  useEffect(() => {
    async function fetchTodosData() {
      let todos: any [] = await getCollectionData({
        collection: 'todos',
        where: { field: 'owner', op: '==', value: authUser?.uid },
        orderBy: { field: 'createdAt', op: 'asc'}
      });
      todos = todos.map((todo) => {
        return { ...todo };
      });
      console.log(todos)
      setUserTodos(todos);
    }
    if (authUser !== null) fetchTodosData();
  }, [authUser?.uid]);

    return(
        <div>
            <div>
            <Header display={authUser?.email} />

            <div className={styles.listMargin} style={{ minHeight: '25rem'}}>
            <TextField
                id="add-todo-input"
                required 
                className={styles.addTaskBox}
                label="Type here to add new task to the list..."                
                maxLength={200}
                onChange={(e:React.ChangeEvent<HTMLInputElement>) => setAddTask(e.target.value)}
                trailingIcon={{
                icon: '/add_circle_outline_black.svg',
                tabIndex: 0,
                onClick: () => handleAddTodo()
                }}
            />
            <div>
                <List>
                {userTodos?.map((todo, i) => {
                    return <SingleItem data={todo} deleteItem={handleDelete} key={i} />
                })}
                </List>
            </div>
            </div>
            </div>
        </div>
    )

}