import React, { useState } from 'react';
import { Volume2, VolumeX, Wind, Smartphone, Maximize2, Palette, Gift, Sparkles } from 'lucide-react';
import { sounds } from '../utils/audio';

export default function ControlsBar({
  isPhoneFrame,
  setIsPhoneFrame,
  theme,
  setTheme,
  onTriggerWind,
  onOpenModal,
}) {
  const [muted, setMuted] = useState(sounds.isMuted());
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const toggleSound = () => {
    const isNowMuted = sounds.toggleMute();
    setMuted(isNowMuted);
    if (!isNowMuted) {
      sounds.playChime(1.0);
    }
  };

  const themes = [
    { id: 'mauve', name: 'Pastel Mauve', color: '#cbbebf', badge: '🎀 Original' },
    { id: 'strawberry', name: 'Strawberry Milk', color: '#f8d0db', badge: '🍓 Pink' },
    { id: 'lavender', name: 'Lavender Dream', color: '#ded7ee', badge: '💜 Lilac' },
    { id: 'midnight', name: 'Starlight Dark', color: '#27222d', badge: '🌙 Night' },
  ];

  return (
    <nav className="controls-bar" aria-label="Interactive Controls">
      {/* Breeze Gust button */}
      <button
        className="ctrl-btn breeze-btn"
        onClick={onTriggerWind}
        title="Make Keychains Sway (Wind Breeze)"
      >
        <Wind size={17} />
        <span className="ctrl-btn-text">Breeze</span>
      </button>

      {/* Birthday Card Button */}
      <button
        className="ctrl-btn gift-btn"
        onClick={onOpenModal}
        title="Open Birthday Wish Card"
      >
        <Gift size={17} />
        <span className="ctrl-btn-text">Wishes</span>
      </button>

      {/* Theme Picker Dropdown */}
      <div className="theme-picker-wrapper">
        <button
          className="ctrl-btn theme-btn"
          onClick={() => setShowThemeMenu(!showThemeMenu)}
          title="Change Color Theme"
        >
          <Palette size={17} />
          <span className="ctrl-btn-text">Theme</span>
        </button>

        {showThemeMenu && (
          <div className="theme-dropdown" onClick={() => setShowThemeMenu(false)}>
            {themes.map((t) => (
              <button
                key={t.id}
                className={`theme-item ${theme === t.id ? 'active' : ''}`}
                onClick={() => {
                  setTheme(t.id);
                  sounds.playPop();
                }}
              >
                <span className="theme-color-dot" style={{ backgroundColor: t.color }} />
                <span>{t.badge}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Frame vs Fullscreen Toggle (desktop only) */}
      <button
        className="ctrl-btn frame-toggle-btn"
        onClick={() => {
          setIsPhoneFrame(!isPhoneFrame);
          sounds.playPop();
        }}
        title={isPhoneFrame ? "Switch to Fullscreen Mode" : "Switch to 3D Phone Mockup"}
      >
        {isPhoneFrame ? <Maximize2 size={17} /> : <Smartphone size={17} />}
        <span className="ctrl-btn-text">{isPhoneFrame ? "Full Screen" : "Phone Frame"}</span>
      </button>

      {/* Audio Mute/Unmute */}
      <button
        className={`ctrl-btn sound-btn ${muted ? 'muted' : ''}`}
        onClick={toggleSound}
        title={muted ? "Unmute Sound" : "Mute Sound"}
      >
        {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
      </button>
    </nav>
  );
}
