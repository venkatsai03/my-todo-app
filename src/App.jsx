// src/App.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./components/Auth";
import TodoList from "./components/TodoList";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get active session on mount
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    // Listen to auth changes (magic link etc)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white text-xl">
      Loading...
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-800 p-6">
      {user ? <TodoList user={user} /> : <Auth />}
    </div>
  );
}
