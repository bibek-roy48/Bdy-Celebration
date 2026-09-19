import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { sounds } from '../utils/audio';

export default function KeychainBottom({ windTrigger, onSparkle }) {
  const keychainRef = useRef(null);
  const idleTweenRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const lastSoundTime = useRef(0);

  useEffect(() => {
    const el = keychainRef.current;
    if (!el) return;

    // Automatic idle pendulum sway (slightly slower and out-of-phase with top keychain)
    idleTweenRef.current = gsap.to(el, {
      rotation: -5.5,
      duration: 3.1,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      transformOrigin: "48% 12%",
      delay: 0.7,
    });

    return () => {
      if (idleTweenRef.current) idleTweenRef.current.kill();
    };
  }, []);

  // Wind breeze effect
  useEffect(() => {
    if (!windTrigger) return;
    const el = keychainRef.current;
    if (!el) return;

    if (idleTweenRef.current) idleTweenRef.current.pause();

    gsap.timeline({
      delay: 0.15,
      onComplete: () => {
        if (idleTweenRef.current) idleTweenRef.current.resume();
      }
    })
      .to(el, {
        rotation: -28,
        duration: 0.6,
        ease: "power2.out",
        transformOrigin: "48% 12%"
      })
      .to(el, {
        rotation: 22,
        duration: 0.75,
        ease: "sine.inOut"
      })
      .to(el, {
        rotation: -12,
        duration: 0.8,
        ease: "sine.inOut"
      })
      .to(el, {
        rotation: 0,
        duration: 1.3,
        ease: "elastic.out(1, 0.28)"
      });
  }, [windTrigger]);

  // Hover effect
  const handleMouseEnter = () => {
    if (isDragging) return;
    const now = Date.now();
    if (now - lastSoundTime.current > 400) {
      sounds.playChime(1.25);
      lastSoundTime.current = now;
    }

    if (onSparkle) {
      const rect = keychainRef.current.getBoundingClientRect();
      onSparkle(rect.left + rect.width * 0.5, rect.top + rect.height * 0.4);
    }

    gsap.to(keychainRef.current, {
      rotation: "-=9",
      duration: 0.4,
      ease: "power1.out",
      yoyo: true,
      repeat: 1,
      transformOrigin: "48% 12%"
    });
  };

  // Drag handlers
  const handlePointerDown = (e) => {
    setIsDragging(true);
    dragStartX.current = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    if (idleTweenRef.current) idleTweenRef.current.pause();
    sounds.playChime(0.85);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || dragStartX.current;
    const deltaX = clientX - dragStartX.current;
    const maxAngle = 38;
    const rot = Math.max(-maxAngle, Math.min(maxAngle, deltaX * 0.35));

    gsap.to(keychainRef.current, {
      rotation: rot,
      duration: 0.1,
      overwrite: "auto",
      transformOrigin: "48% 12%"
    });
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    sounds.playChime(1.1);

    gsap.to(keychainRef.current, {
      rotation: 0,
      duration: 1.9,
      ease: "elastic.out(1.2, 0.22)",
      transformOrigin: "48% 12%",
      onComplete: () => {
        if (idleTweenRef.current) {
          idleTweenRef.current.resume();
        }
      }
    });
  };

  return (
    <div
      className="keychain-bottom-container"
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
          transformOrigin: '48% 12%',
          willChange: 'transform',
        }}
      >
        <img
          src="/assets/keychain-bottom.png"
          alt="Bottom Gingham Ribbon Bear Keychain"
          draggable="false"
        />
      </div>

    </div>
  );
}

