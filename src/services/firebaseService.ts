import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  setDoc, 
  onSnapshot,
  query,
  FirestoreError 
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Guide, Part } from '../types';

interface FirestoreErrorInfo {
  error: string;
  operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
  path: string | null;
  authInfo: {
    userId: string;
    email: string;
    emailVerified: boolean;
    isAnonymous: boolean;
    providerInfo: any[];
  }
}

const handleFirestoreError = (error: FirestoreError, operation: string, path: string | null = null) => {
  if (error.code === 'permission-denied') {
    const errorInfo: FirestoreErrorInfo = {
      error: error.message,
      operationType: operation as any,
      path,
      authInfo: {
        userId: auth.currentUser?.uid || 'anonymous',
        email: auth.currentUser?.email || 'none',
        emailVerified: auth.currentUser?.emailVerified || false,
        isAnonymous: auth.currentUser?.isAnonymous || true,
        providerInfo: auth.currentUser?.providerData || []
      }
    };
    throw new Error(JSON.stringify(errorInfo));
  }
  throw error;
};

export const guidesCollection = collection(db, 'guides');
export const partsCollection = collection(db, 'parts');

export const firebaseService = {
  // Real-time subscriptions
  subscribeGuides(callback: (guides: Guide[]) => void) {
    console.log("Subscribing to guides...");
    return onSnapshot(guidesCollection, (snapshot) => {
      console.log(`Guides snapshot received. Count: ${snapshot.docs.length}`);
      const guides = snapshot.docs.map(doc => ({ ...doc.data() } as Guide));
      callback(guides);
    }, (error) => {
      console.error("Guides subscription error:", error);
      handleFirestoreError(error, 'list', 'guides');
    });
  },

  subscribeParts(callback: (parts: Part[]) => void) {
    console.log("Subscribing to parts...");
    return onSnapshot(partsCollection, (snapshot) => {
      console.log(`Parts snapshot received. Count: ${snapshot.docs.length}`);
      const parts = snapshot.docs.map(doc => ({ ...doc.data() } as Part));
      callback(parts);
    }, (error) => {
      console.error("Parts subscription error:", error);
      handleFirestoreError(error, 'list', 'parts');
    });
  },

  async getGuides(): Promise<Guide[]> {
    try {
      const snapshot = await getDocs(guidesCollection);
      return snapshot.docs.map(doc => ({ ...doc.data() } as Guide));
    } catch (error) {
      return handleFirestoreError(error as FirestoreError, 'list', 'guides');
    }
  },

  async getGuideById(id: string): Promise<Guide | null> {
    try {
      const docRef = doc(db, 'guides', id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return snapshot.data() as Guide;
      }
      return null;
    } catch (error) {
      return handleFirestoreError(error as FirestoreError, 'get', `guides/${id}`);
    }
  },

  async getParts(): Promise<Part[]> {
    try {
      const snapshot = await getDocs(partsCollection);
      return snapshot.docs.map(doc => ({ ...doc.data() } as Part));
    } catch (error) {
      return handleFirestoreError(error as FirestoreError, 'list', 'parts');
    }
  },

  // Seeding function for admins
  async seedDatabase(guides: Guide[], parts: Part[]) {
    try {
      for (const guide of guides) {
        await setDoc(doc(db, 'guides', guide.id), guide);
      }
      for (const part of parts) {
        await setDoc(doc(db, 'parts', part.id), part);
      }
    } catch (error) {
      return handleFirestoreError(error as FirestoreError, 'write', 'multiple');
    }
  }
};
