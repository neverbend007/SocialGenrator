import { useState } from 'react';
import { signIn } from 'next-auth/react';

export default function TierSelection() {
  const [selectedTier, setSelectedTier] = useState(null);

  const tiers = [
    {
      name: 'Free',
      price: '£0',
      features: [
        'Basic content generation',
        'Up to 3 requests per month',
        'Standard support'
      ]
    },
    {
      name: 'Pro',
      price: '£29.99',
      features: [
        'Advanced content generation',
        'Up to 50 requests per month',
        'Priority support',
        'Custom templates'
      ]
    },
    {
      name: 'Enterprise',
      price: '£99.99',
      features: [
        'Premium content generation',
        'Unlimited requests',
        '24/7 Support',
        'Custom templates',
        'API Access'
      ]
    }
  ];

  const handleTierSelect = (tier) => {
    setSelectedTier(tier);
  };

  const handleContinue = () => {
    if (selectedTier) {
      // Store selected tier in localStorage before auth
      localStorage.setItem('selectedTier', selectedTier.name);
      signIn('google');
    }
  };

  return (
    <div className="tier-selection">
      <h1>Choose Your Plan</h1>
      <p className="subtitle">Select the tier that best fits your needs</p>
      
      <div className="tiers-container">
        {tiers.map((tier) => (
          <div 
            key={tier.name}
            className={`tier-card ${selectedTier?.name === tier.name ? 'selected' : ''}`}
            onClick={() => handleTierSelect(tier)}
          >
            <h2>{tier.name}</h2>
            <div className="price">{tier.price}</div>
            <ul className="features">
              {tier.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <button 
              className={`select-button ${selectedTier?.name === tier.name ? 'selected' : ''}`}
              onClick={() => handleTierSelect(tier)}
            >
              {selectedTier?.name === tier.name ? 'Selected' : 'Select'}
            </button>
          </div>
        ))}
      </div>

      <button 
        className="continue-button"
        disabled={!selectedTier}
        onClick={handleContinue}
      >
        Continue with Google
      </button>
    </div>
  );
} 