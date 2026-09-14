'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabaseBrowser } from '../../lib/supabase-browser';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = supabaseBrowser();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (data.session) {
      // Email confirmation is off — the user is already logged in.
      router.push('/account');
      router.refresh();
      return;
    }

    // Email confirmation is required before a session is issued.
    setCheckEmail(true);
  };

  if (checkEmail) {
    return (
      <main className="auth-page">
        <div className="auth-card">
          <p className="auth-card__eyebrow">Almost there</p>
          <h1 className="auth-card__title">Check your email</h1>
          <p className="auth-success">
            We've sent a confirmation link to <strong>{email}</strong>. Click it to activate your
            account, then come back and log in.
          </p>
          <p className="auth-switch">
            <Link href="/login">Back to log in</Link>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <p className="auth-card__eyebrow">Join Redline</p>
        <h1 className="auth-card__title">Create your account</h1>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span>Full name</span>
            <input
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label className="auth-field">
            <span>Email</span>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="auth-field">
            <span>Password</span>
            <input
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Sign up'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      </div>
    </main>
  );
}
