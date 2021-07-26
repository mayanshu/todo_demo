import { createContext, useContext, Context } from 'react'
import useFirebaseAuth from '../lib/auth';
import firebase from '../lib/firebase';

const authUserContext = createContext({
  authUser: firebase.app().auth().currentUser,
  loading: true,
  signInWithEmailAndPassword: async (email: string, password: string) => false,
  signOut: async () => {},
});

export const AuthUserProvider:React.FC =({ children }: any) => {
  const auth = useFirebaseAuth();
  return <authUserContext.Provider value={auth}>{children}</authUserContext.Provider>;
}

export const useAuth = () => useContext(authUserContext);