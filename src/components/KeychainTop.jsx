import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { sounds } from '../utils/audio';

export default function KeychainTop({ windTrigger, onSparkle }) {
  const keychainRef = useRef(null);
  const idleTweenRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const currentRotation = useRef(0);
  const lastSoundTime = useRef(0);

  useEffect(() => {
    const el = keychainRef.current;
    if (!el) return;

    // Start gentle automatic pendulum sway
    idleTweenRef.current = gsap.to(el, {
      rotation: 6.5,
      duration: 2.6,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      transformOrigin: "28% 4%",
    });

    return () => {
      if (idleTweenRef.current) idleTweenRef.current.kill();
    };
  }, []);

  // Handle gust of wind trigger
  useEffect(() => {
    if (!windTrigger) return;
    const el = keychainRef.current;
    if (!el) return;

    if (idleTweenRef.current) idleTweenRef.current.pause();

    sounds.playChime(1.1);

    gsap.timeline({
      onComplete: () => {
        if (idleTweenRef.current) idleTweenRef.current.resume();
      }
    })
      .to(el, {
        rotation: -22,
        duration: 0.5,
        ease: "power2.out",
        transformOrigin: "28% 4%"
      })
      .to(el, {
        rotation: 18,
        duration: 0.7,
        ease: "sine.inOut"
      })
      .to(el, {
        rotation: -10,
        duration: 0.8,
        ease: "sine.inOut"
      })
      .to(el, {
        rotation: 0,
        duration: 1.2,
        ease: "elastic.out(1, 0.3)"
      });
  }, [windTrigger]);

  // Pointer hover impulse
  const handleMouseEnter = (e) => {
    if (isDragging) return;
    const now = Date.now();
    if (now - lastSoundTime.current > 400) {
      sounds.playChime(1.0);
      lastSoundTime.current = now;
    }

    if (onSparkle) {
      const rect = keychainRef.current.getBoundingClientRect();
      onSparkle(rect.left + rect.width * 0.4, rect.top + rect.height * 0.5);
    }

    // Small reactive nudge on hover
    gsap.to(keychainRef.current, {
      rotation: "+=8",
      duration: 0.35,
      ease: "power1.out",
      yoyo: true,
      repeat: 1,
      transformOrigin: "28% 4%"
    });
  };

  // Drag / Touch Interactions
  const handlePointerDown = (e) => {
    setIsDragging(true);
    dragStartX.current = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    if (idleTweenRef.current) idleTweenRef.current.pause();
    sounds.playChime(0.9);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || dragStartX.current;
    const deltaX = clientX - dragStartX.current;
    const maxAngle = 35;
    const rot = Math.max(-maxAngle, Math.min(maxAngle, deltaX * 0.35));
    currentRotation.current = rot;

    gsap.to(keychainRef.current, {
      rotation: rot,
      duration: 0.1,
      overwrite: "auto",
      transformOrigin: "28% 4%"
    });
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    sounds.playChime(1.2);

    // Spring oscillation back to 0, then resume gentle idle sway
    gsap.to(keychainRef.current, {
      rotation: 0,
      duration: 1.8,
      ease: "elastic.out(1.2, 0.22)",
      transformOrigin: "28% 4%",
      onComplete: () => {
        if (idleTweenRef.current) {
          idleTweenRef.current.resume();
        }
      }
    });
  };

  return (
    <div
      className="keychain-top-container"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
    >
      <div
        ref={keychainRef}
        onMouseEnter={handleMouseEnter}
        onPointerDown={handlePointerDown}
        style={{
          width: '100%',
          height: '100%',
          transformOrigin: '28% 4%',
          willChange: 'transform',
        }}
      >
        <img
          src="/assets/keychain-top.png"
          alt="Top Pastel Swirl Keychain"
          draggable="false"
        />
      </div>

    </div>
  );
}

