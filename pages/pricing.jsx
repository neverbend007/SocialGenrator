import { signIn, useSession, signOut } from 'next-auth/react';
import Navigation from '../components/Navigation';
import { useRouter } from 'next/router';

export default function Pricing() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleTierSelect = async (tier) => {
    try {
      if (tier === 'Enterprise') {
        await router.push({
          pathname: '/contact-enterprise',
          query: { from: 'pricing' } // Add a query parameter to track the source
        });
      } else {
        // Store selected tier in localStorage before auth
        localStorage.setItem('selectedTier', tier);
        // Redirect to Google sign in
        signIn('google');
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <>
      <Navigation session={session} />
      <div className="container">
        <h1 className="page-title">Choose Your Plan</h1>
        <div className="pricing-grid">
          {/* Single Use Plan */}
          <div className="pricing-card">
            <h2 className="pricing-tier">Single Use</h2>
            <p className="pricing-description">Cost effective for testing purposes</p>
            <div className="pricing-amount">
              <div className="price">
                <span className="currency">$</span>
                <span className="amount">5</span>
                <span className="period">/one-time</span>
              </div>
            </div>
            <div className="pricing-features">
              <div className="feature-item">
                <span className="feature-value">1</span>
                <span className="feature-label">workflow execution</span>
                <span className="feature-sublabel">single run of the generator</span>
              </div>
            </div>
            <div className="feature-list">
              <h3>Includes:</h3>
              <ul>
                <li>One-time payment</li>
                <li>Single workflow execution</li>
                <li>Basic support</li>
                <li>24-hour result access</li>
              </ul>
            </div>
            <button 
              onClick={() => handleTierSelect('Single Use')}
              className="pricing-button primary"
            >
              Select
            </button>
          </div>

          {/* Pro Plan */}
          <div className="pricing-card">
            <h2 className="pricing-tier">Pro</h2>
            <p className="pricing-description">Perfect for individual content creators</p>
            <div className="pricing-amount">
              <span className="discount-tag">20% OFF</span>
              <div className="price">
                <span className="currency">$</span>
                <span className="amount">20</span>
                <span className="period">/month</span>
              </div>
            </div>
            <div className="pricing-features">
              <div className="feature-item">
                <span className="feature-value">50</span>
                <span className="feature-label">workflow executions</span>
                <span className="feature-sublabel">per month</span>
              </div>
            </div>
            <div className="feature-list">
              <h3>Includes:</h3>
              <ul>
                <li>Monthly executions</li>
                <li>Email support</li>
                <li>Result history</li>
                <li>API access</li>
              </ul>
            </div>
            <button 
              onClick={() => handleTierSelect('Pro')}
              className="pricing-button primary"
            >
              Select
            </button>
          </div>

          {/* Business Plan */}
          <div className="pricing-card">
            <h2 className="pricing-tier">Business</h2>
            <p className="pricing-description">Ideal for small teams and businesses</p>
            <div className="pricing-amount">
              <span className="discount-tag">20% OFF</span>
              <div className="price">
                <span className="currency">$</span>
                <span className="amount">50</span>
                <span className="period">/month</span>
              </div>
            </div>
            <div className="pricing-features">
              <div className="feature-item">
                <span className="feature-value">200</span>
                <span className="feature-label">workflow executions</span>
                <span className="feature-sublabel">per month</span>
              </div>
            </div>
            <div className="feature-list">
              <h3>Everything in Pro, plus:</h3>
              <ul>
                <li>Team access</li>
                <li>Priority support</li>
                <li>Custom templates</li>
                <li>Advanced analytics</li>
                <li>Webhook integrations</li>
              </ul>
            </div>
            <button 
              onClick={() => handleTierSelect('Business')}
              className="pricing-button primary"
            >
              Select
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="pricing-card">
            <h2 className="pricing-tier">Enterprise</h2>
            <p className="pricing-description">Custom solutions for large organizations</p>
            <div className="pricing-amount enterprise">
              <div className="price">
                <span className="contact-text">Contact us</span>
              </div>
            </div>
            <div className="pricing-features">
              <div className="feature-item">
                <span className="feature-value">∞</span>
                <span className="feature-label">workflow executions</span>
                <span className="feature-sublabel">unlimited monthly runs</span>
              </div>
            </div>
            <div className="feature-list">
              <h3>Everything in Business, plus:</h3>
              <ul>
                <li>Unlimited executions</li>
                <li>Custom deployment</li>
                <li>SSO integration</li>
                <li>24/7 support</li>
                <li>SLA guarantee</li>
                <li>Custom features</li>
                <li>Dedicated account manager</li>
              </ul>
            </div>
            <button 
              onClick={() => handleTierSelect('Enterprise')}
              className="pricing-button"
            >
              Contact us
            </button>
          </div>
        </div>
      </div>
    </>
  );
} 