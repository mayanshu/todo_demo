import { createContext, useContext, Context } from 'react'
import useFirebaseAuth from '../lib/auth';
import firebase from '../lib/firebase';

const authUserContext = createContext({
  authUser: firebase.User,
  loading: true,
  signInWithEmailAndPassword: (email: string, password: string) => {},
  createUserWithEmailAndPassword: (email: string, password: string) => {},
  signOut: async () => {},
});

export const AuthUserProvider:React.FC =({ children }: any) => {
  const auth = useFirebaseAuth();
  return <authUserContext.Provider value={auth}>{children}</authUserContext.Provider>;
}

export const useAuth = () => useContext(authUserContext);