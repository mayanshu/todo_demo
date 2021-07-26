import firebase from "./firebase";
import { useAuth } from '../context/authContext';

const db = firebase.firestore();
export const getRef = ({ collection, doc }: any) => db.collection(collection).doc(doc);

export const authRef = (id:string) => {
    return getRef({ collection: 'users', doc: id });
  };

export const query = ({ collection, orderBy = null, startAt = null, limit = 20, where }:any = {}) => {
    let ref: firebase.firestore.Query<firebase.firestore.DocumentData> = db.collection(collection);
    if (startAt !== null) ref = ref.startAt(startAt);
    if (limit !== null) ref = ref.limit(limit);
    if (orderBy !== null) {
      const { field, op } = orderBy;
      ref = ref.orderBy(field, op);
    }
    if (where !== null) {
      const { field, op, value } = where;
      ref = ref.where(field, op, value);
    }
    return ref;
  };

export const getQuerySnapshotData = async (querySnapshot: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>, addUid = false) => {
 const res: any[] = [];
 querySnapshot.forEach((doc) => {
   if (doc.exists) {
     if (addUid) {
       res.push({ ...doc.data(), id: doc.id });
     } else {
       res.push({ ...doc.data() });
     }
   }
 });
 return res;
};

export const getCollectionData = ({
    collection,
    orderBy = null,
    startAt = null,
    addUid = true,
    limit = null,
    where = null,
  }:any = {}) => {
    if (!collection) return [];
    return new Promise(async (resolve, reject) => {
      const docRef = query({ collection, orderBy, startAt, limit, where });
      try {
        const querySnapshot = await docRef.get();
        const res = await getQuerySnapshotData(querySnapshot, addUid);
        resolve(res);
      } catch (error) {
        reject(error);
      }
    });
  };

  export const saveData = ({ collection = "", data = {}, id = "" }) => {
    return new Promise(async (resolve, reject) => {
      if (!collection || collection === "") reject(new Error('Set collection name'));
      try {
        const dbRef = db.collection(collection);
        let docRef;
        if (id) {
          dbRef.doc(id);
          await dbRef.doc(id).set(data);
          docRef = getRef({ collection, doc: id });
        } else {
          docRef = await dbRef.add(data);
        }
        const doc = await docRef.get();
        const { id: docId } = doc;
        const docData = doc.data();
        resolve({ id: docId, ref: docRef, ...docData });
      } catch (error) {
        reject(error);
      }
    });
  };

  export const deleteDocument = ({ collection = "", id = "" }) => {
    return new Promise(async (resolve, reject) => {
      if (!collection || collection === "") reject(new Error('Set collection name'));
      if (!id) reject(new Error('Set document id'));

      try {
        const dbRef = db.collection(collection).doc(id);
        await dbRef.delete();
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  };

  export const getUser = async (user:firebase.User) => {
    const doc = await db
      .collection('users')
      .doc(user.uid)
      .get();
    return doc.data();
  };

  export const fillUserData = async (user:firebase.User) => {
    const doc = await db
      .collection('users')
      .doc(user.uid)
      .get();
    const data = doc.data();
    if (doc.exists) {
      return { ...user, ...data };
    }
    return user;
  };
