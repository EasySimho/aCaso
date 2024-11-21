import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { MoodEntry, User } from '../types';

export function useMoods(currentUser: User | null) {
  const [userMoods, setUserMoods] = useState<MoodEntry[]>([]);
  const [partnerMoods, setPartnerMoods] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.id || !currentUser?.partnerId) {
      setLoading(false);
      return;
    }

    const moodsRef = collection(db, 'moods');
    
    // Query for user's moods
    const userQuery = query(
      moodsRef,
      where('userId', '==', currentUser.id),
      orderBy('timestamp', 'desc')
    );

    // Query for partner's moods
    const partnerQuery = query(
      moodsRef,
      where('userId', '==', currentUser.partnerId),
      orderBy('timestamp', 'desc')
    );

    const unsubscribeUser = onSnapshot(userQuery, (snapshot) => {
      const moods: MoodEntry[] = [];
      snapshot.forEach((doc) => {
        moods.push({ id: doc.id, ...doc.data() } as MoodEntry);
      });
      setUserMoods(moods);
      setLoading(false);
    });

    const unsubscribePartner = onSnapshot(partnerQuery, (snapshot) => {
      const moods: MoodEntry[] = [];
      snapshot.forEach((doc) => {
        moods.push({ id: doc.id, ...doc.data() } as MoodEntry);
      });
      setPartnerMoods(moods);
    });

    return () => {
      unsubscribeUser();
      unsubscribePartner();
    };
  }, [currentUser]);

  const addMood = async (mood: string, intensity: number, note: string) => {
    if (!currentUser) return;

    const moodEntry = {
      userId: currentUser.id,
      mood,
      intensity,
      note,
      timestamp: serverTimestamp()
    };

    await addDoc(collection(db, 'moods'), moodEntry);
  };

  return { userMoods, partnerMoods, loading, addMood };
}