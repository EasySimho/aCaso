import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import { useMoods } from './hooks/useMoods';
import Dashboard from './components/Dashboard';
import AuthForm from './components/AuthForm';
import { User } from './types';

function App() {
  const { user, loading: authLoading, getPartner } = useAuth();
  const { userMoods, partnerMoods, loading: moodsLoading, addMood } = useMoods(user);
  const [partner, setPartner] = useState<User | null>(null);

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        if (user?.partnerId) {
          const partnerData = await getPartner(user.partnerId);
          setPartner(partnerData);
        }
      } catch (error) {
        console.error("Failed to fetch partner data:", error);
      }
    };

    fetchPartner();
  }, [user, getPartner]);

  if (authLoading || moodsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500" />
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={!user ? (
            <AuthForm />
          ) : (
            <Dashboard
              currentUser={user}
              partner={partner}
              userMoods={userMoods}
              partnerMoods={partnerMoods}
              onMoodSubmit={addMood}
            />
          )}
        />
        <Route
          path="/dashboard"
          element={user ? (
            <Dashboard
              currentUser={user}
              partner={partner}
              userMoods={userMoods}
              partnerMoods={partnerMoods}
              onMoodSubmit={addMood}
            />
          ) : (
            <AuthForm />
          )}
        />
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
