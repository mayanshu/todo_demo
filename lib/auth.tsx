import { useState, useEffect } from 'react'
import firebase from './firebase';

export default function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState<firebase.User | any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const authStateChanged = async (authState:firebase.User | any) => {
    if (!authState) {
      setLoading(false)
      return false;
    }

    setLoading(true)
    setAuthUser(authState);
    setLoading(false);
  };

  const clear = () => {
    setAuthUser(null);
    setLoading(true);
  };

  const signInWithEmailAndPassword = (email:string, password:string) =>
    firebase.auth().signInWithEmailAndPassword(email, password).then((res) => res);

  const createUserWithEmailAndPassword = (email:string, password:string) =>
    firebase.auth().createUserWithEmailAndPassword(email, password).then((res) => res);

  const signOut = () =>
    firebase.auth().signOut().then(clear);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(authStateChanged);
    return () => unsubscribe();
  }, []);

  return {
    authUser,
    loading,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
  };
}