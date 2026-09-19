import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';

export default function BalloonBanner({ onCelebrate }) {
  const bannerRef = useRef(null);
  const floatTweenRef = useRef(null);

  useEffect(() => {
    const el = bannerRef.current;
    if (!el) return;

    // Gentle floating breathing motion
    floatTweenRef.current = gsap.to(el, {
      y: -9,
      rotation: 0.8,
      duration: 2.8,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    return () => {
      if (floatTweenRef.current) floatTweenRef.current.kill();
    };
  }, []);

  const handleMouseEnter = () => {
    sounds.playPop();
    gsap.to(bannerRef.current, {
      scale: 1.04,
      rotation: -1,
      duration: 0.35,
      ease: "back.out(2)"
    });
  };

  const handleMouseLeave = () => {
    gsap.to(bannerRef.current, {
      scale: 1.0,
      rotation: 0,
      duration: 0.4,
      ease: "power2.out"
    });
  };

  const handleClick = (e) => {
    sounds.playCelebration();

    // Trigger colorful celebration confetti from the clicked position
    const rect = bannerRef.current.getBoundingClientRect();
    const originX = (rect.left + rect.width / 2) / window.innerWidth;
    const originY = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 55,
      spread: 70,
      origin: { x: originX, y: originY },
      colors: ['#ff9bb2', '#ffc1d6', '#ffd700', '#ffffff', '#e8b4b8', '#f8bbd0'],
      shapes: ['circle', 'square'],
      scalar: 1.1,
      ticks: 180,
    });

    // Wobble bounce
    gsap.timeline()
      .to(bannerRef.current, {
        scale: 1.12,
        rotation: 3,
        duration: 0.15,
        ease: "power2.out"
      })
      .to(bannerRef.current, {
        scale: 0.96,
        rotation: -3,
        duration: 0.2,
        ease: "power2.inOut"
      })
      .to(bannerRef.current, {
        scale: 1.0,
        rotation: 0,
        duration: 0.5,
        ease: "elastic.out(1.2, 0.3)"
      });

    if (onCelebrate) {
      onCelebrate();
    }
  };

  return (
    <div
      className="balloon-banner-container"
      style={{
        position: 'absolute',
        top: '46%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '88%',
        maxWidth: '360px',
        zIndex: 15,
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <div
        ref={bannerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className="balloon-banner"
        style={{
          position: 'relative',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          filter: 'drop-shadow(0px 14px 20px rgba(95, 65, 80, 0.35))',
          transition: 'filter 0.3s ease',
        }}
        title="Click to Celebrate! 🎀🎉"
      >
        <img
          src="/assets/balloons-hbd.png"
          alt="Happy Birthday 3D Foil Balloons with Pink Bows"
          style={{
            width: '100%',
            height: 'auto',
            objectFit: 'contain',
            pointerEvents: 'none',
          }}
          draggable="false"
        />

        {/* Glossy holographic sheen shimmer element */}
        <div className="balloon-shimmer" />
      </div>
    </div>
  );
}

