import React, { useState, useRef } from 'react';

export default function TopCharms({ onSparkle }) {
  const [rotationBear, setRotationBear] = useState(0);
  const [rotationChain, setRotationChain] = useState(0);
  const isDragging = useRef(false);
  const startX = useRef(0);

  const handleCharmClick = (e, type) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    if (onSparkle) {
      onSparkle(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
    if (type === 'bear') {
      setRotationBear(prev => (prev === 0 ? 12 : -prev * 0.8));
      setTimeout(() => setRotationBear(0), 600);
    } else {
      setRotationChain(prev => (prev === 0 ? -15 : -prev * 0.8));
      setTimeout(() => setRotationChain(0), 600);
    }
  };

  return (
    <div className="page2-charms-container">
      {/* Acrylic Star Bear Strawberry Keychain */}
      <div
        className="bear-charm-wrapper"
        style={{
          transform: `rotate(${rotationBear}deg)`,
          transition: rotationBear === 0 ? 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)' : 'transform 0.15s ease'
        }}
        onClick={(e) => handleCharmClick(e, 'bear')}
        title="Tap to swing charm ✨"
      >
        <img
          src="/assets/bear-charm.png"
          alt="Bear Strawberry Keychain"
          className="bear-charm-img"
        />
      </div>

      {/* Beaded Swirl Chain Keychain dangling below */}
      <div
        className="beaded-charm-wrapper"
        style={{
          transform: `rotate(${rotationChain}deg)`,
          transition: rotationChain === 0 ? 'transform 0.9s cubic-bezier(0.25, 1, 0.5, 1)' : 'transform 0.15s ease'
        }}
        onClick={(e) => handleCharmClick(e, 'chain')}
        title="Tap to swing beads 💖"
      >
        <img
          src="/assets/keychain-top.png"
          alt="Beaded Star Keychain"
          className="beaded-charm-img"
        />
      </div>
    </div>
  );
}
