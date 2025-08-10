import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

function validateEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

function validatePassword(password) {
  return password.length >= 8;
}

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'magic'
  const [errorMsg, setErrorMsg] = useState({ email: '', password: '', general: '' });
  const [infoMsg, setInfoMsg] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    setErrorMsg({ email: '', password: '', general: '' });
    setInfoMsg('');

    if (!validateEmail(email)) {
      setErrorMsg((prev) => ({ ...prev, email: 'Please enter a valid email.' }));
      return;
    }
    if (mode !== 'magic' && !validatePassword(password)) {
      setErrorMsg((prev) => ({ ...prev, password: 'Password must be at least 8 characters.' }));
      return;
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setErrorMsg((prev) => ({ ...prev, general: error.message }));
        }
      } else if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) {
          setErrorMsg((prev) => ({ ...prev, general: error.message }));
        } else {
          setInfoMsg('Signup successful! Please check your email to confirm your account.');
          setEmail('');
          setPassword('');
        }
      } else if (mode === 'magic') {
        // Send magic link for passwordless login
        const { data, error } = await supabase.auth.signInWithOtp({ email });
        if (error) {
          setErrorMsg((prev) => ({ ...prev, general: error.message }));
        } else {
          setInfoMsg('Magic link sent! Check your email to log in.');
          setEmail('');
        }
      }
    } catch (err) {
      setErrorMsg((prev) => ({ ...prev, general: err.message || 'An error occurred.' }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">
        {mode === 'login' && 'Sign in'}
        {mode === 'signup' && 'Create account'}
        {mode === 'magic' && 'Magic Link Login'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          className={`w-full p-2 border rounded ${errorMsg.email ? 'border-red-500' : ''}`}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errorMsg.email && <div className="text-red-600 text-xs">{errorMsg.email}</div>}

        {mode !== 'magic' && (
          <>
            <input
              type="password"
              className={`w-full p-2 border rounded ${errorMsg.password ? 'border-red-500' : ''}`}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errorMsg.password && <div className="text-red-600 text-xs">{errorMsg.password}</div>}
          </>
        )}

        <div className="flex items-center justify-between">
          <button
            disabled={loading}
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {loading
              ? 'Please wait...'
              : mode === 'login'
              ? 'Sign in'
              : mode === 'signup'
              ? 'Create account'
              : 'Send magic link'}
          </button>
          <button
            type="button"
            onClick={() => {
              setErrorMsg({ email: '', password: '', general: '' });
              setInfoMsg('');
              if (mode === 'login') setMode('signup');
              else if (mode === 'signup') setMode('magic');
              else setMode('login');
            }}
            className="text-sm text-blue-600"
          >
            {mode === 'login'
              ? 'Create account'
              : mode === 'signup'
              ? 'Use magic link login'
              : 'Have an account? Sign in'}
          </button>
        </div>

        {errorMsg.general && <div className="text-red-600 text-sm mt-2">{errorMsg.general}</div>}
        {infoMsg && <div className="text-green-600 text-sm mt-2">{infoMsg}</div>}
      </form>
      <div className="mt-4 text-xs text-gray-500">Passwords are handled securely by Supabase Auth.</div>
    </div>
  );
}
