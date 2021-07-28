import { createContext, useContext, Context } from 'react'
import useFirebaseAuth from '../lib/auth';
import firebase from '../lib/firebase';

//Creating default context for authContext to consume with type specified
const authUserContext = createContext({
  authUser: firebase.app().auth().currentUser,
  loading: true,
  signInWithEmailAndPassword: async (email: string, password: string) => false,
  signOut: async () => {},
});

export const AuthUserProvider:React.FC =({ children }: any) => {
  const auth = useFirebaseAuth();
  //wrapping the context provider around the childrens
  return <authUserContext.Provider value={auth}>{children}</authUserContext.Provider>;
}

export const useAuth = () => useContext(authUserContext);