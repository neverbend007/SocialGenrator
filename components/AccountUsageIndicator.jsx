export default function AccountUsageIndicator({ usage, tier }) {
  if (usage.isLoading) {
    return <div className="account-usage-indicator loading">Loading usage...</div>;
  }

  return (
    <div className="account-usage-indicator">
      {tier === 'Single Use' ? (
        <div className="single-use-stats">
          <div className="usage-stat">
            <span className="stat-label">Runs this month:</span>
            <span className="stat-value">{usage.used}</span>
          </div>
          <div className="usage-stat">
            <span className="stat-label">Total spent:</span>
            <span className="stat-value">${usage.spent}.00</span>
          </div>
        </div>
      ) : tier === 'Enterprise' ? (
        <div className="unlimited-indicator">
          <span>Unlimited Access</span>
        </div>
      ) : (
        <div className="subscription-usage">
          <div className="usage-header">
            <span>Monthly Usage</span>
            <span>{usage.used} of {tier === 'Pro' ? '50' : '200'} runs used</span>
          </div>
          <div className="usage-bar-small">
            <div 
              className="usage-progress-small" 
              style={{ 
                width: `${(usage.used / (tier === 'Pro' ? 50 : 200)) * 100}%` 
              }}
            />
          </div>
          <div className="runs-remaining">
            {usage.remaining} runs remaining
          </div>
        </div>
      )}
    </div>
  );
} 