import { useState, useEffect, useCallback } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  writeBatch 
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { User } from '../types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser({ ...userDoc.data(), id: userDoc.id } as User);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      const userData: User = {
        id: firebaseUser.uid,
        name,
        email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`,
        partnerId: ''
      };
      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      setUser(userData);
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        setUser({ ...userDoc.data(), id: userDoc.id } as User);
      }
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const linkPartner = async (partnerEmail: string) => {
    if (!user) return;
    
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', partnerEmail));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error('Partner not found');
    }

    const partner = querySnapshot.docs[0];
    const partnerData = partner.data() as User;

    if (partnerData.partnerId) {
      throw new Error('Partner already linked to another user');
    }

    const batch = writeBatch(db);
    batch.update(doc(db, 'users', user.id), { partnerId: partner.id });
    batch.update(doc(db, 'users', partner.id), { partnerId: user.id });
    await batch.commit();

    setUser({ ...user, partnerId: partner.id });
  };

  const getPartner = useCallback(async (partnerId: string): Promise<User | null> => {
    if (!partnerId) return null;
    
    const partnerDoc = await getDoc(doc(db, 'users', partnerId));
    if (partnerDoc.exists()) {
      return { ...partnerDoc.data(), id: partnerDoc.id } as User;
    }
    return null;
  }, []);

  return { user, loading, signUp, signIn, signOut, linkPartner, getPartner };
}