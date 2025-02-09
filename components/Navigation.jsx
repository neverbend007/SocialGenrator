import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { signIn, signOut } from 'next-auth/react';

export default function Navigation({ session }) {
  const router = useRouter();
  
  const handleSignOut = async () => {
    // Clear local storage
    localStorage.clear();
    // Sign out
    await signOut();
  };

  const handleSignIn = async () => {
    try {
      await signIn('google');
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleSignUp = () => {
    router.push('/pricing');
  };

  return (
    <div className="banner">
      <div className="banner-content">
        <div className="banner-left">
          <Link href="/" className="logo-link">
            <Image 
              src="/logo.png" 
              alt="AI Content Generator Logo" 
              width={40} 
              height={40} 
              className="logo-image"
              priority
              unoptimized
            />
            <span className="app-name">Custom Content Generator</span>
          </Link>
        </div>
        
        <div className="banner-right">
          <nav className="nav-links">
            <Link href="/" className={`nav-link ${router.pathname === '/' ? 'active' : ''}`}>
              Home
            </Link>
            <Link href="/pricing" className={`nav-link ${router.pathname === '/pricing' ? 'active' : ''}`}>
              Pricing
            </Link>
            <Link href="/features" className={`nav-link ${router.pathname === '/features' ? 'active' : ''}`}>
              Features
            </Link>
            {session && (
              <>
                <Link href="/tool-run" className={`nav-link ${router.pathname === '/tool-run' ? 'active' : ''}`}>
                  Tool Run
                </Link>
                <Link href="/account" className={`nav-link ${router.pathname === '/account' ? 'active' : ''}`}>
                  My Account
                </Link>
              </>
            )}
          </nav>
          
          <div className="auth-buttons">
            {session ? (
              <button onClick={handleSignOut} className="sign-in-button">Sign out</button>
            ) : (
              <>
                <button onClick={() => signIn('google')} className="sign-in-button">Sign in</button>
                <button onClick={handleSignUp} className="sign-up-button">Sign up</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 