
import { db } from './config';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  DocumentData,
  WithFieldValue
} from 'firebase/firestore';

// Generic function to fetch all documents from a collection
export const getCollection = async <T>(collectionName: string): Promise<T[]> => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
};

// Generic function to add a document to a collection
export const addDocument = async <T extends WithFieldValue<DocumentData>>(collectionName:string, data: T) => {
    const dataWithoutId = { ...data };
    delete (dataWithoutId as any).id; // Firestore generates its own ID
    await addDoc(collection(db, collectionName), dataWithoutId);
};

// Generic function to update a document in a collection
export const updateDocument = async <T extends WithFieldValue<DocumentData>>(collectionName: string, id: string, data: T) => {
  const docRef = doc(db, collectionName, id);
  const dataWithoutId = { ...data };
  delete (dataWithoutId as any).id; // Don't try to update the ID field
  await updateDoc(docRef, dataWithoutId);
};

// Generic function to delete a document from a collection
export const deleteDocument = async (collectionName: string, id: string) => {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
};
