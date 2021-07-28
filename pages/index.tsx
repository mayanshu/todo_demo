/* eslint-disable @next/next/no-page-custom-font */
import React, { useState } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router';
import clsx from 'clsx';

import { useAuth } from '../context/authContext';


// import your components
import { TextField } from '@rmwc/textfield';
import { Typography } from "@rmwc/typography";
import { Snackbar, SnackbarAction } from '@rmwc/snackbar';
import { Card } from '@rmwc/card';


export default function Home() {
  const [email, setEmail] = useState<string|"">("");
  const [password, setPassword] = useState<string|"">("");
  const [error, setError] = useState<string|null>(null);
  const router = useRouter();
  const { signInWithEmailAndPassword } = useAuth();

  //Function to trigger Login  with firebase function
  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError(null)
    await signInWithEmailAndPassword(email, password)
    .then(() => {
      setError(null)
      //if successful redirect to main landing page of the site
      router.push('/landing');
    })
    .catch((error: any) => {
      setError(error?.message)
    });
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>TO-DO List</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,700;1,600;1,700&display=swap" rel="stylesheet"></link>
      </Head>

      <main className={styles.main}>
        <Typography className={clsx(styles.textBoxMargin, styles.loginTxt)} use="headline4">TODO Task Manager</Typography>
        <form style={{display:'contents'}} onSubmit={(e: React.SyntheticEvent) => onSubmit(e)}>
        <TextField icon="/person_black.svg" className={clsx(styles.textBoxMargin, styles.textBox)} outlined label="Email" onChange={(e:React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}/>
        <TextField icon="/lock_black.svg" className={clsx(styles.textBoxMargin, styles.textBox)} outlined label="Password" type="password" onChange={(e:React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}/>
        <button className={clsx(styles.loginButton, styles.btn_hover, styles.color)} type="submit" >
        LOGIN
        </button>
        </form>
      </main>
      {error && <Snackbar
          open
          message={error}
        />}
      </div>
  )
}
