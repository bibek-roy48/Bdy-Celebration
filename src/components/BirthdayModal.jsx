import React, { useState } from 'react';
import { X, Heart, Sparkles, Send, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';

export default function BirthdayModal({ isOpen, onClose }) {
  const [recipientName, setRecipientName] = useState('My Sweetest Friend');
  const [customWish, setCustomWish] = useState(
    'Wishing you a day as adorable, sweet, and bright as you are! May this year bring you endless love, joy, and dreams come true! 🎂✨🎀'
  );
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const handleSendWish = (e) => {
    e.preventDefault();
    sounds.playCelebration();
    setSent(true);

    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#ff7597', '#ffd1dc', '#fff', '#ffd700'],
    });

    setTimeout(() => {
      setSent(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="birthday-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <div className="modal-header">
          <div className="modal-icon-badge">
            <Gift size={24} color="#e55982" />
          </div>
          <h2 className="modal-title">Happy Birthday Wishes</h2>
          <p className="modal-subtitle">Send a lovely message with cute keychains</p>
        </div>

        {sent ? (
          <div className="modal-success-box">
            <Heart size={44} className="success-heart-icon" />
            <h3>Wishes Sent with Love! 💖</h3>
            <p>Your sparkling birthday card was delivered!</p>
          </div>
        ) : (
          <form onSubmit={handleSendWish} className="modal-form">
            <div className="form-group">
              <label>For:</label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="input-field"
                placeholder="Enter recipient's name"
                required
              />
            </div>

            <div className="form-group">
              <label>Personal Message:</label>
              <textarea
                value={customWish}
                onChange={(e) => setCustomWish(e.target.value)}
                className="textarea-field"
                rows={4}
                placeholder="Write your birthday wish..."
                required
              />
            </div>

            <div className="preset-chips">
              <button
                type="button"
                className="chip-btn"
                onClick={() => setCustomWish('Another year sweeter! Keep shining bright like a star! ⭐🍰')}
              >
                🍰 Sweet & Bright
              </button>
              <button
                type="button"
                className="chip-btn"
                onClick={() => setCustomWish('Hope your birthday is full of bows, bears, and sweet treats! 🎀🧸')}
              >
                🎀 Coquette Vibes
              </button>
              <button
                type="button"
                className="chip-btn"
                onClick={() => setCustomWish('May all your secret wishes and heartfelt dreams come true! 💫💖')}
              >
                💫 Dream Big
              </button>
            </div>

            <button type="submit" className="send-wish-btn">
              <Send size={16} />
              <span>Send Birthday Love ✨</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
