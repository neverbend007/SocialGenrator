import { useState } from 'react';

export default function DeleteAccountModal({ isOpen, onClose, onConfirm }) {
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (confirmText === 'DELETE') {
      onConfirm();
    } else {
      setError('Please type DELETE to confirm');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Delete Account</h2>
        <p className="modal-text">
          This action cannot be undone. All your data will be permanently deleted.
        </p>
        <p className="modal-text">
          Please type <strong>DELETE</strong> to confirm:
        </p>
        <form onSubmit={handleSubmit} className="delete-confirmation-form">
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="form-input"
            placeholder="Type DELETE"
          />
          {error && <p className="error-text">{error}</p>}
          <div className="modal-buttons">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="delete-button">
              Delete Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 