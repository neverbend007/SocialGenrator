import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Navigation from '../components/Navigation';

export default function Features() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  console.log('Features Page - Session:', session);
  console.log('Features Page - Status:', status);

  // Show loading state
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navigation session={session} />
      <div className="container">
        <div className="content-container">
          <section className="hero-section">
            <h1 className="page-title">Transform Your Content Strategy with Intelligent Automation</h1>
            <p className="feature-text">
              Our AI-powered content generation system creates engaging blog posts and social media content tailored specifically to your business and industry. By intelligently analyzing your web presence and market position, we deliver content that resonates with your audience and aligns with your brand.
            </p>
          </section>

          <section className="process-section">
            <h2 className="section-title">How It Works</h2>
            <div className="process-grid">
              <div className="process-card">
                <h3>1. Intelligent Website Analysis</h3>
                <p>Our system begins by analyzing your website, understanding your brand voice, products, services, and unique value propositions. This ensures all generated content maintains consistency with your existing messaging.</p>
              </div>

              <div className="process-card">
                <h3>2. Industry Research</h3>
                <p>We don't just create generic content. Our AI performs comprehensive industry research to understand:</p>
                <ul>
                  <li>Current market trends and developments</li>
                  <li>Your competitive landscape</li>
                  <li>Industry-specific terminology and best practices</li>
                  <li>Target audience preferences and behaviors</li>
                </ul>
              </div>

              <div className="process-card">
                <h3>3. Automated Content Creation</h3>
                <p>Based on this deep understanding, our system generates:</p>
                <ul>
                  <li>Engaging blog posts that showcase your expertise</li>
                  <li>Platform-optimized social media content for all major networks</li>
                  <li>Content that drives engagement and supports your marketing goals</li>
                </ul>
              </div>

              <div className="process-card">
                <h3>4. Seamless Delivery</h3>
                <p>All generated content is delivered directly to your inbox, ready to be reviewed and published. No complex interfaces to learn or manage.</p>
              </div>
            </div>
          </section>

          <section className="pricing-tiers">
            <h2 className="section-title">Flexible Pricing Tiers</h2>
            <div className="process-grid">
              <div className="process-card">
                <h3>Single Use</h3>
                <p>Perfect for occasional content needs</p>
                <ul>
                  <li>Pay-as-you-go pricing</li>
                  <li>No monthly commitment</li>
                  <li>Full feature access</li>
                  <li>Ideal for testing our service</li>
                </ul>
              </div>

              <div className="process-card">
                <h3>Pro Tier</h3>
                <p>Designed for growing businesses</p>
                <ul>
                  <li>50 content generations per month</li>
                  <li>Perfect for consistent blog posting</li>
                  <li>Comprehensive social media support</li>
                  <li>Cost-effective for regular content needs</li>
                </ul>
              </div>

              <div className="process-card">
                <h3>Business Tier</h3>
                <p>Built for active content marketers</p>
                <ul>
                  <li>100 content generations monthly</li>
                  <li>Ideal for multi-channel content strategy</li>
                  <li>Full access to all features</li>
                  <li>Perfect for busy marketing teams</li>
                </ul>
              </div>

              <div className="process-card">
                <h3>Enterprise Tier</h3>
                <p>Unlimited potential for large organizations</p>
                <ul>
                  <li>Unlimited content generation</li>
                  <li>Maximum flexibility</li>
                  <li>Scale your content effortlessly</li>
                  <li>Perfect for agencies and large businesses</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="benefits-section">
            <h2 className="section-title">Why Choose Our Platform</h2>
            <div className="benefits-grid">
              <div className="benefit-card">
                <h4>Zero Learning Curve</h4>
                <p>Simply provide your website URL, and we handle the rest</p>
              </div>
              <div className="benefit-card">
                <h4>Contextually Aware</h4>
                <p>Content that truly understands your business and industry</p>
              </div>
              <div className="benefit-card">
                <h4>Multi-Platform Ready</h4>
                <p>Optimized for blogs and all major social networks</p>
              </div>
            </div>
            <div className="benefits-grid-last-row">
              <div className="benefit-card">
                <h4>Time-Saving Automation</h4>
                <p>Receive ready-to-publish content directly in your inbox</p>
              </div>
              <div className="benefit-card">
                <h4>Flexible Scaling</h4>
                <p>Choose the tier that matches your content needs</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
} 