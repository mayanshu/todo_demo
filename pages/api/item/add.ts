import type { NextApiRequest, NextApiResponse } from 'next'
import firebase from '../../../lib/firebase'

type Data = {
  name: string,
  hasData: boolean,
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    const checkUsersCollectioninFireStore = (uid:string) => {
        firebase.app().firestore().collection('users').doc(`${uid}`).get().then((doc) => {
          if(doc.exists) {
            return true;
          } else {
            return false;
          }
        }).catch(() => {
            return false;
        })
      }
      
  res.status(200).json({ name: 'John Doe', hasData: checkUsersCollectioninFireStore() })
}
