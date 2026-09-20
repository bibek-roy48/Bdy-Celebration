import React, { useRef, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import PhoneContainer from './components/PhoneContainer';
import KeychainTop from './components/KeychainTop';
import KeychainBottom from './components/KeychainBottom';
import BalloonBanner from './components/BalloonBanner';
import SparkleTrail from './components/SparkleTrail';
import ScrapbookPage from './components/ScrapbookPage';
import TreatsLetterPage from './components/TreatsLetterPage';
import InstagramGlassLink from './components/InstagramGlassLink';
import { Volume2, VolumeX, ChevronRight, ChevronLeft } from 'lucide-react';
import './App.css';

export default function App() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // 0: Page 1 (Wish), 1: Page 2 (Memories), 2: Page 3 (Treats & Letter)

  // Touch & drag gesture detection
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Play song on user interaction
  const startAudio = useCallback(() => {
    if (audioRef.current && !isPlaying) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Autoplay policy fallback
      });
    }
  }, [isPlaying]);

  // Sparkle burst helper
  const handleSparkle = useCallback((screenX, screenY) => {
    startAudio();
    confetti({
      particleCount: 22,
      spread: 50,
      origin: {
        x: screenX / window.innerWidth,
        y: screenY / window.innerHeight,
      },
      colors: ['#ffffff', '#ffd1dc', '#ffeaa7', '#ff80bf', '#ff9bb5'],
      shapes: ['star', 'circle'],
      scalar: 0.9,
      ticks: 120,
    });
  }, [startAudio]);

  const toggleMute = (e) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    if (!isPlaying) {
      startAudio();
      return;
    }
    const nextMuted = !isMuted;
    audioRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleTouchStart = (e) => {
    startAudio();
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 45) {
      // Swiped Left -> go to next page
      if (currentPage < 2) setCurrentPage((prev) => prev + 1);
    } else if (diff < -45) {
      // Swiped Right -> go to previous page
      if (currentPage > 0) setCurrentPage((prev) => prev - 1);
    }
  };

  const goToPage = (pageIdx) => {
    startAudio();
    setCurrentPage(pageIdx);
  };

  return (
    <div
      className="app-container"
      onClick={startAudio}
      onTouchStart={startAudio}
    >
      {/* Background Audio Element */}
      <audio
        ref={audioRef}
        src="/assets/my_girl.mp3"
        loop
        preload="auto"
      />

      {/* Main Phone UI Container */}
      <PhoneContainer>
        {/* Subtle music toggle indicator in top-right */}
        <button
          className="music-toggle-btn"
          onClick={toggleMute}
          title={isMuted ? "Unmute song" : "Mute song"}
        >
          {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
        </button>

        {/* Floating Page Navigation Switcher (Top Pill - 3 Tabs: Wish, Memories, Treats) */}
        <div className="page-nav-bar" onClick={(e) => e.stopPropagation()}>
          <button
            className={`page-nav-tab ${currentPage === 0 ? 'active' : ''}`}
            onClick={() => goToPage(0)}
            title="Wish"
          >
            <span>Wish</span>
          </button>
          <button
            className={`page-nav-tab ${currentPage === 1 ? 'active' : ''}`}
            onClick={() => goToPage(1)}
            title="Memories"
          >
            <span>Memories</span>
          </button>
          <button
            className={`page-nav-tab ${currentPage === 2 ? 'active' : ''}`}
            onClick={() => goToPage(2)}
            title="Treats & Letter"
          >
            <span>Treats</span>
          </button>
        </div>

        {/* Floating Side Navigation Arrows for effortless browsing */}
        {currentPage > 0 && (
          <button
            className="page-slide-arrow arrow-left"
            onClick={(e) => { e.stopPropagation(); goToPage(currentPage - 1); }}
            title="Previous Page"
          >
            <ChevronLeft size={18} />
          </button>
        )}
        {currentPage < 2 && (
          <button
            className="page-slide-arrow arrow-right"
            onClick={(e) => { e.stopPropagation(); goToPage(currentPage + 1); }}
            title="Next Page"
          >
            <ChevronRight size={18} />
          </button>
        )}

        {/* Interactive Fairy Dust Sparkle Trail */}
        <SparkleTrail />

        {/* Multi-Page Slider Track with Smooth Slide Animation (3 Pages) */}
        <div
          className="phone-slider-track"
          style={{ transform: `translateX(-${currentPage * 100}%)` }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* =========================================
              PAGE 1: 3D Balloon Banner & Keychains
              ========================================= */}
          <div className="phone-slide page-1-slide">
            {/* Top Swirl & Star Keychain */}
            <KeychainTop onSparkle={handleSparkle} />

            {/* Center Happy Birthday 3D Balloon Banner */}
            <BalloonBanner
              onCelebrate={() => {
                startAudio();
                handleSparkle(window.innerWidth / 2, window.innerHeight * 0.46);
              }}
            />

            {/* Bottom Gingham Bear Keychain */}
            <KeychainBottom onSparkle={handleSparkle} />

            {/* Interactive button/hint to explore Scrapbook page */}
            <div
              className="page-peek-hint"
              onClick={(e) => {
                e.stopPropagation();
                goToPage(1);
              }}
            >
              <span>Swipe for photo album</span>
              <ChevronRight size={14} className="hint-arrow" />
            </div>
          </div>

          {/* =========================================
              PAGE 2: Gyaru Aesthetic Scrapbook & Cake
              ========================================= */}
          <div className="phone-slide page-2-slide">
            <ScrapbookPage
              onSparkle={handleSparkle}
              onPlayAudio={startAudio}
            />
          </div>

          {/* =========================================
              PAGE 3: Birthday Letter & Treats Selection
              ========================================= */}
          <div className="phone-slide page-3-slide">
            <TreatsLetterPage
              onSparkle={handleSparkle}
              onPlayAudio={startAudio}
            />
          </div>
        </div>

        {/* Bottom Pagination Dots (3 Pages) */}
        <div className="page-dots-indicator" onClick={(e) => e.stopPropagation()}>
          <span
            className={`dot ${currentPage === 0 ? 'active' : ''}`}
            onClick={() => goToPage(0)}
            title="Page 1: Birthday Wish"
          ></span>
          <span
            className={`dot ${currentPage === 1 ? 'active' : ''}`}
            onClick={() => goToPage(1)}
            title="Page 2: Scrapbook Memories"
          ></span>
          <span
            className={`dot ${currentPage === 2 ? 'active' : ''}`}
            onClick={() => goToPage(2)}
            title="Page 3: Letter & Treats"
          ></span>
        </div>
      </PhoneContainer>
    </div>
  );
}
