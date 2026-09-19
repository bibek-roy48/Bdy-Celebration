import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Gift, X, ZoomIn } from 'lucide-react';
import { sounds } from '../utils/audio';

const FOOD_ITEMS = [
  {
    id: 'toastie-pop',
    name: 'Toastie Pop',
    image: '/assets/food-bear-cookie.png',
  },
  {
    id: 'kitty-cookie',
    name: 'Kitty Cookie',
    image: '/assets/food-choco-time.png',
  },
  {
    id: 'mochi-crust',
    name: 'Mochi Crust',
    image: '/assets/food-egg-bowl.png',
  },
  {
    id: 'yum-pocket',
    name: 'Yum Pocket',
    image: '/assets/food-bear-curry.png',
  },
];

export default function TreatsLetterPage({ onSparkle, onPlayAudio }) {
  const [favorites, setFavorites] = useState({});
  const [selectedFood, setSelectedFood] = useState(null);
  const [orderToast, setOrderToast] = useState(null);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

  const containerRef = useRef(null);
  const letterRef = useRef(null);
  const charmRef = useRef(null);
  const charmTweenRef = useRef(null);

  // Drag state for charm
  const isDraggingCharm = useRef(false);
  const dragStartX = useRef(0);

  // GSAP Entrance & Ambient Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Entrance Animation
      const tl = gsap.timeline({ defaults: { ease: 'back.out(1.7)' } });

      tl.fromTo(
        letterRef.current,
        { y: -50, opacity: 0, scale: 0.9, rotation: -10 },
        { y: 0, opacity: 1, scale: 1, rotation: -4.5, duration: 0.8, ease: 'elastic.out(1.1, 0.5)' }
      )
        .fromTo(
          charmRef.current,
          { y: -35, opacity: 0, scale: 0.75, rotation: 16 },
          { y: 0, opacity: 1, scale: 1, rotation: 0, duration: 0.75, ease: 'back.out(2)' },
          '-=0.5'
        )
        .fromTo(
          '.treats-heading',
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' },
          '-=0.3'
        )
        .fromTo(
          '.treat-food-card',
          { y: 35, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 0.55, stagger: 0.08, ease: 'back.out(1.6)' },
          '-=0.3'
        );

      // 2. Continuous realistic pendulum sway for hanging charm
      if (charmRef.current) {
        charmTweenRef.current = gsap.to(charmRef.current, {
          rotation: 6.5,
          y: 2,
          duration: 2.6,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          transformOrigin: '50% 10%',
        });
      }

      // 3. Gentle idle floating breathing motion for the letter
      gsap.to(letterRef.current, {
        y: 3,
        rotation: -4.0,
        duration: 3.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 0.8,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // GSAP 3D Cursor Tilt for the Birthday Letter
  const handleLetterMouseMove = (e) => {
    if (!letterRef.current) return;
    const rect = letterRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(letterRef.current, {
      rotationY: x * 14,
      rotationX: -y * 14,
      rotationZ: -4.5 + x * 2.5,
      duration: 0.25,
      ease: 'power1.out',
    });
  };

  const handleLetterMouseLeave = () => {
    if (!letterRef.current) return;
    gsap.to(letterRef.current, {
      rotationX: 0,
      rotationY: 0,
      rotationZ: -4.5,
      duration: 0.75,
      ease: 'elastic.out(1.15, 0.4)',
    });
  };

  // Charm Swing Impulse
  const triggerCharmSwing = (e) => {
    e.stopPropagation();
    if (!charmRef.current) return;
    sounds.playChime(1.15);
    if (onPlayAudio) onPlayAudio();
    if (charmTweenRef.current) charmTweenRef.current.pause();

    const rect = charmRef.current.getBoundingClientRect();
    if (onSparkle) onSparkle(rect.left + rect.width / 2, rect.top + rect.height / 2);

    gsap.timeline({
      onComplete: () => {
        if (charmTweenRef.current) charmTweenRef.current.resume();
      },
    })
      .to(charmRef.current, {
        rotation: -26,
        duration: 0.3,
        ease: 'power2.out',
        transformOrigin: '50% 10%',
      })
      .to(charmRef.current, {
        rotation: 18,
        duration: 0.45,
        ease: 'sine.inOut',
      })
      .to(charmRef.current, {
        rotation: -8,
        duration: 0.5,
        ease: 'sine.inOut',
      })
      .to(charmRef.current, {
        rotation: 0,
        duration: 1.1,
        ease: 'elastic.out(1.2, 0.25)',
      });
  };

  // Charm Drag handlers
  const handleCharmPointerDown = (e) => {
    e.stopPropagation();
    isDraggingCharm.current = true;
    dragStartX.current = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    if (charmTweenRef.current) charmTweenRef.current.pause();
    sounds.playChime(0.95);
  };

  const handleCharmPointerMove = (e) => {
    if (!isDraggingCharm.current || !charmRef.current) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || dragStartX.current;
    const deltaX = clientX - dragStartX.current;
    const maxAngle = 35;
    const rot = Math.max(-maxAngle, Math.min(maxAngle, deltaX * 0.4));

    gsap.to(charmRef.current, {
      rotation: rot,
      duration: 0.1,
      overwrite: 'auto',
      transformOrigin: '50% 10%',
    });
  };

  const handleCharmPointerUp = (e) => {
    if (!isDraggingCharm.current || !charmRef.current) return;
    isDraggingCharm.current = false;
    sounds.playChime(1.2);

    const rect = charmRef.current.getBoundingClientRect();
    if (onSparkle) onSparkle(rect.left + rect.width / 2, rect.top + rect.height / 2);

    gsap.to(charmRef.current, {
      rotation: 0,
      duration: 1.6,
      ease: 'elastic.out(1.2, 0.22)',
      transformOrigin: '50% 10%',
      onComplete: () => {
        if (charmTweenRef.current) charmTweenRef.current.resume();
      },
    });
  };

  // Open letter zoom modal
  const handleOpenLetterZoom = (e) => {
    e.stopPropagation();
    sounds.playPop();
    if (onPlayAudio) onPlayAudio();

    const rect = e.currentTarget.getBoundingClientRect();
    if (onSparkle) onSparkle(rect.left + rect.width / 2, rect.top + rect.height / 2);

    confetti({
      particleCount: 25,
      spread: 60,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      },
      colors: ['#ff6b8b', '#ffd1dc', '#ffd700', '#ffffff'],
      shapes: ['star', 'circle'],
      scalar: 0.9,
    });

    setIsZoomModalOpen(true);
  };

  // Toggle favorite heart
  const toggleFavorite = (e, id) => {
    e.stopPropagation();
    sounds.playPop();
    if (onPlayAudio) onPlayAudio();

    const nextState = !favorites[id];
    setFavorites((prev) => ({ ...prev, [id]: nextState }));

    // Animate heart button pop
    gsap.fromTo(
      e.currentTarget,
      { scale: 0.75 },
      { scale: 1.25, duration: 0.2, yoyo: true, repeat: 1, ease: 'back.out(2)' }
    );

    if (nextState) {
      const rect = e.currentTarget.getBoundingClientRect();
      confetti({
        particleCount: 18,
        spread: 45,
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        },
        colors: ['#ff4d88', '#ff85a2', '#ffd1dc', '#fff'],
        shapes: ['circle'],
        scalar: 0.8,
      });
    }
  };

  // Select food item
  const handleSelectFood = (e, item) => {
    e.stopPropagation();
    sounds.playCelebration();
    if (onPlayAudio) onPlayAudio();
    setSelectedFood(item);
    setOrderToast(item.name);

    // Card bounce animation
    gsap.timeline()
      .to(e.currentTarget, { scale: 0.94, duration: 0.1, ease: 'power2.in' })
      .to(e.currentTarget, { scale: 1.05, duration: 0.25, ease: 'back.out(2.2)' })
      .to(e.currentTarget, { scale: 1, duration: 0.2, ease: 'power2.out' });

    const rect = e.currentTarget.getBoundingClientRect();
    confetti({
      particleCount: 30,
      spread: 60,
      origin: {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      },
      colors: ['#ff6b8b', '#ffd1dc', '#ffd700', '#ffffff'],
      shapes: ['star', 'circle'],
      scalar: 0.9,
    });

    setTimeout(() => {
      setOrderToast(null);
    }, 2800);
  };

  return (
    <div className="treats-letter-page-container" ref={containerRef}>
      {/* Background Soft Glow */}
      <div className="treats-bg-glow" />

      {/* Main Scroll Content */}
      <div className="treats-scroll-content">
        {/* =========================================
            TOP SECTION: High-Res Crystal-Clear Letter
            ========================================= */}
        <div className="letter-section-wrapper">
          <div
            className="letter-note-card clean-unobstructed"
            ref={letterRef}
            onMouseMove={handleLetterMouseMove}
            onMouseLeave={handleLetterMouseLeave}
            onClick={handleOpenLetterZoom}
            title="Click to zoom & read letter! 🔍💖"
          >
            {/* Torn Paper Note Image - Zero Black Edges */}
            <img
              src="/assets/letter-note.png"
              alt="Handwritten Birthday Note for Bijeyata"
              className="letter-note-img"
              draggable="false"
            />

            {/* Pinned Beaded Star Ribbon Charm at Upper-Right */}
            <div
              className="letter-pinned-charm"
              ref={charmRef}
              onMouseEnter={triggerCharmSwing}
              onClick={(e) => {
                e.stopPropagation();
                triggerCharmSwing(e);
              }}
              onPointerDown={handleCharmPointerDown}
              onPointerMove={handleCharmPointerMove}
              onPointerUp={handleCharmPointerUp}
              onPointerCancel={handleCharmPointerUp}
              title="Touch or Drag charm to jingle! 🎀✨"
            >
              <img
                src="/assets/charm-extra.png"
                alt="Beaded Star Keychain Charm"
                className="charm-ribbon-img"
                draggable="false"
              />
            </div>

            {/* Subtle Zoom Hint Overlay Pill */}
            <div className="letter-zoom-badge">
              <ZoomIn size={13} />
              <span>Tap to read</span>
            </div>
          </div>
        </div>

        {/* =========================================
            BOTTOM SECTION: Food Choice 2x2 Grid
            ========================================= */}
        <div className="treats-selection-section">
          <h2 className="treats-heading">
            What do you want to eat from these?
          </h2>

          <div className="treats-grid">
            {FOOD_ITEMS.map((item) => {
              const isFav = !!favorites[item.id];
              const isSelected = selectedFood?.id === item.id;

              return (
                <div
                  key={item.id}
                  className={`treat-food-card ${isSelected ? 'selected' : ''}`}
                  onClick={(e) => handleSelectFood(e, item)}
                  title={`Select ${item.name} for Bijeyata! 🍽️`}
                >
                  {/* Food Image */}
                  <div className="treat-img-wrapper">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="treat-food-img"
                      draggable="false"
                    />
                  </div>

                  {/* Card Info Bottom Row: Clean Title & Heart Only */}
                  <div className="treat-card-info">
                    <div className="treat-title-row">
                      <h3 className="treat-name">{item.name}</h3>
                      <button
                        className={`treat-heart-btn ${isFav ? 'active' : ''}`}
                        onClick={(e) => toggleFavorite(e, item.id)}
                        title={isFav ? 'Liked!' : 'Like this treat'}
                        aria-label="favorite"
                      >
                        <Heart
                          size={16}
                          fill={isFav ? '#ff4d88' : 'none'}
                          color={isFav ? '#ff4d88' : '#e06688'}
                          className="heart-svg"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Celebration Food Order Toast */}
      {orderToast && (
        <div className="treat-order-toast">
          <Gift size={18} color="#ff3366" />
          <span>Treat <b>{orderToast}</b> selected for Bijeyata! 💖✨</span>
        </div>
      )}

      {/* =========================================
          HD FULLSCREEN LETTER ZOOM MODAL
          ========================================= */}
      {isZoomModalOpen && (
        <div
          className="letter-modal-backdrop"
          onClick={() => setIsZoomModalOpen(false)}
        >
          <div
            className="letter-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="letter-modal-close"
              onClick={() => setIsZoomModalOpen(false)}
              aria-label="Close Letter View"
            >
              <X size={18} />
            </button>

            <div className="letter-modal-img-container">
              <img
                src="/assets/letter-note.png"
                alt="Full Birthday Letter for Bijeyata"
                className="letter-modal-full-img"
                draggable="false"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

