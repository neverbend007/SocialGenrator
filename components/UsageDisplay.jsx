export default function UsageDisplay({ usage, tier }) {
  if (usage.isLoading) {
    return <div className="usage-display loading">Loading usage data...</div>;
  }

  if (usage.error) {
    return <div className="usage-display error">Error loading usage data</div>;
  }

  return (
    <div className="usage-display">
      {tier === 'Single Use' ? (
        <>
          <h3>Usage This Month</h3>
          <p>Runs used: {usage.used}</p>
          <p>Total spent: ${usage.spent}.00</p>
        </>
      ) : tier === 'Enterprise' ? (
        <p className="unlimited">Unlimited runs available</p>
      ) : (
        <>
          <h3>Available Runs</h3>
          <p>{usage.remaining} of {tier === 'Pro' ? '50' : '200'} runs remaining</p>
          <div className="usage-bar">
            <div 
              className="usage-progress" 
              style={{ 
                width: `${(usage.used / (tier === 'Pro' ? 50 : 200)) * 100}%` 
              }}
            />
          </div>
        </>
      )}
    </div>
  );
} 