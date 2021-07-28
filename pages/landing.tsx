import React, { useState, useEffect, HtmlHTMLAttributes } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router';
import { useAuth } from '../context/authContext';
import Header from '../layout/header';
import TaskDialog from '../layout/task_add_dialog';
import { saveData, getCollectionData, deleteDocument } from '../lib/functions';
import SingleItem from '../layout/singleItem';
import clsx from 'clsx';

import { Button } from "@rmwc/button";
import { TextField } from '@rmwc/textfield';
import { Typography } from "@rmwc/typography";
import { Avatar } from '@rmwc/avatar';
import { List } from '@rmwc/list';
import { Snackbar, SnackbarAction } from '@rmwc/snackbar';
import { Fab } from '@rmwc/fab';
import { CircularProgress } from '@rmwc/circular-progress';
import { DataTable, DataTableContent, DataTableHead, DataTableRow, DataTableHeadCell, DataTableBody, DataTableCell } from '@rmwc/data-table';

type TodoItem = {
  id: string
  createdAt: Date // the date and time the todo was created
  isComplete: boolean
  owner: string // the UID of the user who created it
  title: string
  desc: string
}
export default function Landing() {
  const { authUser, loading, signOut } = useAuth();
  const [intialLoading, setInitialLoading] = useState<boolean>(true);
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [addTask, setAddTask] = useState<string>("");
  const [userTodos, setUserTodos] = useState<Array<TodoItem>>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const router = useRouter();

  const handleAddTodo = async () => {
    if (addTask.length > 0) {
      setAddLoading(true);
      const todoToServer = {
        createdAt: new Date(),
        isComplete: false,
        owner: authUser?.uid,
        title: addTask,
      };
      await saveData({ collection: 'todos', data: todoToServer }).then((response: any) => {
        console.log(response);
        let temp = userTodos;
        temp.push(response);
        setUserTodos(temp);
        setAddTask("");
        setAddLoading(false);
      });
    }
  };

  function handleNewTask(obj: TodoItem) {
    let temp = userTodos;
    temp.push(obj);
    setUserTodos(temp);
    return true;
  }

  async function handleDelete(id: string) {
    setUserTodos(userTodos.filter((todo: any) => todo.id !== id));
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
      let todos: Array<any> = await getCollectionData({
        collection: 'todos',
        where: { field: 'owner', op: '==', value: authUser?.uid },
        orderBy: { field: 'createdAt', op: 'asc' }
      }) as any[];
      todos = todos.map((todo) => {
        return { ...todo };
      });
      console.log(todos)
      setUserTodos(todos);
      setInitialLoading(false);
    }
    if (authUser !== null) fetchTodosData();
  }, [authUser, authUser?.uid]);

  useEffect(() => {

  }, [])

  return (
    <>
      <Header display={authUser?.email} />
      <div className={styles.landingContainer}>
        <div className={styles.listMargin}>
          {intialLoading ? (
            <div className={styles.verticalAlign} style={{height: '100%', justifyContent: 'center'}}>
              <CircularProgress size="xlarge" />
            </div>
          ) : (
            <div>
            {userTodos?.length > 0 ? (
              <DataTable style={{ width: '100%', backgroundColor: '#eee' }}>
                <DataTableContent>
                  <DataTableHead>
                    <DataTableRow>
                      <DataTableHeadCell alignStart>Tasks</DataTableHeadCell>
                      <DataTableHeadCell alignMiddle>Description</DataTableHeadCell>
                      <DataTableHeadCell alignEnd style={{ paddingRight: '32px' }}>Actions</DataTableHeadCell>
                    </DataTableRow>
                  </DataTableHead>
                  <DataTableBody>
                    {userTodos?.map((todo, i) => {
                      return <SingleItem data={todo} deleteItem={handleDelete} key={i} />
                    })}
                  </DataTableBody>
                </DataTableContent>
              </DataTable>
            ) : (
              <div className={styles.emptyTable}>
                <Typography use="headline5">
                  No task found, start adding task to see here
                </Typography>
              </div>
            )}
          </div>
          )}
          </div>
      </div>
      <Fab onClick={() => setOpenDialog(!openDialog)} className={clsx(styles.btn_hover_fab, styles.color)} style={{ right: 0, bottom: 0, position: 'absolute', width: '4vw', height: '4vw' }} icon="/add_circle_outline_black.svg" />
      {openDialog && <TaskDialog open={openDialog} setOpen={setOpenDialog} setdata={handleNewTask} />}
    </>
  )

}