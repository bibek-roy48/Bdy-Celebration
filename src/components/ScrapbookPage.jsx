import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import PhotoModal from './PhotoModal';

const CANVAS_W = 393;
const CANVAS_H = 852;

export default function ScrapbookPage({ onSparkle, onPlayAudio }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const containerRef = useRef(null);
  const redKeychainRef = useRef(null);
  const swirlKeychainRef = useRef(null);
  const cherryRef = useRef(null);
  const starRef = useRef(null);

  const photo1Ref = useRef(null);
  const photo2Ref = useRef(null);
  const photo3Ref = useRef(null);

  // Modern GSAP Orchestration for Frames & Keychains
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Staggered Entrance Animation for Frames
      const tl = gsap.timeline({ defaults: { ease: 'back.out(1.8)' } });
      tl.fromTo(
        photo3Ref.current,
        { y: -70, opacity: 0, scale: 0.8, rotation: -6 },
        { y: 0, opacity: 1, scale: 1, rotation: 0, duration: 0.8, ease: 'elastic.out(1.1, 0.5)' }
      )
        .fromTo(
          photo1Ref.current,
          { x: -60, opacity: 0, scale: 0.8, rotation: -8 },
          { x: 0, opacity: 1, scale: 1, rotation: 0, duration: 0.75 },
          '-=0.5'
        )
        .fromTo(
          photo2Ref.current,
          { y: 70, opacity: 0, scale: 0.8, rotation: 8 },
          { y: 0, opacity: 1, scale: 1, rotation: 0, duration: 0.75 },
          '-=0.55'
        );

      // 2. Ambient Idle Floating Loops for mid-left and bottom-right frames
      if (photo1Ref.current) {
        gsap.to(photo1Ref.current, {
          y: 5,
          rotation: -1,
          duration: 3.6,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 1.0,
        });
      }

      if (photo2Ref.current) {
        gsap.to(photo2Ref.current, {
          y: -4,
          rotation: 1.2,
          duration: 3.0,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 1.2,
        });
      }

      // 3. Gentle pendulum sway for keychains
      if (redKeychainRef.current) {
        gsap.to(redKeychainRef.current, {
          rotation: 3,
          y: 2,
          duration: 3.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      if (swirlKeychainRef.current) {
        gsap.to(swirlKeychainRef.current, {
          rotation: -21.5,
          duration: 2.9,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Modern GSAP 3D Cursor Tilt & Elevation for Photo Frames
  const handleFrameMouseEnter = (element) => {
    if (!element) return;
    gsap.to(element, {
      scale: 1.05,
      y: -8,
      zIndex: 25,
      duration: 0.35,
      ease: 'back.out(2)',
      filter: 'drop-shadow(0 22px 42px rgba(45, 12, 28, 0.55))',
    });
  };

  const handleFrameMouseMove = (e, element, defaultRot = 0) => {
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(element, {
      rotationY: x * 14,
      rotationX: -y * 14,
      rotationZ: defaultRot + x * 2,
      duration: 0.22,
      ease: 'power1.out',
    });
  };

  const handleFrameMouseLeave = (element, defaultRot = 0) => {
    if (!element) return;
    gsap.to(element, {
      scale: 1,
      y: 0,
      rotationX: 0,
      rotationY: 0,
      rotationZ: defaultRot,
      zIndex: 12,
      duration: 0.65,
      ease: 'elastic.out(1.15, 0.45)',
      filter: 'drop-shadow(0 14px 28px rgba(45, 15, 28, 0.4))',
    });
  };

  // Sparkle & Audio Interaction Handler
  const handleInteract = (e, callback) => {
    e.stopPropagation();
    if (onPlayAudio) onPlayAudio();
    const rect = e.currentTarget.getBoundingClientRect();
    if (onSparkle) onSparkle(rect.left + rect.width / 2, rect.top + rect.height / 2);
    if (callback) callback();
  };

  // Juicy Click Pop & Modal Zoom
  const handlePhotoClick = (e, element, index, defaultRot = 0) => {
    handleInteract(e, () => {
      if (element) {
        gsap.timeline()
          .to(element, { scale: 0.93, duration: 0.1, ease: 'power2.in' })
          .to(element, { scale: 1.08, duration: 0.2, ease: 'back.out(2.5)' })
          .to(element, {
            scale: 1,
            rotationZ: defaultRot,
            duration: 0.35,
            ease: 'power2.out',
            onComplete: () => setSelectedPhoto(index),
          });
      } else {
        setSelectedPhoto(index);
      }

      confetti({
        particleCount: 22,
        spread: 55,
        origin: {
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight,
        },
        colors: ['#ff85a2', '#ffd1dc', '#fff0f5', '#ff4d88', '#ffe66d'],
        shapes: ['star', 'circle'],
        scalar: 0.9,
      });
    });
  };

  // Gentle Physics Keychain Pendulum Swing on hover/tap
  const swingRedKeychain = () => {
    if (!redKeychainRef.current) return;
    gsap.killTweensOf(redKeychainRef.current);
    gsap.timeline()
      .to(redKeychainRef.current, {
        rotation: -16,
        y: 6,
        duration: 0.35,
        ease: 'power2.out',
      })
      .to(redKeychainRef.current, {
        rotation: 12,
        y: -2,
        duration: 0.45,
        ease: 'sine.inOut',
      })
      .to(redKeychainRef.current, {
        rotation: -6,
        duration: 0.5,
        ease: 'sine.inOut',
      })
      .to(redKeychainRef.current, {
        rotation: 0,
        y: 0,
        duration: 1.4,
        ease: 'elastic.out(1.2, 0.35)',
        onComplete: () => {
          gsap.to(redKeychainRef.current, {
            rotation: 3,
            y: 2,
            duration: 3.2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        },
      });
  };

  const swingSwirlKeychain = () => {
    if (!swirlKeychainRef.current) return;
    gsap.killTweensOf(swirlKeychainRef.current);
    gsap.timeline()
      .to(swirlKeychainRef.current, {
        rotation: -10,
        duration: 0.35,
        ease: 'power2.out',
      })
      .to(swirlKeychainRef.current, {
        rotation: -34,
        duration: 0.45,
        ease: 'sine.inOut',
      })
      .to(swirlKeychainRef.current, {
        rotation: -20,
        duration: 0.5,
        ease: 'sine.inOut',
      })
      .to(swirlKeychainRef.current, {
        rotation: -24.43,
        duration: 1.4,
        ease: 'elastic.out(1.2, 0.35)',
        onComplete: () => {
          gsap.to(swirlKeychainRef.current, {
            rotation: -21.5,
            duration: 2.9,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        },
      });
  };

  return (
    <div
      ref={containerRef}
      style={{
        backgroundColor: '#fca2b6',
        width: '100%',
        height: '100%',
        minHeight: '100dvh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        touchAction: 'pan-y',
      }}
    >
      {/* Fixed collage canvas scaling perfectly for mobile & desktop */}
      <div
        className="figma-collage-canvas"
        style={{
          width: CANVAS_W,
          height: CANVAS_H,
          position: 'relative',
          flexShrink: 0,
          perspective: 1200,
        }}
      >
        {/* Clean Aesthetic Pink Background Base with 4px blur */}
        <div
          style={{
            position: 'absolute',
            top: '-2%',
            left: '-2%',
            width: '104%',
            height: '104%',
            zIndex: 0,
            overflow: 'hidden',
            backgroundColor: '#fca2b6',
            background: 'linear-gradient(180deg, #fba8ba 0%, #fca2b6 40%, #f990a8 100%)',
            filter: 'blur(4px)',
            pointerEvents: 'none',
          }}
        />

        {/* Inner glow overlay */}
        <div
          className="absolute inset-0 pointer-events-none rounded-none"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            boxShadow: 'inset 0px 4px 48.4px 0px rgba(0,0,0,0.25)',
            zIndex: 30,
            pointerEvents: 'none',
          }}
        />

        {/* Group 1 — polaroid mid-left (B&W Mirror Selfie) */}
        <div
          ref={photo1Ref}
          className="figma-polaroid-group"
          style={{
            position: 'absolute',
            left: 7,
            top: 281,
            width: 220,
            height: 290,
            zIndex: 12,
            cursor: 'pointer',
            willChange: 'transform, filter',
            transformOrigin: 'center center',
          }}
          onMouseEnter={() => handleFrameMouseEnter(photo1Ref.current)}
          onMouseMove={(e) => handleFrameMouseMove(e, photo1Ref.current, 0)}
          onMouseLeave={() => handleFrameMouseLeave(photo1Ref.current, 0)}
          onClick={(e) => handlePhotoClick(e, photo1Ref.current, 1, 0)}
          title="Birthday Queen 👑 Tap to zoom!"
        >
          <div
            style={{
              position: 'absolute',
              left: 26.6,
              top: 43.31,
              width: 180.81,
              height: 222.208,
              overflow: 'hidden',
              borderRadius: 2,
              zIndex: 1,
            }}
          >
            <img
              alt="Mirror Selfie"
              src="/assets/photo-mirror-bnw.png"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 18%',
                maxWidth: 'none',
                filter: 'contrast(108%) brightness(102%)',
                pointerEvents: 'none',
              }}
            />
          </div>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 220,
              height: 290,
              zIndex: 2,
              pointerEvents: 'none',
            }}
          >
            <img
              alt="polaroid frame"
              src="/assets/frame-center.png"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                maxWidth: 'none',
                filter: 'drop-shadow(0 14px 28px rgba(45, 15, 28, 0.4))',
              }}
            />
          </div>
        </div>

        {/* Group 2 — polaroid bottom-right (Video Memory with frame-center) */}
        <div
          ref={photo2Ref}
          className="figma-polaroid-group"
          style={{
            position: 'absolute',
            left: 147,
            top: 562,
            width: 220,
            height: 290,
            zIndex: 12,
            cursor: 'pointer',
            willChange: 'transform, filter',
            transformOrigin: 'center center',
          }}
          onMouseEnter={() => handleFrameMouseEnter(photo2Ref.current)}
          onMouseMove={(e) => handleFrameMouseMove(e, photo2Ref.current, 0)}
          onMouseLeave={() => handleFrameMouseLeave(photo2Ref.current, 0)}
          onClick={(e) => handlePhotoClick(e, photo2Ref.current, 2, 0)}
          title="Magical Moments 🎬 Tap to zoom!"
        >
          <div
            style={{
              position: 'absolute',
              left: 19.6,
              top: 43.31,
              width: 180.81,
              height: 222.208,
              overflow: 'hidden',
              borderRadius: 2,
              zIndex: 1,
              backgroundColor: '#000',
            }}
          >
            <video
              src="/assets/memory-video.mp4"
              autoPlay
              loop
              muted
              playsInline
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 15%',
                maxWidth: 'none',
                pointerEvents: 'none',
              }}
            />
          </div>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 220,
              height: 290,
              zIndex: 2,
              pointerEvents: 'none',
            }}
          >
            <img
              alt="polaroid frame"
              src="/assets/frame-center.png"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                maxWidth: 'none',
                filter: 'drop-shadow(0 14px 28px rgba(45, 15, 28, 0.4))',
              }}
            />
          </div>
        </div>

        {/* Group 3 — top polaroid (Outdoor Peace Sign Photo + pearl/puppy frame - Still & Locked) */}
        <div
          ref={photo3Ref}
          className="figma-polaroid-group"
          style={{
            position: 'absolute',
            left: 71,
            top: -9,
            width: 311.074,
            height: 329.493,
            zIndex: 10,
            cursor: 'pointer',
          }}
          onClick={(e) => handlePhotoClick(e, photo3Ref.current, 0, 0)}
          title="Tap to zoom photo 💕"
        >
          <div
            style={{
              position: 'absolute',
              left: 63.24,
              top: 53.55,
              width: 185.628,
              height: 223.219,
              overflow: 'hidden',
              borderRadius: 2,
              zIndex: 1,
            }}
          >
            <img
              alt="Peace Sign Night Photo"
              src="/assets/photo-night-peace.png"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 15%',
                maxWidth: 'none',
                pointerEvents: 'none',
              }}
            />
          </div>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 311.074,
              height: 329.493,
              zIndex: 2,
              pointerEvents: 'none',
            }}
          >
            <img
              alt="polaroid frame large"
              src="/assets/frame-right.png"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                maxWidth: 'none',
                filter: 'drop-shadow(0 14px 28px rgba(45, 15, 28, 0.4))',
              }}
            />
          </div>
        </div>

        {/* Rotated keychain element — bottom-left */}
        <div
          className="figma-keychain-container"
          style={{
            position: 'absolute',
            left: -169,
            top: 520,
            width: 396,
            height: 399.003,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 22,
            cursor: 'pointer',
          }}
          onMouseEnter={swingSwirlKeychain}
          onClick={(e) => handleInteract(e, swingSwirlKeychain)}
          title="Tap or hover to swing keychain 💖"
        >
          <div
            ref={swirlKeychainRef}
            style={{
              transform: 'rotate(-24.43deg)',
              transformOrigin: '40% 60%',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 297.204,
                height: 303.247,
                position: 'relative',
                filter: 'drop-shadow(8px 16px 12px rgba(45, 18, 28, 0.38))',
              }}
            >
              <img
                alt="keychain charm"
                src="/assets/keychain-top.png"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  maxWidth: 'none',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>
        </div>

        {/* Top-right leopard / bow element */}
        <div
          ref={starRef}
          style={{
            position: 'absolute',
            left: 227,
            top: -125,
            width: 297,
            height: 293,
            zIndex: 15,
            filter: 'drop-shadow(6px 14px 12px rgba(45, 15, 25, 0.38))',
          }}
        >
          <img
            alt="leopard print bow"
            src="/assets/leopard-star.png"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              maxWidth: 'none',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Rotated keychain / cherry bow — upper-left */}
        <div
          style={{
            position: 'absolute',
            left: -135,
            top: 22,
            width: 333,
            height: 325.439,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 16,
          }}
        >
          <div
            ref={cherryRef}
            style={{
              transform: 'rotate(-26.04deg)',
              transformOrigin: 'center center',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 254.373,
                height: 237.916,
                position: 'relative',
                overflow: 'hidden',
                filter: 'drop-shadow(6px 14px 10px rgba(45, 15, 25, 0.38))',
              }}
            >
              <img
                alt="flower keychain"
                src="/assets/cherry-bow.png"
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '106.67%',
                  left: 0,
                  top: '-7.51%',
                  maxWidth: 'none',
                  objectFit: 'contain',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>
        </div>

        {/* Central large decorative element — red bow keychain */}
        <div
          ref={redKeychainRef}
          style={{
            position: 'absolute',
            left: 106,
            top: 184,
            width: 522,
            height: 462,
            zIndex: 22,
            cursor: 'pointer',
            transformOrigin: '50% 15%',
            filter: 'drop-shadow(10px 20px 14px rgba(45, 18, 28, 0.42))',
          }}
          onMouseEnter={swingRedKeychain}
          onClick={(e) => handleInteract(e, swingRedKeychain)}
          title="Tap or hover to swing red bow keychain ✨"
        >
          <img
            alt="red bow keychain charm"
            src="/assets/keychain-bottom.png"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              maxWidth: 'none',
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>

      {/* Interactive Photo Zoom & Love Note Modal */}
      <PhotoModal
        photoIndex={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />
    </div>
  );
}
