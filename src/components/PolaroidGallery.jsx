import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

const framesData = [
  {
    id: 0,
    frame: '/assets/frame-left.png',
    photo: '/assets/photo-bandana.png',
    alt: 'Bandana Portrait',
    caption: '“Cutest smile and sweetest energy! 💕”',
    title: 'Cutest Smile ✨',
    photoStyle: {
      left: '10.6%',
      top: '9.9%',
      width: '77.4%',
      height: '71.4%',
    }
  },
  {
    id: 1,
    frame: '/assets/frame-center.png',
    photo: '/assets/photo-mirror-bnw.png',
    alt: 'Mirror Selfie',
    caption: '“To the prettiest birthday queen in the whole universe! 👑💖”',
    title: 'Birthday Queen 🎂',
    photoStyle: {
      left: '10.6%',
      top: '13.1%',
      width: '79.0%',
      height: '69.0%',
    }
  },
  {
    id: 2,
    frame: '/assets/frame-center.png',
    photo: '/assets/photo-sunglasses.png',
    alt: 'Sunglasses Aesthetic Fit',
    caption: '“Iconic vibes, pure beauty & main character energy! 😎✨”',
    title: 'Stylish Queen 🕶️💖',
    photoStyle: {
      left: '10.6%',
      top: '13.1%',
      width: '79.0%',
      height: '69.0%',
    }
  },
  {
    id: 3,
    frame: '/assets/frame-right.png',
    photo: '/assets/photo-night-peace.png',
    alt: 'Peace Sign Night Selfie',
    caption: '“Forever making unforgettable memories together! 🌸”',
    title: 'Sweet Memories 🎀',
    photoStyle: {
      left: '9.9%',
      top: '9.8%',
      width: '76.2%',
      height: '69.9%',
    }
  }
];

export default function PolaroidGallery({ onSelectPhoto, onSparkle }) {
  const [activeIndex, setActiveIndex] = useState(1); // Default to Birthday Queen (Index 1)
  const [isPaused, setIsPaused] = useState(false);
  const cardRefs = useRef([]);
  const timerRef = useRef(null);

  // Automatic one-by-one frame carousel
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % framesData.length);
    }, 3600);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  // GSAP 3D Modern Animation on Active Index Change
  useEffect(() => {
    const total = framesData.length;

    framesData.forEach((_, idx) => {
      const el = cardRefs.current[idx];
      if (!el) return;

      // Position relative to active: 0 (center), -1 (left), 1 (right), otherwise hidden
      let diff = (idx - activeIndex + total) % total;
      if (diff === total - 1) diff = -1;

      if (diff === 0) {
        // Center Active Card (Full prominence, centered)
        gsap.to(el, {
          x: 0,
          y: 0,
          scale: 1.14,
          rotation: 0,
          opacity: 1,
          zIndex: 20,
          duration: 0.8,
          ease: 'power3.out',
          filter: 'drop-shadow(0 16px 32px rgba(45, 12, 28, 0.48))',
        });
      } else if (diff === -1) {
        // Left Card (Overflowing out the left border)
        gsap.to(el, {
          x: -128,
          y: 4,
          scale: 0.88,
          rotation: -4,
          opacity: 0.95,
          zIndex: 10,
          duration: 0.8,
          ease: 'power3.out',
          filter: 'drop-shadow(0 10px 20px rgba(45, 12, 28, 0.38))',
        });
      } else if (diff === 1) {
        // Right Card (Overflowing out the right border)
        gsap.to(el, {
          x: 128,
          y: 4,
          scale: 0.88,
          rotation: 4,
          opacity: 0.95,
          zIndex: 10,
          duration: 0.8,
          ease: 'power3.out',
          filter: 'drop-shadow(0 10px 20px rgba(45, 12, 28, 0.38))',
        });
      } else {
        // Hidden Offscreen Behind
        gsap.to(el, {
          x: 0,
          y: 20,
          scale: 0.6,
          rotation: 0,
          opacity: 0,
          zIndex: 0,
          duration: 0.6,
          ease: 'power2.in',
        });
      }
    });
  }, [activeIndex]);

  const handleCardClick = (e, index) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    if (onSparkle) {
      onSparkle(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }

    if (index === activeIndex) {
      if (onSelectPhoto) onSelectPhoto(index);
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <div
      className="gsap-carousel-container"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setTimeout(() => setIsPaused(false), 2500)}
    >
      <div className="gsap-carousel-stage">
        {framesData.map((item, idx) => (
          <div
            key={item.id}
            ref={(el) => (cardRefs.current[idx] = el)}
            className={`gsap-polaroid-card ${idx === activeIndex ? 'is-active' : ''}`}
            onClick={(e) => handleCardClick(e, idx)}
          >
            {/* Underlying Photo */}
            <div className="gsap-photo-layer" style={item.photoStyle}>
              <img
                src={item.photo}
                alt={item.alt}
                className={`gsap-actual-photo ${item.photo.includes('mirror-bnw') ? 'bnw-boost' : ''}`}
                style={item.id === 2 ? { objectPosition: 'center 20%' } : {}}
              />
            </div>

            {/* Authentic Frame Sticker Overlay */}
            <img
              src={item.frame}
              alt="Frame Overlay"
              className="gsap-frame-asset"
            />
          </div>
        ))}
      </div>

      {/* Frame Switcher Dots */}
      <div className="carousel-dots-indicator" onClick={(e) => e.stopPropagation()}>
        {framesData.map((_, i) => (
          <button
            key={i}
            className={`carousel-dot ${i === activeIndex ? 'active' : ''}`}
            onClick={() => setActiveIndex(i)}
            title={`Photo ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
