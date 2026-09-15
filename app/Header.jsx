'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';

function IconCart() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="17" cy="20" r="1.4" />
      <path d="M2.5 3h2l2.4 12.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 7H6" />
    </svg>
  );
}

function IconMenu({ open }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {open ? (
        <path d="M5 5l14 14M19 5 5 19" />
      ) : (
        <path d="M4 7h16M4 12h16M4 17h16" />
      )}
    </svg>
  );
}

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/coaching', label: 'Coaching' },
];

export default function Header() {
  const { cartCount } = useCart();
  const { user, loading, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const headerRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      headerRef.current?.classList.toggle('site-header--condensed', window.scrollY > 60);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const firstName = user?.user_metadata?.full_name?.split(' ')[0];

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <header className="site-header" ref={headerRef}>
      <div className="site-header__inner">
        <Link href="/" className="brand">
          <img src="/logo.jpg" alt="Redline" className="brand__logo" />
          <span className="brand__word">
            Redline
            <em>Supplements</em>
          </span>
        </Link>

        <nav className={`site-nav${menuOpen ? ' site-nav--open' : ''}`}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`site-nav__link${pathname === link.href ? ' site-nav__link--active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="site-header__actions">
          <button
            type="button"
            className="nav-toggle"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <IconMenu open={menuOpen} />
          </button>

          {!loading && (
            user ? (
              <div className="auth-nav">
                <Link href="/account" className="auth-nav__link">
                  {firstName || 'Account'}
                </Link>
                <button type="button" onClick={handleSignOut} className="auth-nav__logout">
                  Log out
                </button>
              </div>
            ) : (
              <Link href="/login" className="auth-nav__link">
                Log in
              </Link>
            )
          )}

          <Link
            href="/products#cart"
            className={`cart-pill${cartCount === 0 ? ' cart-pill--empty' : ''}`}
            aria-label={`View cart, ${cartCount} item${cartCount === 1 ? '' : 's'}`}
          >
            <IconCart />
            <span className="cart-pill__count">{cartCount}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
