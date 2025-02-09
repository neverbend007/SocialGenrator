import { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { signIn, useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '../components/Navigation';
import { useRouter } from 'next/router';
import { supabaseAdmin } from '../lib/supabaseAdmin';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    async function checkProfile() {
      if (session?.user?.email) {
        try {
          const { data, error } = await supabaseAdmin
            .from('CustomerProfileInfo')
            .select('*')
            .eq('email', session.user.email)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error('Error checking profile:', error);
            return;
          }

          // Only redirect to account page if no profile exists
          if (!data) {
            console.log('No profile found, redirecting to complete profile');
            router.push('/account');
          }
          // Don't redirect if profile exists - let them stay on the home page
        } catch (err) {
          console.error('Failed to check profile:', err);
        }
      }
    }

    if (status === "authenticated") {
      checkProfile();
    }
  }, [session, status, router]);

  const handleSignIn = async () => {
    try {
      await signIn('google');
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleGetStarted = () => {
    router.push('/pricing');
  };

  return (
    <>
      <Navigation session={session} />
      
      <div className="container">
        <div className="hero-container">
          <div className="hero-logo">
            <Image 
              src="/logo.png" 
              alt="AI Content Generator Logo" 
              width={120} 
              height={120} 
              priority
              className="hero-logo-image"
            />
          </div>
          <h1 className="hero-title">
            Generate Engaging Content with AI
          </h1>
          <p className="hero-text">
            Transform your web presence with AI-powered content generation. 
            Our tool analyzes your website and creates tailored content that 
            resonates with your audience.
          </p>
          {session ? (
            <Link href="/tool-run" className="cta-button">
              Start Generating Content
            </Link>
          ) : (
            <button onClick={handleGetStarted} className="cta-button">
              Get Started Now
            </button>
          )}
        </div>
        <Toaster position="top-center" />
      </div>
    </>
  );
}