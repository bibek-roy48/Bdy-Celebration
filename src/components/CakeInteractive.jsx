import React, { useState } from 'react';
import confetti from 'canvas-confetti';

export default function CakeInteractive({ onSparkle }) {
  const [isBlownOut, setIsBlownOut] = useState(false);
  const [showWishToast, setShowWishToast] = useState(false);

  const handleCakeClick = (e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width * 0.52) / window.innerWidth;
    const y = (rect.top + rect.height * 0.2) / window.innerHeight;

    if (!isBlownOut) {
      setIsBlownOut(true);
      setShowWishToast(true);

      // Huge celebratory confetti burst
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { x, y },
        colors: ['#ff69b4', '#ffb6c1', '#ffd700', '#ffffff', '#ff1493'],
        shapes: ['star', 'circle'],
        scalar: 1.1,
      });

      setTimeout(() => {
        setShowWishToast(false);
      }, 3500);
    } else {
      // Re-light candle
      setIsBlownOut(false);
      if (onSparkle) {
        onSparkle(rect.left + rect.width * 0.5, rect.top + rect.height * 0.2);
      }
    }
  };

  return (
    <div
      className="puppy-cake-container"
      onClick={handleCakeClick}
      title={isBlownOut ? "Tap to re-light candle ✨" : "Tap to blow out candle & make a wish! 🎂"}
    >
      <div className="cake-img-wrap">
        <img
          src="/assets/puppy-cake.png"
          alt="Puppy Birthday Cake"
          className="puppy-cake-img"
        />

        {/* Animated Candle Flame */}
        {!isBlownOut ? (
          <div className="candle-flame-wrap">
            <div className="candle-flame"></div>
            <div className="flame-glow"></div>
          </div>
        ) : (
          <div className="candle-smoke-wrap">
            <div className="candle-smoke"></div>
          </div>
        )}
      </div>

      {/* Birthday Wish Toast */}
      {showWishToast && (
        <div className="wish-toast">
          <span>✨ Make a Wish! 🎂💖</span>
        </div>
      )}
    </div>
  );
}
